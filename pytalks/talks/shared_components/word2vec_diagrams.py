from manimlib import *


def vector_block(width, height, n_dots, color, dot_radius=0.06):
    """A rounded rectangle with decorative dots — reusable building block for network diagrams."""
    rect = RoundedRectangle(
        width=width,
        height=height,
        corner_radius=0.1,
        color=color,
        fill_opacity=0.08,
        stroke_width=1.5,
        stroke_opacity=0.6,
    )
    dots = VGroup()
    if height > width:
        usable = height * 0.65
        for i in range(n_dots):
            y = (usable / 2) - i * (usable / max(n_dots - 1, 1))
            dot = Circle(
                radius=dot_radius,
                color=WHITE,
                fill_color=WHITE,
                fill_opacity=0.4,
                stroke_color=WHITE,
                stroke_width=1,
                stroke_opacity=0.6,
            )
            dot.move_to(rect.get_center() + np.array([0, y, 0]))
            dots.add(dot)
    else:
        usable = width * 0.65
        for i in range(n_dots):
            x = -(usable / 2) + i * (usable / max(n_dots - 1, 1))
            dot = Circle(
                radius=dot_radius,
                color=WHITE,
                fill_color=WHITE,
                fill_opacity=0.4,
                stroke_color=WHITE,
                stroke_width=1,
                stroke_opacity=0.6,
            )
            dot.move_to(rect.get_center() + np.array([x, 0, 0]))
            dots.add(dot)
    return VGroup(rect, dots)


def thin_arrow(start, end, color=WHITE, opacity=0.6):
    """Slim directional arrow for network connections."""
    return Arrow(
        start,
        end,
        thickness=1.0,
        fill_color=color,
        fill_opacity=opacity,
        stroke_width=0,
        buff=0.08,
        max_tip_length_to_length_ratio=0.15,
    )


def build_cbow(center):
    """Build a Continuous Bag-of-Words (CBOW) diagram.

    Multiple context word inputs → hidden layer → single output prediction.
    Returns (diagram: VGroup, label: Text, groups: dict[str, VGroup]).
    """
    c = center
    group = VGroup()

    # Track sub-elements for highlight groups
    input_parts = VGroup()
    embedding_parts = VGroup()
    output_parts = VGroup()

    # Input rows
    input_labels_text = [r"x_{1}", r"x_{2}", r"x_{4}", r"x_{C}"]
    input_y_offsets = [1.8, 0.6, -0.6, -1.8]
    input_blocks = []

    for i, (label_tex, y_off) in enumerate(zip(input_labels_text, input_y_offsets)):
        pos = c + LEFT * 3.5 + UP * y_off

        label = Tex(label_tex, font_size=20, color=GREEN_B)
        label.move_to(pos + LEFT * 1.0)

        block = vector_block(0.7, 0.35, 3, GREEN, dot_radius=0.04)
        block.move_to(pos)

        input_blocks.append(block)
        group.add(label, block)
        input_parts.add(label, block)

        # Dots between row 3 and 4
        if i == 2:
            dots = Tex(r"\vdots", font_size=20, color=GREY_A)
            dots.move_to(c + LEFT * 3.5 + UP * (-1.2))
            group.add(dots)
            input_parts.add(dots)

    # Hidden node (embedding)
    hidden = vector_block(0.5, 1.2, 4, BLUE, dot_radius=0.05)
    hidden.move_to(c)
    h_label = Tex(r"e_3", font_size=20, color=BLUE_B)
    h_label.next_to(hidden, DOWN, buff=0.15)
    group.add(hidden, h_label)
    embedding_parts.add(hidden, h_label)

    # Input-to-hidden lines
    for block in input_blocks:
        line = Line(
            block[0].get_right(),
            hidden[0].get_left(),
            stroke_width=1.0,
            stroke_color=GREY_B,
            stroke_opacity=0.4,
        )
        group.add(line)
        input_parts.add(line)

    # W label (input to hidden)
    w_label = Tex(r"W_{V \times N}", font_size=18, color=GREY_A)
    w_label.move_to(c + LEFT * 1.7 + UP * 2.2)
    group.add(w_label)
    input_parts.add(w_label)

    # Output column
    output = vector_block(0.7, 2.8, 6, RED, dot_radius=0.05)
    output.move_to(c + RIGHT * 3.5)
    y_label = Tex(r"\hat{x}_3", font_size=20, color=RED_B)
    y_label.next_to(output, RIGHT, buff=0.2)
    group.add(output, y_label)
    output_parts.add(output, y_label)

    # Hidden-to-output lines
    for i in range(6):
        y = output[0].get_center()[1] + (2.8 * 0.65 / 2) - i * (2.8 * 0.65 / 5)
        end_pt = np.array([output[0].get_left()[0], y, 0])
        line = Line(
            hidden[0].get_right(),
            end_pt,
            stroke_width=1.0,
            stroke_color=GREY_B,
            stroke_opacity=0.4,
        )
        group.add(line)
        output_parts.add(line)

    # W^T label (hidden to output)
    wt_label = Tex(r"W^T_{V \times N}", font_size=18, color=GREY_A)
    wt_label.move_to(c + RIGHT * 1.7 + UP * 2.2)
    group.add(wt_label)
    output_parts.add(wt_label)

    label = Text("Continuous Bag-of-Words", font_size=24, weight=BOLD, color=BLUE)
    label.move_to(c + DOWN * 3.5)

    groups = {
        "input": input_parts,
        "embedding": embedding_parts,
        "output": output_parts,
    }

    return group, label, groups


