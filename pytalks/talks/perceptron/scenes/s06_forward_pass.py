from manimlib import *

from talks.perceptron.components.network import create_network


def slide_forward_pass(scene: Scene):
    heading = Text("Forward Pass", font_size=48, weight=BOLD)
    heading.to_edge(UP, buff=0.5)
    scene.play(Write(heading), run_time=1.0)
    scene.wait()

    labels = {
        (0, 0): "x_1",
        (0, 1): "x_2",
        (2, 0): r"\hat{y}",
    }
    neurons, nodes, edges = create_network(
        [2, 3, 1],
        neuron_radius=0.4,
        layer_spacing=3.0,
        neuron_spacing=1.3,
        labels=labels,
    )
    network = VGroup(edges, nodes)
    scene.play(FadeIn(network), run_time=1.0)
    scene.wait()

    # Forward pass animation: layer by layer
    # Step 1: Light up input neurons
    input_anims = []
    for neuron in neurons[0]:
        input_anims.append(
            neuron[0].animate.set_fill(BLUE, opacity=0.8)
        )
    scene.play(*input_anims, run_time=0.8)
    scene.wait()

    # Step 2: Signal travels along edges from input to hidden
    edge_idx = 0
    input_to_hidden_edges = []
    for _src in neurons[0]:
        for _dst in neurons[1]:
            input_to_hidden_edges.append(edges[edge_idx])
            edge_idx += 1

    # Animate edges lighting up
    scene.play(
        LaggedStart(
            *[
                edge.animate.set_stroke(YELLOW, width=3, opacity=1.0)
                for edge in input_to_hidden_edges
            ],
            lag_ratio=0.1,
        ),
        run_time=1.5,
    )
    scene.wait()

    # Step 3: Hidden neurons activate
    hidden_anims = []
    for neuron in neurons[1]:
        hidden_anims.append(
            neuron[0].animate.set_fill(GREEN, opacity=0.8)
        )
    scene.play(*hidden_anims, run_time=0.8)
    scene.wait()

    # Step 4: Signal travels from hidden to output
    hidden_to_output_edges = []
    for _src in neurons[1]:
        for _dst in neurons[2]:
            hidden_to_output_edges.append(edges[edge_idx])
            edge_idx += 1

    scene.play(
        LaggedStart(
            *[
                edge.animate.set_stroke(YELLOW, width=3, opacity=1.0)
                for edge in hidden_to_output_edges
            ],
            lag_ratio=0.15,
        ),
        run_time=1.2,
    )
    scene.wait()

    # Step 5: Output neuron activates
    scene.play(
        neurons[2][0][0].animate.set_fill(RED, opacity=0.8),
        run_time=0.8,
    )
    scene.wait()

    # Final: Show output value
    output_value = Tex(r"\hat{y} = 0.87", font_size=36, color=RED_B)
    output_value.next_to(neurons[2][0], RIGHT, buff=0.6)
    scene.play(Write(output_value), run_time=0.8)
    scene.wait()

    # Closing text
    closing = Text(
        "Each neuron computes: activate(weighted sum + bias)",
        font_size=28,
        color=GREY_A,
    )
    closing.to_edge(DOWN, buff=0.8)
    scene.play(FadeIn(closing, shift=UP * 0.2), run_time=0.8)
    scene.wait()
