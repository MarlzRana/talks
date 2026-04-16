import random
import tempfile
from pathlib import Path

from manimlib import *
from PIL import Image, ImageDraw


def _make_circular_image(src_path: str) -> str:
    """Crop an image to a circle with transparent background, return temp file path."""
    img = Image.open(src_path).convert("RGBA")
    size = min(img.size)
    # Center crop to square
    left = (img.width - size) // 2
    top = (img.height - size) // 2
    img = img.crop((left, top, left + size, top + size))
    # Apply circular mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    img.putalpha(mask)
    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    img.save(tmp.name)
    return tmp.name


def _build_background_network():
    """Build a wide, faded multi-layer network. Returns (network, edges, neurons_by_layer, layer_colors)."""
    layer_sizes = [4, 6, 8, 6, 4, 2]
    layer_colors = [BLUE, TEAL, GREEN, YELLOW, ORANGE, RED]
    neuron_radius = 0.18
    layer_spacing = 2.2
    neuron_spacing = 0.9

    all_nodes = VGroup()
    all_edges = VGroup()
    edges_by_layer: list[VGroup] = []
    neurons_by_layer: list[VGroup] = []

    total_width = (len(layer_sizes) - 1) * layer_spacing
    start_x = -total_width / 2

    for layer_idx, size in enumerate(layer_sizes):
        color = layer_colors[layer_idx % len(layer_colors)]
        total_height = (size - 1) * neuron_spacing
        start_y = total_height / 2
        x = start_x + layer_idx * layer_spacing

        layer_node_group = VGroup()
        for neuron_idx in range(size):
            y = start_y - neuron_idx * neuron_spacing
            circle = Circle(
                radius=neuron_radius,
                color=color,
                fill_opacity=0.08,
                stroke_opacity=0.25,
                stroke_width=1.5,
            )
            circle.move_to(np.array([x, y, 0]))
            layer_node_group.add(circle)
            all_nodes.add(circle)
        neurons_by_layer.append(layer_node_group)

    for layer_idx in range(len(layer_sizes) - 1):
        layer_edge_group = VGroup()
        for src in neurons_by_layer[layer_idx]:
            for dst in neurons_by_layer[layer_idx + 1]:
                edge = Line(
                    src.get_right(),
                    dst.get_left(),
                    stroke_width=1.0,
                    stroke_color=GREY_C,
                    stroke_opacity=0.15,
                )
                layer_edge_group.add(edge)
                all_edges.add(edge)
        edges_by_layer.append(layer_edge_group)

    network = VGroup(all_edges, all_nodes)
    network.move_to(ORIGIN).shift(UP * 0.5)
    return network, neurons_by_layer, edges_by_layer, layer_colors


def slide_title(scene: Scene):
    # Wait for presenter to start screenshare
    scene.wait()

    # Build background network
    network, neurons_by_layer, edges_by_layer, layer_colors = _build_background_network()

    # Fade in the dim network structure
    scene.play(FadeIn(network), run_time=1.5)

    # Animate layer-by-layer activation: light up nodes then edges to next layer
    for i, layer_nodes in enumerate(neurons_by_layer):
        color = layer_colors[i % len(layer_colors)]
        # Pulse nodes in this layer to a brighter state
        scene.play(
            *[
                n.animate.set_fill(color, opacity=0.4).set_stroke(color, opacity=0.8)
                for n in layer_nodes
            ],
            # Also light up outgoing edges
            *(
                [
                    e.animate.set_stroke(color, opacity=0.5, width=2.0)
                    for e in edges_by_layer[i]
                ]
                if i < len(edges_by_layer)
                else []
            ),
            run_time=0.4,
        )
        # Fade back to dim
        scene.play(
            *[
                n.animate.set_fill(color, opacity=0.08).set_stroke(color, opacity=0.25)
                for n in layer_nodes
            ],
            *(
                [
                    e.animate.set_stroke(GREY_C, opacity=0.15, width=1.0)
                    for e in edges_by_layer[i]
                ]
                if i < len(edges_by_layer)
                else []
            ),
            run_time=0.3,
        )

    # Profile picture
    circular_path = _make_circular_image(
        str(Path(__file__).parent.parent.parent / "shared-images" / "profile_picture.png"),
    )
    profile_pic = ImageMobject(circular_path)
    profile_pic.set_height(0.75)
    profile_pic.to_corner(UL, buff=0.5)

    title = Text(
        "Processing Natural Language\nusing Deep Learning Techniques",
        font_size=52,
        weight=BOLD,
        alignment="CENTER",
    )
    part = Text(
        "Part 1",
        font_size=40,
        color=BLUE_C,
        weight=BOLD,
    )
    author = Text(
        "Marlin Ranasinghe",
        font_size=32,
        color=GREY_A,
    )

    part.next_to(title, DOWN, buff=0.4)
    author.next_to(part, DOWN, buff=0.8)

    scene.play(FadeIn(profile_pic, shift=RIGHT * 0.3), run_time=0.8)
    scene.play(Write(title), run_time=1.5)
    scene.play(FadeIn(part, shift=UP * 0.3), run_time=0.8)
    scene.play(FadeIn(author, shift=UP * 0.2), run_time=0.8)
    scene.wait()
