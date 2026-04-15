from manimlib import *

from talks.perceptron.components.neuron import create_neuron


LAYER_COLORS = [BLUE, GREEN, RED, YELLOW, PURPLE]


def create_network(
    layer_sizes: list[int],
    neuron_radius: float = 0.35,
    layer_spacing: float = 2.5,
    neuron_spacing: float = 1.2,
    labels: dict[tuple[int, int], str] | None = None,
) -> tuple[list[list[VGroup]], VGroup, VGroup]:
    """Build a multi-layer network diagram.

    Returns:
        (neurons_by_layer, all_nodes_vgroup, all_edges_vgroup)
        neurons_by_layer[layer_idx][neuron_idx] gives individual neuron VGroups.
    """
    labels = labels or {}
    neurons_by_layer: list[list[VGroup]] = []
    all_nodes = VGroup()
    all_edges = VGroup()

    total_width = (len(layer_sizes) - 1) * layer_spacing
    start_x = -total_width / 2

    for layer_idx, size in enumerate(layer_sizes):
        color = LAYER_COLORS[layer_idx % len(LAYER_COLORS)]
        total_height = (size - 1) * neuron_spacing
        start_y = total_height / 2
        x = start_x + layer_idx * layer_spacing

        layer_neurons: list[VGroup] = []
        for neuron_idx in range(size):
            y = start_y - neuron_idx * neuron_spacing
            label = labels.get((layer_idx, neuron_idx), "")
            neuron = create_neuron(
                label=label,
                radius=neuron_radius,
                color=color,
            )
            neuron.move_to(np.array([x, y, 0]))
            layer_neurons.append(neuron)
            all_nodes.add(neuron)

        neurons_by_layer.append(layer_neurons)

    # Draw edges between adjacent layers
    for layer_idx in range(len(layer_sizes) - 1):
        for src_neuron in neurons_by_layer[layer_idx]:
            for dst_neuron in neurons_by_layer[layer_idx + 1]:
                src_circle = src_neuron[0]  # First child is the Circle
                dst_circle = dst_neuron[0]
                edge = Line(
                    src_circle.get_right(),
                    dst_circle.get_left(),
                    stroke_width=1.5,
                    stroke_color=GREY_B,
                    stroke_opacity=0.6,
                )
                all_edges.add(edge)

    return neurons_by_layer, all_nodes, all_edges
