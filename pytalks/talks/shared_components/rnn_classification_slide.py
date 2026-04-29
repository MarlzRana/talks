from manimlib import *

from talks.shared_components.rnn_diagrams import build_unrolled_rnn_classification

_DIM = 0.15


def slide_rnn_classification(scene: Scene):
    """Standalone slide showing an unrolled RNN for classification with progressive activation."""
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(8)

    title = Text("RNN for Classification", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.5)

    words = ["The", "grand", "car"]
    unrolled, h0_group, steps = build_unrolled_rnn_classification(
        ORIGIN + DOWN * 0.3, words, "Automotive"
    )
    unrolled.scale(0.65, about_point=ORIGIN)

    # Start dimmed
    unrolled.set_opacity(_DIM)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(unrolled), run_time=0.6)
    scene.wait()

    # Progressive activation
    scene.play(h0_group.animate.set_opacity(1.0), run_time=0.4)
    scene.wait()

    for i, step in enumerate(steps):
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        if "h_up" in step:
            scene.play(
                step["h_up"].animate.set_opacity(1.0),
                step["ann"].animate.set_opacity(1.0),
                step["output"].animate.set_opacity(1.0),
                run_time=0.4,
            )
            scene.wait()

        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.4)
        scene.wait()
