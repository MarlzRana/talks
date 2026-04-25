from manimlib import *

from talks.shared_components.word2vec_diagrams import vector_block, thin_arrow

_CELL_SPACING = 4.0


def build_rnn(center):
    """Build a rolled RNN diagram with recurrent loop.

    Returns (diagram: VGroup, label: Text).
    """
    c = center
    group = VGroup()

    # Cell body
    cell = vector_block(1.0, 2.5, 6, GREEN, dot_radius=0.06)
    cell.move_to(c)
    group.add(cell)

    # Input arrow from below
    input_arrow = thin_arrow(c + DOWN * 2.3, c + DOWN * 1.35, color=WHITE)
    x_label = Tex(r"x_i", font_size=22, color=BLUE_B)
    x_label.move_to(c + DOWN * 2.6)
    group.add(input_arrow, x_label)

    # Output arrow to the right
    output_arrow = thin_arrow(c + RIGHT * 0.6, c + RIGHT * 2.0, color=WHITE)
    h_n_label = Tex(r"h_n", font_size=22, color=RED_B)
    h_n_label.next_to(output_arrow, RIGHT, buff=0.15)
    group.add(output_arrow, h_n_label)

    # Recurrent loop: slim oval above the cell
    cell_top = cell[0].get_top()
    loop_start = cell_top + RIGHT * 0.25
    loop_end = cell_top + LEFT * 0.25
    loop_apex = cell_top + UP * 0.7

    loop = VMobject()
    loop.start_new_path(loop_start)
    loop.add_cubic_bezier_curve_to(
        loop_start + UP * 0.6 + RIGHT * 0.35,
        loop_apex + RIGHT * 0.35,
        loop_apex,
    )
    loop.add_cubic_bezier_curve_to(
        loop_apex + LEFT * 0.35,
        loop_end + UP * 0.6 + LEFT * 0.35,
        loop_end,
    )
    loop.set_stroke(GREEN_B, width=2, opacity=0.7)
    group.add(loop)

    # Small arrowhead triangle aligned with curve tangent at end
    end_pt = loop.get_end()
    near_end = loop.point_from_proportion(0.95)
    tangent = end_pt - near_end
    tangent = tangent / np.linalg.norm(tangent)
    perp = np.array([-tangent[1], tangent[0], 0])
    tip = Polygon(
        end_pt,
        end_pt - tangent * 0.1 + perp * 0.04,
        end_pt - tangent * 0.1 - perp * 0.04,
        fill_color=GREEN_B,
        fill_opacity=1.0,
        stroke_width=0,
    )
    group.add(tip)

    # h_i label above the loop
    h_i_label = Tex(r"h_{i-1}", font_size=22, color=GREEN_B)
    h_i_label.move_to(loop_apex + UP * 0.25)
    group.add(h_i_label)

    label = Text("RNN", font_size=28, weight=BOLD, color=GREEN)
    label.move_to(c + DOWN * 3.5)

    return group, label


def _build_unrolled_cells(center, words, cell_spacing=_CELL_SPACING):
    """Build the core unrolled RNN cells (shared between sequence labelling and classification).

    Returns (group, h0_group, steps, cell_centers) where steps is a list of dicts with:
      "input", "cell", "h_right" keys. cell_centers is the list of center positions.
    """
    group = VGroup()
    c = center
    num_cells = len(words)
    total_width = (num_cells - 1) * cell_spacing
    start_x = c[0] - total_width / 2

    cell_centers = []
    for i in range(num_cells):
        cell_centers.append(np.array([start_x + i * cell_spacing, c[1], 0]))

    # h_0 arrow entering from the left
    h0_start = cell_centers[0] + LEFT * 2.2
    h0_end = cell_centers[0] + LEFT * 0.6
    h0_arrow = thin_arrow(h0_start, h0_end, color=WHITE, opacity=0.8)
    h0_label = Tex(r"h_0", font_size=20, color=GREY_A)
    h0_label.move_to(h0_start + LEFT * 0.3)
    h0_group = VGroup(h0_arrow, h0_label)
    group.add(h0_group)

    steps = []

    for i in range(num_cells):
        cc = cell_centers[i]
        step = {}

        # Cell body (hidden state)
        cell = vector_block(0.8, 2.0, 4, RED, dot_radius=0.06)
        cell.move_to(cc)
        step["cell"] = cell
        group.add(cell)

        # Input arrow from below
        x_arrow = thin_arrow(cc + DOWN * 2.0, cc + DOWN * 1.1, color=WHITE, opacity=0.8)
        x_label = Tex(rf"x_{{{i+1}}}", font_size=20, color=BLUE_B)
        x_label.move_to(cc + DOWN * 2.3)
        word_label = Text(words[i], font_size=16, color=GREY_B)
        word_label.move_to(cc + DOWN * 2.7)
        step["input"] = VGroup(x_arrow, x_label, word_label)
        group.add(step["input"])

        # Hidden state arrow to next cell (or to "...")
        if i < num_cells - 1:
            h_right_start = cc + RIGHT * 0.5
            h_right_end = cell_centers[i + 1] + LEFT * 0.5
            h_arrow = thin_arrow(h_right_start, h_right_end, color=WHITE, opacity=0.8)
            h_label = Tex(rf"h_{{{i+1}}}", font_size=18, color=GREY_A)
            h_label.move_to((h_right_start + h_right_end) / 2 + UP * 0.25)
            step["h_right"] = VGroup(h_arrow, h_label)
        else:
            h_right_start = cc + RIGHT * 0.5
            h_right_end = cc + RIGHT * 2.0
            h_arrow = thin_arrow(h_right_start, h_right_end, color=WHITE, opacity=0.8)
            h_label = Tex(rf"h_{{{i+1}}}", font_size=18, color=GREY_A)
            h_label.move_to((h_right_start + h_right_end) / 2 + UP * 0.25)
            ellipsis = Tex(r"\cdots", font_size=28, color=GREY_A)
            ellipsis.move_to(h_right_end + RIGHT * 0.4)
            step["h_right"] = VGroup(h_arrow, h_label, ellipsis)
        group.add(step["h_right"])

        steps.append(step)

    return group, h0_group, steps, cell_centers


