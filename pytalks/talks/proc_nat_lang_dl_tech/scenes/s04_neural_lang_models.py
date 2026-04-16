from manimlib import *

# Layout constants
OVERVIEW_CENTER = np.array([0, 0, 0])
OVERVIEW_HEIGHT = 24.0
DETAIL_HEIGHT = 8.0

MODEL_POSITIONS = [
    np.array([-12, 0, 0]),  # FNN
    np.array([0, 0, 0]),    # RNN
    np.array([12, 0, 0]),   # Transformer
]

MODEL_COLORS = [BLUE, GREEN, RED]


# --- Helpers ---

def _vector_block(width, height, n_dots, color, dot_radius=0.06):
    rect = RoundedRectangle(
        width=width, height=height, corner_radius=0.1,
        color=color, fill_opacity=0.08, stroke_width=1.5, stroke_opacity=0.6,
    )
    dots = VGroup()
    if height > width:
        usable = height * 0.65
        for i in range(n_dots):
            y = (usable / 2) - i * (usable / max(n_dots - 1, 1))
            dot = Circle(radius=dot_radius, color=color, fill_opacity=0.4, stroke_width=1, stroke_opacity=0.6)
            dot.move_to(rect.get_center() + np.array([0, y, 0]))
            dots.add(dot)
    else:
        usable = width * 0.65
        for i in range(n_dots):
            x = -(usable / 2) + i * (usable / max(n_dots - 1, 1))
            dot = Circle(radius=dot_radius, color=color, fill_opacity=0.4, stroke_width=1, stroke_opacity=0.6)
            dot.move_to(rect.get_center() + np.array([x, 0, 0]))
            dots.add(dot)
    return VGroup(rect, dots)


def _thin_arrow(start, end, color=WHITE, opacity=0.6):
    return Arrow(
        start, end,
        thickness=1.0, fill_color=color, fill_opacity=opacity,
        stroke_width=0, buff=0.08, max_tip_length_to_length_ratio=0.15,
    )


# --- FNN (Word2Vec) ---

def _build_fnn(center):
    c = center
    group = VGroup()

    # Input rows
    input_labels_text = [r"x_{1k}", r"x_{2k}", r"x_{3k}", r"x_{ck}"]
    input_y_offsets = [1.8, 0.6, -0.6, -1.8]
    input_blocks = []

    for i, (label_tex, y_off) in enumerate(zip(input_labels_text, input_y_offsets)):
        pos = c + LEFT * 3.5 + UP * y_off

        label = Tex(label_tex, font_size=20, color=BLUE_B)
        label.move_to(pos + LEFT * 1.0)

        block = _vector_block(0.7, 0.35, 3, BLUE, dot_radius=0.04)
        block.move_to(pos)

        input_blocks.append(block)
        group.add(label, block)

        # Dots between row 3 and 4
        if i == 2:
            dots = Tex(r"\vdots", font_size=20, color=GREY_A)
            dots.move_to(c + LEFT * 3.5 + UP * (-1.2))
            group.add(dots)

    # Hidden node
    hidden = _vector_block(0.5, 1.2, 4, GREEN, dot_radius=0.05)
    hidden.move_to(c)
    h_label = Tex(r"h_1", font_size=20, color=GREEN_B)
    h_label.next_to(hidden, DOWN, buff=0.15)
    group.add(hidden, h_label)

    # Input-to-hidden lines
    for block in input_blocks:
        line = Line(
            block[0].get_right(), hidden[0].get_left(),
            stroke_width=1.0, stroke_color=GREY_B, stroke_opacity=0.4,
        )
        group.add(line)

    # W label (input to hidden)
    w_label = Tex(r"W_{V \times N}", font_size=18, color=GREY_A)
    w_label.move_to(c + LEFT * 1.7 + UP * 2.2)
    group.add(w_label)

    # Output column
    output = _vector_block(0.7, 2.8, 6, RED, dot_radius=0.05)
    output.move_to(c + RIGHT * 3.5)
    y_label = Tex(r"\hat{y}_j", font_size=20, color=RED_B)
    y_label.next_to(output, RIGHT, buff=0.2)
    group.add(output, y_label)

    # Hidden-to-output lines
    for i in range(6):
        y = output[0].get_center()[1] + (2.8 * 0.65 / 2) - i * (2.8 * 0.65 / 5)
        end_pt = np.array([output[0].get_left()[0], y, 0])
        line = Line(
            hidden[0].get_right(), end_pt,
            stroke_width=1.0, stroke_color=GREY_B, stroke_opacity=0.4,
        )
        group.add(line)

    # W^T label (hidden to output)
    wt_label = Tex(r"W^T_{V \times N}", font_size=18, color=GREY_A)
    wt_label.move_to(c + RIGHT * 1.7 + UP * 2.2)
    group.add(wt_label)

    # Model label (returned separately for scaling animation)
    label = Text("FNN (Word2Vec)", font_size=28, weight=BOLD, color=BLUE)
    label.move_to(c + DOWN * 3.5)

    return group, label


