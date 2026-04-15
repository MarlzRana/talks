from manimlib import *


def create_neuron(
    label: str = "",
    radius: float = 0.4,
    color=BLUE,
    fill_opacity: float = 0.2,
) -> VGroup:
    circle = Circle(radius=radius, color=color, fill_opacity=fill_opacity)
    group = VGroup(circle)
    if label:
        tex = Tex(label, font_size=30).move_to(circle.get_center())
        group.add(tex)
    return group
