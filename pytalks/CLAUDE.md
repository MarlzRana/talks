# pytalks

Animated technical presentations powered by **manimgl** (ManimGL v1.7.x).

## Quick Start

```bash
# Run a talk (e.g. the perceptron talk)
PYTHONPATH=. uv run manimgl talks/perceptron/scenes/__init__.py PerceptronTalk -f

# Add -p for presenter mode
PYTHONPATH=. uv run manimgl talks/perceptron/scenes/__init__.py PerceptronTalk -p -f
```

Navigation: **Space/Right** = next slide, **Left** = go back.

## Project Structure

```
pytalks/
├── registry.py          # Central list of all talks (ALL_TALKS)
├── talk_types.py         # TalkConfig dataclass
├── custom_config.yml     # Manim camera config (black background)
├── .env                  # Hue bridge config (gitignored)
├── utils/
│   └── hue/             # Philips Hue smart light control
│       ├── bridge.py    # HTTP helpers (httpx), fire-and-forget light changes
│       └── colors.py    # RGB-to-Hue-XY conversion
├── talks/
│   ├── shared-images/    # Assets shared across talks
│   ├── shared_components/ # Reusable slides & diagram builders
│   │   ├── title_slide.py
│   │   ├── contents_slide.py
│   │   ├── transformer_overview.py
│   │   ├── word2vec_diagrams.py
│   │   └── rnn_diagrams.py
│   └── <talk-slug>/      # One directory per talk
│       ├── __init__.py   # TalkConfig metadata
│       ├── scenes/
│       │   ├── __init__.py        # Main Scene class + SLIDES list
│       │   ├── s01_title.py       # Individual slides (functions)
│       │   └── ...
│       └── components/   # Reusable VGroup builders for this talk
└── prompts/              # Planning docs for future talks (not code)
```

## Adding a New Talk

1. Create `talks/<slug>/` with `__init__.py` exporting a `TalkConfig`.
2. Create `talks/<slug>/scenes/__init__.py` with a `Scene` subclass that aggregates slides via a `SLIDES` list.
3. Add individual slides as `s##_name.py` files — each exports a function `def slide_name(scene: Scene)`.
4. Register the talk in `registry.py` → `ALL_TALKS`.
5. Optionally add `components/` for reusable manimgl VGroups.

## Slide Pattern

Each slide is a standalone function:

```python
def slide_title(scene: Scene):
    title = Text("Hello", font_size=48)
    scene.play(Write(title))
    scene.wait()
```

The main Scene class calls these sequentially and handles back-navigation via a `GoBack` exception.

## Conventions

- Slides are numbered `s01_`, `s02_`, etc.
- Color scheme: inputs = BLUE, hidden = GREEN, outputs = RED, weights = GREEN, bias = ORANGE, activation = RED.
- Components return `VGroup`s (not Scene subclasses).
- `PYTHONPATH=.` is required when running — manimgl needs the project root on the path.

## Hue Light Integration

Presentations can control a Philips Hue smart light to pulse colors in sync with animations (e.g., network layer activations, highlight focus changes).

### Setup

1. Create a `.env` file in the project root (gitignored):
   ```
   HUE_BRIDGE_IP=192.168.x.x
   HUE_BRIDGE_USERNAME=<your-api-key>
   HUE_LIGHT_NAME=Marlin's Room
   ```
2. The bridge IP and username are obtained via the Hue API (press link button + POST to `/api`).
3. If `.env` is missing or the bridge is unreachable, all Hue functions are silent no-ops — slides work identically without a Hue setup.

### API (`utils/hue/`)

- `check_connection()` — verify bridge is reachable
- `get_lights()` — list all connected lights
- `get_light_state_by_name(name=None)` — checkpoint current light state (defaults to `HUE_LIGHT_NAME`)
- `set_light_state_by_id(id, state)` / `set_light_state_by_name(name, state)` — set light state
- `fire_light_change(color_hex, transition_ds=4)` — fire-and-forget color change via daemon thread (non-blocking)
- `fire_light_restore(state, transition_ds=4)` — fire-and-forget restore to a saved state

### Usage in Slides

```python
from utils.hue.bridge import fire_light_change, fire_light_restore, get_light_state_by_name

saved = get_light_state_by_name()       # checkpoint
fire_light_change(RED, transition_ds=6)  # pulse red (ManimGL color constants are hex strings)
fire_light_restore(saved, transition_ds=6)  # restore original
```

`transition_ds` is in deciseconds (4 = 0.4s). All calls are fire-and-forget daemon threads — they never block Manim animations.

## Dependencies

- `manimgl >= 1.7.2` — animation engine
- `httpx` — HTTP client for Hue bridge API
- `python-dotenv` — loads `.env` configuration
- `setuptools < 81` — manimgl requires `pkg_resources` (removed in setuptools 82+)
- `ffmpeg` — required system dependency (install via `brew install ffmpeg`)