def build_skipgram(center):
    """Build a Skip-Gram diagram.

    Single target word input → hidden layer → multiple context word output predictions.
    Returns (diagram: VGroup, label: Text, groups: dict[str, VGroup]).
    """
    c = center
    group = VGroup()

    # Track sub-elements for highlight groups
    input_parts = VGroup()
    embedding_parts = VGroup()
    output_parts = VGroup()

    # Single input vector on the left
    input_block = vector_block(0.7, 0.35, 3, RED, dot_radius=0.04)
    input_block.move_to(c + LEFT * 3.5)
    input_label = Tex(r"x_3", font_size=20, color=RED_B)
    input_label.move_to(c + LEFT * 3.5 + LEFT * 1.0)
    group.add(input_label, input_block)
    input_parts.add(input_label, input_block)

    # Hidden node (embedding)
    hidden = vector_block(0.5, 1.2, 4, BLUE, dot_radius=0.05)
    hidden.move_to(c)
    h_label = Tex(r"e_3", font_size=20, color=BLUE_B)
    h_label.next_to(hidden, DOWN, buff=0.15)
    group.add(hidden, h_label)
    embedding_parts.add(hidden, h_label)

    # Input-to-hidden line
    line_in = Line(
        input_block[0].get_right(),
        hidden[0].get_left(),
        stroke_width=1.0,
        stroke_color=GREY_B,
        stroke_opacity=0.4,
    )
    group.add(line_in)
    input_parts.add(line_in)

    # W label (input to hidden)
    w_label = Tex(r"W_{V \times N}", font_size=18, color=GREY_A)
    w_label.move_to(c + LEFT * 1.7 + UP * 1.0)
    group.add(w_label)
    input_parts.add(w_label)

    # Multiple output rows on the right
    output_labels_text = [r"\hat{x}_{1}", r"\hat{x}_{2}", r"\hat{x}_{4}", r"\hat{x}_{C}"]
    output_y_offsets = [1.8, 0.6, -0.6, -1.8]
    output_blocks = []

    for i, (label_tex, y_off) in enumerate(zip(output_labels_text, output_y_offsets)):
        pos = c + RIGHT * 3.5 + UP * y_off

        block = vector_block(0.7, 0.35, 3, GREEN, dot_radius=0.04)
        block.move_to(pos)

        label = Tex(label_tex, font_size=20, color=GREEN_B)
        label.move_to(pos + RIGHT * 1.0)

        output_blocks.append(block)
        group.add(block, label)
        output_parts.add(block, label)

        # Dots between row 3 and 4
        if i == 2:
            dots = Tex(r"\vdots", font_size=20, color=GREY_A)
            dots.move_to(c + RIGHT * 3.5 + UP * (-1.2))
            group.add(dots)
            output_parts.add(dots)

    # Hidden-to-output lines
    for block in output_blocks:
        line = Line(
            hidden[0].get_right(),
            block[0].get_left(),
            stroke_width=1.0,
            stroke_color=GREY_B,
            stroke_opacity=0.4,
        )
        group.add(line)
        output_parts.add(line)

    # W^T label (hidden to output)
    wt_label = Tex(r"W^T_{V \times N}", font_size=18, color=GREY_A)
    wt_label.move_to(c + RIGHT * 1.7 + UP * 2.2)
    group.add(wt_label)
    output_parts.add(wt_label)

    label = Text("Skip-Gram", font_size=24, weight=BOLD, color=RED)
    label.move_to(c + DOWN * 3.5)

    groups = {
        "input": input_parts,
        "embedding": embedding_parts,
        "output": output_parts,
    }

    return group, label, groups
