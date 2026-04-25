from manimlib import *

from talks.shared_components.rnn_diagrams import (
    build_rnn,
    build_unrolled_rnn_classification,
    build_unrolled_rnn_seq_labelling,
)

_DIM = 0.15


def _build_rnn_equations(center):
    """LaTeX equations for the vanilla RNN."""
    eq_line1 = Tex(
        r"h_t = f_t(x_t, \, h_{t-1}, \, W_t, \, b_t)",
        font_size=24,
    )
    eq_line2 = Tex(
        r"= \tanh(W_{t,x} \cdot x_t + W_{t,h} \cdot h_{t-1} + b_t)",
        font_size=24,
    )
    eq_line2.next_to(eq_line1, DOWN, buff=0.15, aligned_edge=LEFT)
    eq_line2.shift(RIGHT * 0.5)
    eq = VGroup(eq_line1, eq_line2)

    sym_f = Tex(r"f_t", r"\text{ = arbitrary ANN}", font_size=18, color=GREY_A)
    sym_x = Tex(r"x_t", r"\text{ = current input}", font_size=18, color=GREY_A)
    sym_h = Tex(r"h_{t-1}", r"\text{ = prior hidden state}", font_size=18, color=GREY_A)
    sym_w = Tex(r"W_t", r"\text{ = weights for the t-th cell}", font_size=18, color=GREY_A)
    sym_b = Tex(r"b_t", r"\text{ = bias term for the t-th cell}", font_size=18, color=GREY_A)

    panel = VGroup(eq, sym_f, sym_x, sym_h, sym_w, sym_b)
    panel.arrange(DOWN, buff=0.3, aligned_edge=LEFT)
    panel.move_to(center)
    return panel


def slide_rnn(scene: Scene):
    # ── Part 1: Rolled RNN ──────────────────────────────────────────────────
    # Reset frame in case previous slide left it shifted/zoomed
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(8)

    title = Text("Recurrent Neural Network", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.5)

    rnn_diagram, rnn_label = build_rnn(ORIGIN + DOWN * 0.5)
    rnn_diagram.scale(0.65, about_point=ORIGIN + DOWN * 0.5)
    rnn_label.scale(0.65, about_point=ORIGIN + DOWN * 0.5)

    scene.play(Write(title), run_time=0.8)
    scene.play(
        FadeIn(rnn_diagram, shift=UP * 0.3),
        FadeIn(rnn_label, shift=UP * 0.3),
        run_time=0.6,
    )

    # >>> WAIT: presenter explains the recursive/rolled nature <<<
    scene.wait()

    # ── Part 2: Unroll the RNN (classification) ─────────────────────────────
    scene.play(
        FadeOut(rnn_diagram),
        FadeOut(rnn_label),
        run_time=0.5,
    )

    # Build unrolled RNN for classification
    words = ["The", "grand", "car"]
    unrolled, h0_group, steps = build_unrolled_rnn_classification(
        ORIGIN + DOWN * 0.3, words, "Automotive"
    )
    unrolled.scale(0.65, about_point=ORIGIN)
    unrolled.shift(LEFT * 2.5)

    # Start diagram dimmed, show equations immediately alongside
    unrolled.set_opacity(_DIM)
    eq_panel = _build_rnn_equations(np.array([4.5, 0, 0]))

    scene.play(
        FadeIn(unrolled),
        FadeIn(eq_panel, shift=LEFT * 0.3),
        run_time=0.6,
    )

    # >>> WAIT: presenter sees dimmed diagram + equations <<<
    scene.wait()

    # ── Progressive activation: walk through the network ────────────────────

    # Step 0: light up h_0 arrow
    scene.play(h0_group.animate.set_opacity(1.0), run_time=0.4)
    scene.wait()

    # Steps 1-3: for each cell, light up input → cell → h_right (+ output for last)
    for i, step in enumerate(steps):
        # Input arrives + cell activates
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        # For the last cell: also show output path
        if "h_up" in step:
            scene.play(
                step["h_up"].animate.set_opacity(1.0),
                step["ann"].animate.set_opacity(1.0),
                step["output"].animate.set_opacity(1.0),
                run_time=0.4,
            )
            scene.wait()

        # Hidden state passes to next cell
        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.4)
        scene.wait()

    # ── Part 3: Swap to sequence labelling example ──────────────────────────
    scene.play(FadeOut(unrolled), run_time=0.5)

    # Build sequence labelling variant
    seq_words = ["The", "grand", "car"]
    seq_labels = ["Article", "Adjective", "Noun"]
    seq_unrolled, seq_h0, seq_steps = build_unrolled_rnn_seq_labelling(
        ORIGIN + DOWN * 0.3, seq_words, seq_labels
    )
    seq_unrolled.scale(0.65, about_point=ORIGIN)
    seq_unrolled.shift(LEFT * 2.5)

    # Start dimmed
    seq_unrolled.set_opacity(_DIM)

    scene.play(FadeIn(seq_unrolled), run_time=0.6)
    scene.wait()

    # Progressive activation for sequence labelling
    scene.play(seq_h0.animate.set_opacity(1.0), run_time=0.4)
    scene.wait()

    for i, step in enumerate(seq_steps):
        # Input + cell
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        # Output path (every cell has one in seq labelling)
        scene.play(
            step["h_up"].animate.set_opacity(1.0),
            step["ann"].animate.set_opacity(1.0),
            step["output"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        # Hidden state to next
        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.4)
        scene.wait()
