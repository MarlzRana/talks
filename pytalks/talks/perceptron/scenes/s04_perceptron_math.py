from manimlib import *


def slide_perceptron_math(scene: Scene):
    heading = Text("The Mathematics", font_size=48, weight=BOLD)
    heading.to_edge(UP, buff=0.5)
    scene.play(Write(heading), run_time=1.0)
    scene.wait()

    # Step 1: Weighted sum
    eq1_text = Text("Weighted Sum:", font_size=28, color=GREY_A)
    eq1 = Tex(
        r"z = w_1 x_1 + w_2 x_2 + b",
        font_size=44,
    )
    eq1_group = VGroup(eq1_text, eq1).arrange(DOWN, buff=0.3)
    eq1_group.move_to(UP * 1.0)

    scene.play(Write(eq1_text), run_time=0.6)
    scene.play(Write(eq1), run_time=1.5)
    scene.wait()

    # Highlight weights
    scene.play(
        eq1["w_1"].animate.set_color(GREEN),
        eq1["w_2"].animate.set_color(GREEN),
        run_time=0.8,
    )
    scene.wait()

    # Highlight inputs
    scene.play(
        eq1["x_1"].animate.set_color(BLUE),
        eq1["x_2"].animate.set_color(BLUE),
        run_time=0.8,
    )
    scene.wait()

    # Highlight bias
    scene.play(eq1["b"].animate.set_color(ORANGE), run_time=0.8)
    scene.wait()

    # Step 2: Activation
    eq2_text = Text("Activation:", font_size=28, color=GREY_A)
    eq2 = Tex(
        r"\hat{y} = \sigma(z)",
        font_size=44,
    )
    eq2_group = VGroup(eq2_text, eq2).arrange(DOWN, buff=0.3)
    eq2_group.move_to(DOWN * 1.2)

    scene.play(Write(eq2_text), run_time=0.6)
    scene.play(Write(eq2), run_time=1.2)
    scene.wait()

    # Step 3: Combined
    combined = Tex(
        r"\hat{y} = \sigma\left(\sum_{i=1}^{n} w_i x_i + b\right)",
        font_size=50,
    )
    combined.move_to(ORIGIN)

    scene.play(
        FadeOut(eq1_group),
        FadeOut(eq2_group),
        run_time=0.8,
    )
    scene.play(Write(combined), run_time=2.0)
    scene.wait()

    general_label = Text(
        "General form for n inputs",
        font_size=24,
        color=GREY_A,
    )
    general_label.next_to(combined, DOWN, buff=0.6)
    scene.play(FadeIn(general_label, shift=UP * 0.2), run_time=0.6)
    scene.wait()
