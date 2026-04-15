from manimlib import *

from talks.perceptron.components.network import create_network


def slide_multi_layer(scene: Scene):
    heading = Text("Building a Network", font_size=48, weight=BOLD)
    heading.to_edge(UP, buff=0.5)
    scene.play(Write(heading), run_time=1.0)
    scene.wait()

    # Start with a single perceptron (1 -> 1)
    single_neurons, single_nodes, single_edges = create_network(
        [1, 1],
        neuron_radius=0.4,
        layer_spacing=3.0,
    )
    single_group = VGroup(single_edges, single_nodes)

    scene.play(FadeIn(single_group), run_time=1.0)
    scene.wait()

    # Expand to 2-1 (two inputs, one output)
    net_2_1_neurons, net_2_1_nodes, net_2_1_edges = create_network(
        [2, 1],
        neuron_radius=0.4,
        layer_spacing=3.0,
    )
    net_2_1_group = VGroup(net_2_1_edges, net_2_1_nodes)

    scene.play(
        ReplacementTransform(single_group, net_2_1_group),
        run_time=1.2,
    )
    label_2_1 = Text("2 inputs, 1 output", font_size=24, color=GREY_A)
    label_2_1.to_edge(DOWN, buff=0.5)
    scene.play(FadeIn(label_2_1), run_time=0.5)
    scene.wait()

    # Expand to 2-3-1
    labels = {
        (0, 0): "x_1",
        (0, 1): "x_2",
        (2, 0): r"\hat{y}",
    }
    net_neurons, net_nodes, net_edges = create_network(
        [2, 3, 1],
        neuron_radius=0.4,
        layer_spacing=3.0,
        neuron_spacing=1.3,
        labels=labels,
    )
    net_group = VGroup(net_edges, net_nodes)

    label_2_3_1 = Text("2-3-1 Network", font_size=24, color=GREY_A)
    label_2_3_1.to_edge(DOWN, buff=0.5)

    scene.play(
        FadeOut(label_2_1),
        ReplacementTransform(net_2_1_group, net_group),
        run_time=1.5,
    )
    scene.play(FadeIn(label_2_3_1), run_time=0.5)
    scene.wait()

    # Label the layers
    input_label = Text("Input", font_size=22, color=BLUE)
    hidden_label = Text("Hidden", font_size=22, color=GREEN)
    output_label = Text("Output", font_size=22, color=RED)

    input_label.next_to(VGroup(*[n for n in net_neurons[0]]), DOWN, buff=0.6)
    hidden_label.next_to(VGroup(*[n for n in net_neurons[1]]), DOWN, buff=0.6)
    output_label.next_to(VGroup(*[n for n in net_neurons[2]]), DOWN, buff=0.6)

    scene.play(
        Write(input_label),
        Write(hidden_label),
        Write(output_label),
        run_time=1.0,
    )
    scene.wait()