# --- RNN (Rolled cell) ---

def _build_rnn(center):
    c = center
    group = VGroup()

    # Cell body
    cell = _vector_block(1.0, 2.5, 6, GREEN, dot_radius=0.06)
    cell.move_to(c)
    group.add(cell)

    # Input arrow from below
    input_arrow = _thin_arrow(c + DOWN * 2.3, c + DOWN * 1.35, color=WHITE)
    x_label = Tex(r"x_i", font_size=22, color=BLUE_B)
    x_label.move_to(c + DOWN * 2.6)
    group.add(input_arrow, x_label)

    # Output arrow to the right
    output_arrow = _thin_arrow(c + RIGHT * 0.6, c + RIGHT * 2.0, color=WHITE)
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
    # Get tangent direction at the end of the curve (points toward end)
    near_end = loop.point_from_proportion(0.95)
    tangent = end_pt - near_end
    tangent = tangent / np.linalg.norm(tangent)  # normalize
    # Perpendicular to tangent
    perp = np.array([-tangent[1], tangent[0], 0])
    tip = Polygon(
        end_pt,
        end_pt - tangent * 0.1 + perp * 0.04,
        end_pt - tangent * 0.1 - perp * 0.04,
        fill_color=GREEN_B, fill_opacity=1.0, stroke_width=0,
    )
    group.add(tip)

    # h_i label above the loop
    h_i_label = Tex(r"h_i", font_size=22, color=GREEN_B)
    h_i_label.move_to(loop_apex + UP * 0.25)
    group.add(h_i_label)

    label = Text("RNN", font_size=28, weight=BOLD, color=GREEN)
    label.move_to(c + DOWN * 3.5)

    return group, label


# --- Transformer (Attention) ---

