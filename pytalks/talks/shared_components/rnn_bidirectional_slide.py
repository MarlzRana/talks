from manimlib import *

from talks.shared_components.word2vec_diagrams import vector_block, thin_arrow

_DIM = 0.15
_CELL_SPACING = 3.5


def _concat_block(center, width, height, n_dots):
    """A concatenated output block with left-half BLUE and right-half RED dots."""
    rect = RoundedRectangle(
        width=width, height=height, corner_radius=0.08,
        color=WHITE, fill_opacity=0.03, stroke_width=1.5, stroke_opacity=0.6,
    )
    rect.move_to(center)

    # Left half: blue dots (forward hidden state)
    # Right half: red dots (backward hidden state)
    dots = VGroup()
    half_dots = n_dots // 2
    usable = width * 0.8
    total_dots = n_dots
    for i in range(total_dots):
        x = -(usable / 2) + i * (usable / max(total_dots - 1, 1))
        color = BLUE if i < half_dots else RED
        dot = Circle(
            radius=0.04,
            color=color,
            fill_opacity=0.6,
            stroke_width=1,
            stroke_opacity=0.6,
        )
        dot.move_to(center + np.array([x, 0, 0]))
        dots.add(dot)

    return VGroup(rect, dots)


def _build_bidirectional_rnn(center):
    """Build the full bidirectional RNN diagram.

    Returns (diagram, fwd_steps, bwd_steps, fwd_h0, bwd_h0, concat_group, equations).
    """
    c = center
    words = ["this", "is", "cat"]
    num_cells = len(words)

    # Vertical positioning
    chain_y = c[1]  # RNN cells row
    concat_y = c[1] + 3.2  # concatenated outputs at top
    eq_y = c[1] - 4.0  # equations at bottom

    # Forward chain on left, backward chain on right
    fwd_start_x = c[0] - 6.5
    bwd_start_x = c[0] + 3.5

    # ====== FORWARD CHAIN (BLUE, left-to-right) ======
    fwd_group = VGroup()
    fwd_steps = []
    fwd_cell_centers = []

    for i in range(num_cells):
        fwd_cell_centers.append(np.array([fwd_start_x + i * _CELL_SPACING, chain_y, 0]))

    # h₀ arrow
    fwd_h0_start = fwd_cell_centers[0] + LEFT * 1.6
    fwd_h0_end = fwd_cell_centers[0] + LEFT * 0.5
    fwd_h0_arrow = thin_arrow(fwd_h0_start, fwd_h0_end, color=BLUE, opacity=0.7)
    fwd_h0_label = Tex(r"h_0", font_size=22, color=BLUE_B)
    fwd_h0_label.move_to((fwd_h0_start + fwd_h0_end) / 2 + UP * 0.3)
    fwd_h0 = VGroup(fwd_h0_arrow, fwd_h0_label)
    fwd_group.add(fwd_h0)

    for i in range(num_cells):
        cc = fwd_cell_centers[i]
        step = {}

        # Cell
        cell = vector_block(0.7, 1.8, 4, BLUE, dot_radius=0.05)
        cell.move_to(cc)
        step["cell"] = cell
        fwd_group.add(cell)

        # Input below
        x_arrow = thin_arrow(cc + DOWN * 1.8, cc + DOWN * 1.0, color=WHITE, opacity=0.7)
        x_label = Tex(rf"x_{{{i+1}}}", font_size=22, color=BLUE_B)
        x_label.move_to(cc + DOWN * 2.1)
        word_label = Text(words[i], font_size=24, color=GREY_B, weight=BOLD)
        word_label.move_to(cc + DOWN * 2.6)
        step["input"] = VGroup(x_arrow, x_label, word_label)
        fwd_group.add(step["input"])

        # h_right arrow (→ direction)
        if i < num_cells - 1:
            h_start = cc + RIGHT * 0.45
            h_end = fwd_cell_centers[i + 1] + LEFT * 0.45
        else:
            h_start = cc + RIGHT * 0.45
            h_end = cc + RIGHT * 1.0
        h_arrow = thin_arrow(h_start, h_end, color=BLUE, opacity=0.7)
        h_label = Tex(rf"h_{{{i+1}}}", font_size=20, color=BLUE_B)
        h_label.move_to((h_start + h_end) / 2 + UP * 0.3)
        step["h_right"] = VGroup(h_arrow, h_label)
        fwd_group.add(step["h_right"])

        fwd_steps.append(step)

    # Forward label
    fwd_label = Text('original: "this is cat"', font_size=28, color=BLUE_B)
    fwd_label.move_to(np.array([
        (fwd_cell_centers[0][0] + fwd_cell_centers[-1][0]) / 2,
        chain_y - 3.3,
        0,
    ]))
    fwd_group.add(fwd_label)

    # ====== BACKWARD CHAIN (RED, right-to-left) ======
    bwd_group = VGroup()
    bwd_steps = []
    bwd_cell_centers = []

    for i in range(num_cells):
        bwd_cell_centers.append(np.array([bwd_start_x + i * _CELL_SPACING, chain_y, 0]))

    # ĥ₀ arrow (enters from the right)
    bwd_h0_start = bwd_cell_centers[-1] + RIGHT * 1.6
    bwd_h0_end = bwd_cell_centers[-1] + RIGHT * 0.5
    bwd_h0_arrow = thin_arrow(bwd_h0_start, bwd_h0_end, color=RED, opacity=0.7)
    bwd_h0_label = Tex(r"\hat{h}_0", font_size=22, color=RED_B)
    bwd_h0_label.move_to((bwd_h0_start + bwd_h0_end) / 2 + UP * 0.3)
    bwd_h0 = VGroup(bwd_h0_arrow, bwd_h0_label)
    bwd_group.add(bwd_h0)

    # Backward words in same spatial order as forward, but processed R→L
    bwd_words = ["this", "is", "cat"]

    for i in range(num_cells):
        cc = bwd_cell_centers[i]
        step = {}

        # Cell
        cell = vector_block(0.7, 1.8, 4, RED, dot_radius=0.05)
        cell.move_to(cc)
        step["cell"] = cell
        bwd_group.add(cell)

        # Input below
        x_arrow = thin_arrow(cc + DOWN * 1.8, cc + DOWN * 1.0, color=WHITE, opacity=0.7)
        x_label = Tex(rf"\hat{{x}}_{{{num_cells - i}}}", font_size=22, color=RED_B)
        x_label.move_to(cc + DOWN * 2.1)
        word_label = Text(bwd_words[i], font_size=24, color=GREY_B, weight=BOLD)
        word_label.move_to(cc + DOWN * 2.6)
        step["input"] = VGroup(x_arrow, x_label, word_label)
        bwd_group.add(step["input"])

        # h_left arrow (← direction)
        if i > 0:
            h_start = cc + LEFT * 0.45
            h_end = bwd_cell_centers[i - 1] + RIGHT * 0.45
        else:
            h_start = cc + LEFT * 0.45
            h_end = cc + LEFT * 1.0
        h_arrow = thin_arrow(h_start, h_end, color=RED, opacity=0.7)
        h_label = Tex(rf"\hat{{h}}_{{{num_cells - i}}}", font_size=20, color=RED_B)
        h_label.move_to((h_start + h_end) / 2 + UP * 0.3)
        step["h_left"] = VGroup(h_arrow, h_label)
        bwd_group.add(step["h_left"])

        bwd_steps.append(step)

    # Backward label
    bwd_label = Text('reversed: "cat is this"', font_size=28, color=RED_B)
    bwd_label.move_to(np.array([
        (bwd_cell_centers[0][0] + bwd_cell_centers[-1][0]) / 2,
        chain_y - 3.3,
        0,
    ]))
    bwd_group.add(bwd_label)

    # ====== CONCATENATED OUTPUTS (top) ======
    concat_group = VGroup()

    # Position each concat block centered between the corresponding forward and backward cells
    concat_x_positions = [
        (fwd_cell_centers[i][0] + bwd_cell_centers[i][0]) / 2
        for i in range(num_cells)
    ]

    concat_labels_text = [
        (r"h_{\text{this}}", r"[h_1, \hat{h}_3]"),
        (r"h_{\text{is}}", r"[h_2, \hat{h}_2]"),
        (r"h_{\text{cat}}", r"[h_3, \hat{h}_1]"),
    ]

    for i in range(num_cells):
        cx = concat_x_positions[i]
        cy = concat_y

        # Concatenated block
        block = _concat_block(np.array([cx, cy, 0]), 1.8, 0.4, 8)
        concat_group.add(block)

        # Label above
        h_word_label = Tex(concat_labels_text[i][0], font_size=22, color=WHITE)
        h_word_label.move_to(np.array([cx - 0.7, cy + 0.55, 0]))
        bracket_label = Tex(concat_labels_text[i][1], font_size=18, color=GREY_A)
        bracket_label.move_to(np.array([cx + 0.7, cy + 0.55, 0]))
        concat_group.add(h_word_label, bracket_label)

        # Arrow from forward cell up to concat block (BLUE)
        # Forward cell i produces h_{i+1} for word i
        fwd_cc = fwd_cell_centers[i]
        fwd_up_arrow = thin_arrow(
            fwd_cc + UP * 1.0,
            np.array([cx - 0.3, cy - 0.25, 0]),
            color=BLUE, opacity=0.6,
        )
        concat_group.add(fwd_up_arrow)

        # Arrow from backward cell up to concat block (RED)
        # Same index: bwd_cell[i] processes the same word as fwd_cell[i]
        bwd_cc = bwd_cell_centers[i]
        bwd_up_arrow = thin_arrow(
            bwd_cc + UP * 1.0,
            np.array([cx + 0.3, cy - 0.25, 0]),
            color=RED, opacity=0.6,
        )
        concat_group.add(bwd_up_arrow)

    # ====== EQUATIONS (bottom, centered under respective chains) ======
    fwd_center_x = (fwd_cell_centers[0][0] + fwd_cell_centers[-1][0]) / 2
    bwd_center_x = (bwd_cell_centers[0][0] + bwd_cell_centers[-1][0]) / 2

    eq_fwd = Tex(r"h_k = f(h_{k-1}, \, x_k)", font_size=34, color=BLUE_B)
    eq_fwd.move_to(np.array([fwd_center_x, eq_y, 0]))
    eq_bwd = Tex(r"\hat{h}_k = f(\hat{h}_{k-1}, \, \hat{x}_k)", font_size=34, color=RED_B)
    eq_bwd.move_to(np.array([bwd_center_x, eq_y, 0]))
    equations = VGroup(eq_fwd, eq_bwd)

    # ====== FULL DIAGRAM ======
    diagram = VGroup(fwd_group, bwd_group, concat_group, equations)

    return diagram, fwd_steps, bwd_steps, fwd_h0, bwd_h0, concat_group, equations, fwd_label, bwd_label


