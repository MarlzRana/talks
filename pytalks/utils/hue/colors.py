def hex_to_rgb(hex_str: str) -> tuple[float, float, float]:
    """Convert hex color string like '#58C4DD' to (r, g, b) floats in 0-1 range."""
    h = hex_str.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))


def rgb2xyb(r: float, g: float, b: float) -> tuple[float, float, int]:
    """Convert sRGB (0-1 range) to Philips Hue CIE xy + brightness.

    Returns (x, y, bri) where bri is 0-254.
    """
    r = ((r + 0.055) / 1.055) ** 2.4 if r > 0.04045 else r / 12.92
    g = ((g + 0.055) / 1.055) ** 2.4 if g > 0.04045 else g / 12.92
    b = ((b + 0.055) / 1.055) ** 2.4 if b > 0.04045 else b / 12.92

    X = r * 0.4124 + g * 0.3576 + b * 0.1805
    Y = r * 0.2126 + g * 0.7152 + b * 0.0722
    Z = r * 0.0193 + g * 0.1192 + b * 0.9505

    total = X + Y + Z
    if total == 0:
        return 0.0, 0.0, 0

    return X / total, Y / total, int(Y * 254)