def _build_transformer(center):
    c = center
    group = VGroup()

    # Central attention box
    box = RoundedRectangle(
        width=3.0, height=2.0, corner_radius=0.15,
        color=YELLOW, fill_opacity=0.05, stroke_width=2, stroke_opacity=0.7,
    )
    box.move_to(c)
    attn_text = Text("Attention", font_size=24, weight=BOLD, color=YELLOW)
    attn_text.move_to(c)
    group.add(box, attn_text)

    # Top: Values (purple, arrows pointing down into box)
    v_labels = [r"v_1", r"v_2", r"\cdots", r"v_m"]
    v_x_offsets = [-1.0, -0.33, 0.33, 1.0]
    for label_tex, x_off in zip(v_labels, v_x_offsets):
        arrow_start = c + UP * 2.2 + RIGHT * x_off
        arrow_end = c + UP * 1.1 + RIGHT * x_off
        arrow = _thin_arrow(arrow_start, arrow_end, color=PURPLE, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=PURPLE_B)
        label.move_to(arrow_start + UP * 0.25)
        group.add(arrow, label)

    # Left: Queries (blue, arrows pointing right into box)
    q_labels = [r"q_1", r"q_2", r"\vdots", r"q_n"]
    q_y_offsets = [0.5, 0.17, -0.17, -0.5]
    for label_tex, y_off in zip(q_labels, q_y_offsets):
        arrow_start = c + LEFT * 2.8 + UP * y_off
        arrow_end = c + LEFT * 1.6 + UP * y_off
        arrow = _thin_arrow(arrow_start, arrow_end, color=BLUE, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=BLUE_B)
        label.move_to(arrow_start + LEFT * 0.3)
        group.add(arrow, label)

    # Bottom: Keys (green, arrows pointing up into box)
    k_labels = [r"k_1", r"k_2", r"\cdots", r"k_m"]
    k_x_offsets = [-1.0, -0.33, 0.33, 1.0]
    for label_tex, x_off in zip(k_labels, k_x_offsets):
        arrow_start = c + DOWN * 2.2 + RIGHT * x_off
        arrow_end = c + DOWN * 1.1 + RIGHT * x_off
        arrow = _thin_arrow(arrow_start, arrow_end, color=GREEN, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=GREEN_B)
        label.move_to(arrow_start + DOWN * 0.25)
        group.add(arrow, label)

    # Right: Outputs (red, arrows pointing right out of box)
    z_labels = [r"z_1", r"z_2", r"\vdots", r"z_n"]
    z_y_offsets = [0.5, 0.17, -0.17, -0.5]
    for label_tex, y_off in zip(z_labels, z_y_offsets):
        arrow_start = c + RIGHT * 1.6 + UP * y_off
        arrow_end = c + RIGHT * 2.8 + UP * y_off
        arrow = _thin_arrow(arrow_start, arrow_end, color=RED, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=RED_B)
        label.move_to(arrow_end + RIGHT * 0.3)
        group.add(arrow, label)

    label = Text("Transformer", font_size=28, weight=BOLD, color=RED)
    label.move_to(c + DOWN * 3.5)

    return group, label


# Scale factor: overview/detail height ratio
_SCALE = OVERVIEW_HEIGHT / DETAIL_HEIGHT  # 3.0


# --- Zoom helper ---

def _zoom_to_model(scene, model_center, label):
    # Zoom in + scale label down to normal size
    scene.play(
        scene.frame.animate.move_to(model_center).set_height(DETAIL_HEIGHT),
        label.animate.scale(1 / _SCALE),
        run_time=1.2,
        rate_func=smooth,
    )
    scene.wait()
    # Zoom out + scale label back up
    scene.play(
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        label.animate.scale(_SCALE),
        run_time=1.2,
        rate_func=smooth,
    )
    scene.wait()


# --- Main slide ---

def slide_neural_lang_models(scene: Scene):
    # Set frame to overview
    scene.frame.move_to(OVERVIEW_CENTER)
    scene.frame.set_height(OVERVIEW_HEIGHT)

    # Title
    title = Text("Neural Language Models", font_size=72, weight=BOLD)
    title.move_to(np.array([0, 8, 0]))

    # Build all 3 model diagrams + labels
    builders = [_build_fnn, _build_rnn, _build_transformer]
    diagrams = []
    labels = []
    for i, builder in enumerate(builders):
        diagram, label = builder(MODEL_POSITIONS[i])
        # Scale label up for overview readability
        label.scale(_SCALE)
        diagrams.append(diagram)
        labels.append(label)

    # Animate overview
    scene.play(Write(title), run_time=0.8)
    for diagram, label in zip(diagrams, labels):
        scene.play(
            FadeIn(diagram, shift=UP * 0.3),
            FadeIn(label, shift=UP * 0.3),
            run_time=0.5,
        )
    scene.wait()

    # Zoom into each model in sequence
    for i in range(3):
        _zoom_to_model(scene, MODEL_POSITIONS[i], labels[i])

    scene.wait()