def slide_rnn_bidirectional(scene: Scene):
    """Bi-directional RNN slide with progressive activation."""
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(8)

    title = Text("Bi-directional RNN", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.3)

    diagram, fwd_steps, bwd_steps, fwd_h0, bwd_h0, concat_group, equations, fwd_label, bwd_label = _build_bidirectional_rnn(
        ORIGIN + DOWN * 0.3
    )
    diagram.scale(0.55)
    diagram.move_to(ORIGIN).shift(DOWN * 0.2)

    # Start everything dimmed, but keep direction labels always visible
    diagram.set_opacity(_DIM)
    fwd_label.set_opacity(1.0)
    bwd_label.set_opacity(1.0)

    # Example sentence at the bottom — always visible
    example_sentence = Text(
        '"The show was terribly exciting"',
        font_size=28,
        color=GREY_A,
        t2c={"terribly": RED},
    )
    example_sentence.to_edge(DOWN, buff=0.4)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(diagram), FadeIn(example_sentence), run_time=0.6)
    scene.wait()

    # === Step 1: Both chains activate simultaneously ===
    # Forward h₀ and backward ĥ₀
    scene.play(
        fwd_h0.animate.set_opacity(1.0),
        bwd_h0.animate.set_opacity(1.0),
        run_time=0.4,
    )
    scene.wait()

    # Activate cells simultaneously: forward L→R, backward R→L
    num_cells = len(fwd_steps)
    for i in range(num_cells):
        fwd_step = fwd_steps[i]
        bwd_step = bwd_steps[num_cells - 1 - i]  # backward activates R→L

        # Inputs + cells
        scene.play(
            fwd_step["input"].animate.set_opacity(1.0),
            fwd_step["cell"].animate.set_opacity(1.0),
            bwd_step["input"].animate.set_opacity(1.0),
            bwd_step["cell"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        # Hidden state arrows
        scene.play(
            fwd_step["h_right"].animate.set_opacity(1.0),
            bwd_step["h_left"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

    # === Step 2: Concatenated outputs appear ===
    scene.play(concat_group.animate.set_opacity(1.0), run_time=0.6)
    scene.wait()

    # === Step 3: Equations fade in ===
    scene.play(equations.animate.set_opacity(1.0), run_time=0.6)
    scene.wait()
