from __future__ import annotations

import os
import threading

import httpx
from dotenv import load_dotenv

from utils.hue.colors import hex_to_rgb, rgb2xyb

load_dotenv()

_BRIDGE_IP = os.getenv("HUE_BRIDGE_IP")
_USERNAME = os.getenv("HUE_BRIDGE_USERNAME")
_LIGHT_NAME = os.getenv("HUE_LIGHT_NAME")
_BASE_URL = (
    f"https://{_BRIDGE_IP}/api/{_USERNAME}" if _BRIDGE_IP and _USERNAME else None
)
_CLIENT = httpx.Client(verify=False, timeout=5.0) if _BASE_URL else None

_name_to_id_cache: dict[str, int] = {}


def check_connection() -> bool:
    """Return True if the bridge is reachable and the API user is valid."""
    if _CLIENT is None:
        return False
    try:
        resp = _CLIENT.get(f"{_BASE_URL}/lights")
        return resp.status_code == 200
    except Exception:
        return False


def get_lights() -> dict | None:
    """Return the full lights dict from the bridge, or None on failure."""
    if _CLIENT is None:
        return None
    try:
        resp = _CLIENT.get(f"{_BASE_URL}/lights")
        return resp.json()
    except Exception:
        return None


def set_light_state_by_id(light_id: int, state: dict) -> bool:
    """Set the state of a light by its numeric ID. Returns True on success."""
    if _CLIENT is None:
        return False
    try:
        resp = _CLIENT.put(f"{_BASE_URL}/lights/{light_id}/state", json=state)
        return resp.status_code == 200
    except Exception:
        return False


def set_light_state_by_name(name: str, state: dict) -> bool:
    """Set the state of a light by its name. Returns True on success."""
    if name in _name_to_id_cache:
        return set_light_state_by_id(_name_to_id_cache[name], state)

    lights = get_lights()
    if lights is None:
        return False

    for light_id, info in lights.items():
        _name_to_id_cache[info["name"]] = int(light_id)

    if name not in _name_to_id_cache:
        return False

    return set_light_state_by_id(_name_to_id_cache[name], state)


def get_light_state_by_name(name: str | None = None) -> dict | None:
    """Get the current state of a light by name. Defaults to HUE_LIGHT_NAME from .env."""
    if _CLIENT is None:
        return None
    if name is None:
        name = _LIGHT_NAME
    if name is None:
        return None

    # Ensure name-to-ID cache is populated
    if name not in _name_to_id_cache:
        lights = get_lights()
        if lights is None:
            return None
        for light_id, info in lights.items():
            _name_to_id_cache[info["name"]] = int(light_id)

    if name not in _name_to_id_cache:
        return None

    try:
        resp = _CLIENT.get(f"{_BASE_URL}/lights/{_name_to_id_cache[name]}")
        return resp.json().get("state")
    except Exception:
        return None


def fire_light_restore(state: dict, transition_ds: int = 4) -> None:
    """Fire-and-forget: restore the configured light to a previously saved state.

    Accepts a state dict from get_light_state_by_name().
    """
    if _CLIENT is None or state is None:
        return

    restore_state = {"on": state.get("on", True), "transitiontime": transition_ds}
    if "xy" in state:
        restore_state["xy"] = list(state["xy"])
    if "bri" in state:
        restore_state["bri"] = state["bri"]
    if "ct" in state:
        restore_state["ct"] = state["ct"]

    thread = threading.Thread(
        target=set_light_state_by_name,
        args=(_LIGHT_NAME, restore_state),
        daemon=True,
    )
    thread.start()


def fire_light_change(color_hex: str, transition_ds: int = 4) -> None:
    """Fire-and-forget: set the configured light to the given hex color.

    Spawns a daemon thread so the Manim animation is never blocked.
    No-op if Hue is not configured.
    """
    if _CLIENT is None:
        return

    r, g, b = hex_to_rgb(color_hex)
    x, y, bri = rgb2xyb(r, g, b)
    state = {
        "on": True,
        "xy": [x, y],
        "bri": max(bri, 1),
        "transitiontime": transition_ds,
    }

    thread = threading.Thread(
        target=set_light_state_by_name,
        args=(_LIGHT_NAME, state),
        daemon=True,
    )
    thread.start()
