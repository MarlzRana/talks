from manimlib import *


def slide_activation(scene: Scene):
    heading = Text("Activation Functions", font_size=48, weight=BOLD)
    heading.to_edge(UP, buff=0.5)
    scene.play(Write(heading), run_time=1.0)
    scene.wait()

    # Axes — smaller to leave room for labels on the right
    axes = Axes(
        x_range=(-5, 5, 1),
        y_range=(-0.5, 1.5, 0.5),
        width=7,
        height=4,
        axis_config={"include_tip": True, "stroke_width": 2},
    )
    axes.shift(LEFT * 1.5 + DOWN * 0.5)
    x_label = Tex("z", font_size=30).next_to(axes.x_axis, RIGHT, buff=0.2)
    y_label = Tex("\\sigma(z)", font_size=30).next_to(axes.y_axis, UP, buff=0.2)

    # Labels positioned to the right of the axes
    label_anchor = axes.get_right() + RIGHT * 0.8 + UP * 1.0

    scene.play(ShowCreation(axes), Write(x_label), Write(y_label), run_time=1.2)
    scene.wait()

    # Step function
    step_graph = VGroup(
        Line(axes.c2p(-5, 0), axes.c2p(0, 0), stroke_color=BLUE, stroke_width=3),
        Line(axes.c2p(0, 1), axes.c2p(5, 1), stroke_color=BLUE, stroke_width=3),
        Dot(axes.c2p(0, 0), radius=0.06, color=BLUE),
        Dot(axes.c2p(0, 1), radius=0.06, color=BLUE, fill_opacity=0),
    )
    step_label = Text("Step Function", font_size=26, color=BLUE)
    step_label.move_to(label_anchor)

    scene.play(ShowCreation(step_graph), Write(step_label), run_time=1.2)
    scene.wait()

    # Sigmoid function
    sigmoid_graph = axes.get_graph(
        lambda x: 1 / (1 + np.exp(-x)),
        x_range=(-5, 5),
        color=YELLOW,
    )
    sigmoid_label = Text("Sigmoid", font_size=26, color=YELLOW)
    sigmoid_label.move_to(label_anchor)

    sigmoid_eq = Tex(
        r"\sigma(z) = \frac{1}{1 + e^{-z}}",
        font_size=30,
        color=YELLOW,
    )
    sigmoid_eq.next_to(sigmoid_label, DOWN, buff=0.4)

    scene.play(
        ReplacementTransform(step_graph, sigmoid_graph),
        ReplacementTransform(step_label, sigmoid_label),
        run_time=1.5,
    )
    scene.play(Write(sigmoid_eq), run_time=1.0)
    scene.wait()

    # ReLU — clamp y range so it doesn't fly off
    relu_graph = axes.get_graph(
        lambda x: min(max(0, x), 1.5),
        x_range=(-5, 5),
        color=GREEN,
    )
    relu_label = Text("ReLU", font_size=26, color=GREEN)
    relu_label.move_to(label_anchor)

    relu_eq = Tex(
        r"\text{ReLU}(z) = \max(0, z)",
        font_size=30,
        color=GREEN,
    )
    relu_eq.next_to(relu_label, DOWN, buff=0.4)

    scene.play(
        ReplacementTransform(sigmoid_graph, relu_graph),
        ReplacementTransform(sigmoid_label, relu_label),
        ReplacementTransform(sigmoid_eq, relu_eq),
        run_time=1.5,
    )
    scene.wait()