def build_unrolled_rnn_seq_labelling(center, words, output_labels):
    """Build an unrolled RNN for sequence labelling (output at every time step).

    Each cell gets: input → cell → h_up → ANN → output (ȳ_t + label).
    Returns (diagram: VGroup, h0_group: VGroup, steps: list[dict]).
    """
    group, h0_group, steps, cell_centers = _build_unrolled_cells(center, words)

    for i, step in enumerate(steps):
        cc = cell_centers[i]

        # Upward h arrow + label
        h_out_arrow = thin_arrow(cc + UP * 1.1, cc + UP * 1.55, color=WHITE, opacity=0.8)
        h_out_label = Tex(rf"h_{{{i+1}}}", font_size=18, color=RED_B)
        h_out_label.next_to(h_out_arrow, RIGHT, buff=0.1)
        step["h_up"] = VGroup(h_out_arrow, h_out_label)
        group.add(step["h_up"])

        # ANN box
        ann_box = RoundedRectangle(
            width=0.9, height=0.4, corner_radius=0.05,
            color=GREEN, fill_opacity=0.15, stroke_width=1.5, stroke_opacity=0.7,
        )
        ann_box.move_to(cc + UP * 1.9)
        ann_text = Text("ANN", font_size=14, color=GREEN, weight=BOLD)
        ann_text.move_to(ann_box.get_center())
        step["ann"] = VGroup(ann_box, ann_text)
        group.add(step["ann"])

        # Output arrow + labels
        ann_out_arrow = thin_arrow(cc + UP * 2.15, cc + UP * 2.55, color=WHITE, opacity=0.8)
        y_label = Tex(rf"\bar{{y}}_{{{i+1}}}", font_size=20, color=WHITE)
        y_label.move_to(cc + UP * 2.8)
        out_label = Text(output_labels[i], font_size=16, color=GREEN_B)
        out_label.move_to(cc + UP * 3.15)
        step["output"] = VGroup(ann_out_arrow, y_label, out_label)
        group.add(step["output"])

    return group, h0_group, steps


def build_unrolled_rnn_classification(center, words, class_label):
    """Build an unrolled RNN for classification (output only from final hidden state).

    All cells process input and pass hidden state, but only the last cell
    produces an output through an ANN → ȳ.
    Returns (diagram: VGroup, h0_group: VGroup, steps: list[dict]).
    """
    group, h0_group, steps, cell_centers = _build_unrolled_cells(center, words)
    num_cells = len(words)

    for i, step in enumerate(steps):
        cc = cell_centers[i]

        if i == num_cells - 1:
            # Final cell: full output path
            h_out_arrow = thin_arrow(cc + UP * 1.1, cc + UP * 1.55, color=WHITE, opacity=0.8)
            h_out_label = Tex(rf"h_{{{i+1}}}", font_size=18, color=RED_B)
            h_out_label.next_to(h_out_arrow, RIGHT, buff=0.1)
            step["h_up"] = VGroup(h_out_arrow, h_out_label)
            group.add(step["h_up"])

            # ANN box
            ann_box = RoundedRectangle(
                width=0.9, height=0.4, corner_radius=0.05,
                color=GREEN, fill_opacity=0.15, stroke_width=1.5, stroke_opacity=0.7,
            )
            ann_box.move_to(cc + UP * 1.9)
            ann_text = Text("ANN", font_size=14, color=GREEN, weight=BOLD)
            ann_text.move_to(ann_box.get_center())
            step["ann"] = VGroup(ann_box, ann_text)
            group.add(step["ann"])

            # Output
            ann_out_arrow = thin_arrow(cc + UP * 2.15, cc + UP * 2.55, color=WHITE, opacity=0.8)
            y_label = Tex(r"\bar{y}", font_size=20, color=WHITE)
            y_label.move_to(cc + UP * 2.8)
            cls_label = Text(class_label, font_size=16, color=GREEN_B)
            cls_label.move_to(cc + UP * 3.15)
            step["output"] = VGroup(ann_out_arrow, y_label, cls_label)
            group.add(step["output"])

    return group, h0_group, steps
