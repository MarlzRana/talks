from manimlib import *

from talks.perceptron.components.neuron import create_neuron


def slide_single_perceptron(scene: Scene):
    heading = Text("A Single Perceptron", font_size=48, weight=BOLD)
    heading.to_edge(UP, buff=0.5)
    scene.play(Write(heading), run_time=1.0)
    scene.wait()

    # Neuron in center
    neuron = create_neuron(radius=0.5, color=YELLOW)
    sigma = Tex(r"\Sigma", font_size=36).move_to(neuron.get_center())

    # Input nodes
    x1_node = create_neuron(label="x_1", radius=0.35, color=BLUE)
    x2_node = create_neuron(label="x_2", radius=0.35, color=BLUE)
    x1_node.move_to(LEFT * 3.5 + UP * 1.2)
    x2_node.move_to(LEFT * 3.5 + DOWN * 1.2)

    # Output node
    output_node = create_neuron(label=r"\hat{y}", radius=0.35, color=RED)
    output_node.move_to(RIGHT * 3.5)

    # Arrows from inputs to neuron
    arrow_x1 = Arrow(
        x1_node[0].get_right(), neuron[0].get_left() + UP * 0.2,
        buff=0.1, stroke_width=3, color=GREY_A,
    )
    arrow_x2 = Arrow(
        x2_node[0].get_right(), neuron[0].get_left() + DOWN * 0.2,
        buff=0.1, stroke_width=3, color=GREY_A,
    )

    # Arrow from neuron to output
    arrow_out = Arrow(
        neuron[0].get_right(), output_node[0].get_left(),
        buff=0.1, stroke_width=3, color=GREY_A,
    )

    # Weight labels
    w1_label = Tex("w_1", font_size=28, color=GREEN).next_to(arrow_x1, UP, buff=0.15)
    w2_label = Tex("w_2", font_size=28, color=GREEN).next_to(arrow_x2, DOWN, buff=0.15)

    # Bias label
    bias_label = Tex("+b", font_size=24, color=ORANGE)
    bias_label.next_to(neuron, DOWN, buff=0.4)

    # Activation label on output arrow
    act_label = Tex(r"\sigma", font_size=28, color=RED_B)
    act_label.next_to(arrow_out, UP, buff=0.15)

    # Build up step by step
    scene.play(ShowCreation(neuron), run_time=0.8)
    scene.play(Write(sigma), run_time=0.5)
    scene.wait()

    scene.play(
        FadeIn(x1_node, shift=RIGHT * 0.3),
        FadeIn(x2_node, shift=RIGHT * 0.3),
        run_time=0.8,
    )
    scene.play(
        ShowCreation(arrow_x1),
        ShowCreation(arrow_x2),
        run_time=0.8,
    )
    scene.wait()

    scene.play(Write(w1_label), Write(w2_label), run_time=0.8)
    scene.play(Write(bias_label), run_time=0.6)
    scene.wait()

    scene.play(ShowCreation(arrow_out), run_time=0.6)
    scene.play(Write(act_label), run_time=0.5)
    scene.play(FadeIn(output_node, shift=RIGHT * 0.3), run_time=0.6)
    scene.wait()
