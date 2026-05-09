from manimlib import *

from talks.shared_components.word2vec_diagrams import thin_arrow

_DIM = 0.15


def _build_attention_formulation(center):
    """Build the generalized attention formulation diagram.

    Returns (diagram, attn_box, query_group, key_group, value_group, output_group, equation_group).
    """
    c = center
    diagram = VGroup()

    # ====== CENTRAL ATTENTION BOX ======
    box = RoundedRectangle(
        width=3.5, height=3.0, corner_radius=0.2,
        color=GREY_B, fill_color=GREY_D, fill_opacity=0.3,
        stroke_width=2, stroke_opacity=0.8,
    )
    box.move_to(c)
    box_label = Text("attention", font_size=28, color=WHITE)
    box_label.move_to(c)
    attn_box = VGroup(box, box_label)
    diagram.add(attn_box)

    # Positions
    box_left = c[0] - 1.75
    box_right = c[0] + 1.75
    box_top = c[1] + 1.5
    box_bottom = c[1] - 1.5

    # ====== QUERIES (left, blue arrows pointing right) ======
    query_group = VGroup()
    q_labels_x = box_left - 1.2
    q_arrow_start_x = box_left - 0.8
    q_arrow_end_x = box_left

    # q_1
    q1_arrow = thin_arrow(
        np.array([q_arrow_start_x, c[1] + 0.8, 0]),
        np.array([q_arrow_end_x, c[1] + 0.8, 0]),
        color=BLUE, opacity=0.9,
    )
    q1_label = Tex(r"\mathbf{q}_1", font_size=26, color=BLUE)
    q1_label.move_to(np.array([q_labels_x, c[1] + 0.8, 0]))
    query_group.add(q1_arrow, q1_label)

    # q_2
    q2_arrow = thin_arrow(
        np.array([q_arrow_start_x, c[1] + 0.2, 0]),
        np.array([q_arrow_end_x, c[1] + 0.2, 0]),
        color=BLUE, opacity=0.9,
    )
    q2_label = Tex(r"\mathbf{q}_2", font_size=26, color=BLUE)
    q2_label.move_to(np.array([q_labels_x, c[1] + 0.2, 0]))
    query_group.add(q2_arrow, q2_label)

    # dots
    q_dots = Tex(r"\vdots", font_size=28, color=BLUE)
    q_dots.move_to(np.array([q_labels_x, c[1] - 0.35, 0]))
    query_group.add(q_dots)

    # q_n
    qn_arrow = thin_arrow(
        np.array([q_arrow_start_x, c[1] - 0.8, 0]),
        np.array([q_arrow_end_x, c[1] - 0.8, 0]),
        color=BLUE, opacity=0.9,
    )
    qn_label = Tex(r"\mathbf{q}_n", font_size=26, color=BLUE)
    qn_label.move_to(np.array([q_labels_x, c[1] - 0.8, 0]))
    query_group.add(qn_arrow, qn_label)

    # Query matrix label
    q_title = Text("Input Query Matrix (Q)", font_size=20, color=WHITE, weight=BOLD)
    q_title.move_to(np.array([q_labels_x - 1.2, c[1] + 0.5, 0]))
    q_dim = Tex(r"n \times d_k", font_size=20, color=GREY_A)
    q_dim.move_to(np.array([q_labels_x - 1.2, c[1] + 0.1, 0]))
    query_group.add(q_title, q_dim)

    diagram.add(query_group)

    # ====== KEYS (bottom, green arrows pointing up) ======
    key_group = VGroup()
    k_y_start = box_bottom - 1.0
    k_y_end = box_bottom

    # k_1
    k1_arrow = thin_arrow(
        np.array([c[0] - 0.8, k_y_start, 0]),
        np.array([c[0] - 0.8, k_y_end, 0]),
        color=GREEN, opacity=0.9,
    )
    k1_label = Tex(r"\mathbf{k}_1", font_size=26, color=GREEN)
    k1_label.move_to(np.array([c[0] - 0.8, k_y_start - 0.35, 0]))
    key_group.add(k1_arrow, k1_label)

    # k_2
    k2_arrow = thin_arrow(
        np.array([c[0], k_y_start, 0]),
        np.array([c[0], k_y_end, 0]),
        color=GREEN, opacity=0.9,
    )
    k2_label = Tex(r"\mathbf{k}_2", font_size=26, color=GREEN)
    k2_label.move_to(np.array([c[0], k_y_start - 0.35, 0]))
    key_group.add(k2_arrow, k2_label)

    # dots
    k_dots = Tex(r"\cdots", font_size=28, color=GREEN)
    k_dots.move_to(np.array([c[0] + 0.55, k_y_start + 0.3, 0]))
    key_group.add(k_dots)

    # k_m
    km_arrow = thin_arrow(
        np.array([c[0] + 0.8, k_y_start, 0]),
        np.array([c[0] + 0.8, k_y_end, 0]),
        color=GREEN, opacity=0.9,
    )
    km_label = Tex(r"\mathbf{k}_m", font_size=26, color=GREEN)
    km_label.move_to(np.array([c[0] + 0.8, k_y_start - 0.35, 0]))
    key_group.add(km_arrow, km_label)

    # Key matrix label
    k_title = Text("Input Key Matrix (K)", font_size=20, color=WHITE, weight=BOLD)
    k_title.move_to(np.array([c[0] - 2.5, k_y_start - 0.3, 0]))
    k_dim = Tex(r"m \times d_k", font_size=20, color=GREY_A)
    k_dim.move_to(np.array([c[0] - 2.5, k_y_start - 0.7, 0]))
    key_group.add(k_title, k_dim)

    diagram.add(key_group)

    # ====== VALUES (top, purple arrows pointing down) ======
    value_group = VGroup()
    v_y_start = box_top + 1.0
    v_y_end = box_top

    # v_1
    v1_arrow = thin_arrow(
        np.array([c[0] - 0.8, v_y_start, 0]),
        np.array([c[0] - 0.8, v_y_end, 0]),
        color=PURPLE, opacity=0.9,
    )
    v1_label = Tex(r"\mathbf{v}_1", font_size=26, color=PURPLE)
    v1_label.move_to(np.array([c[0] - 0.8, v_y_start + 0.35, 0]))
    value_group.add(v1_arrow, v1_label)

    # v_2
    v2_arrow = thin_arrow(
        np.array([c[0], v_y_start, 0]),
        np.array([c[0], v_y_end, 0]),
        color=PURPLE, opacity=0.9,
    )
    v2_label = Tex(r"\mathbf{v}_2", font_size=26, color=PURPLE)
    v2_label.move_to(np.array([c[0], v_y_start + 0.35, 0]))
    value_group.add(v2_arrow, v2_label)

    # dots
    v_dots = Tex(r"\cdots", font_size=28, color=PURPLE)
    v_dots.move_to(np.array([c[0] + 0.55, v_y_start - 0.3, 0]))
    value_group.add(v_dots)

    # v_m
    vm_arrow = thin_arrow(
        np.array([c[0] + 0.8, v_y_start, 0]),
        np.array([c[0] + 0.8, v_y_end, 0]),
        color=PURPLE, opacity=0.9,
    )
    vm_label = Tex(r"\mathbf{v}_m", font_size=26, color=PURPLE)
    vm_label.move_to(np.array([c[0] + 0.8, v_y_start + 0.35, 0]))
    value_group.add(vm_arrow, vm_label)

    # Value matrix label
    v_title = Text("Input Value Matrix (V)", font_size=20, color=WHITE, weight=BOLD)
    v_title.move_to(np.array([c[0] - 2.5, v_y_start + 0.3, 0]))
    v_dim = Tex(r"m \times d", font_size=20, color=GREY_A)
    v_dim.move_to(np.array([c[0] - 2.5, v_y_start + 0.7, 0]))
    value_group.add(v_title, v_dim)

    diagram.add(value_group)

    # ====== OUTPUTS (right, magenta arrows pointing right) ======
    output_group = VGroup()
    z_arrow_start_x = box_right
    z_arrow_end_x = box_right + 0.8
    z_labels_x = box_right + 1.2

    # z_1
    z1_arrow = thin_arrow(
        np.array([z_arrow_start_x, c[1] + 0.8, 0]),
        np.array([z_arrow_end_x, c[1] + 0.8, 0]),
        color=PINK, opacity=0.9,
    )
    z1_label = Tex(r"\mathbf{z}_1", font_size=26, color=PINK)
    z1_label.move_to(np.array([z_labels_x, c[1] + 0.8, 0]))
    output_group.add(z1_arrow, z1_label)

    # z_2
    z2_arrow = thin_arrow(
        np.array([z_arrow_start_x, c[1] + 0.2, 0]),
        np.array([z_arrow_end_x, c[1] + 0.2, 0]),
        color=PINK, opacity=0.9,
    )
    z2_label = Tex(r"\mathbf{z}_2", font_size=26, color=PINK)
    z2_label.move_to(np.array([z_labels_x, c[1] + 0.2, 0]))
    output_group.add(z2_arrow, z2_label)

    # dots
    z_dots = Tex(r"\vdots", font_size=28, color=PINK)
    z_dots.move_to(np.array([z_labels_x, c[1] - 0.35, 0]))
    output_group.add(z_dots)

    # z_n
    zn_arrow = thin_arrow(
        np.array([z_arrow_start_x, c[1] - 0.8, 0]),
        np.array([z_arrow_end_x, c[1] - 0.8, 0]),
        color=PINK, opacity=0.9,
    )
    zn_label = Tex(r"\mathbf{z}_n", font_size=26, color=PINK)
    zn_label.move_to(np.array([z_labels_x, c[1] - 0.8, 0]))
    output_group.add(zn_arrow, zn_label)

    # Output matrix label
    z_title = Text("Output Query\nEmbedding Matrix (Z)", font_size=20, color=WHITE, weight=BOLD)
    z_title.move_to(np.array([z_labels_x + 1.8, c[1] + 0.5, 0]))
    z_dim = Tex(r"n \times d", font_size=20, color=GREY_A)
    z_dim.move_to(np.array([z_labels_x + 1.8, c[1] - 0.1, 0]))
    output_group.add(z_title, z_dim)

    diagram.add(output_group)

    # ====== EQUATION (bottom-right) ======
    equation_group = VGroup()
    eq_box = RoundedRectangle(
        width=4.5, height=1.4, corner_radius=0.1,
        color=GREY_B, fill_color=GREY_D, fill_opacity=0.2,
        stroke_width=1.5, stroke_opacity=0.6,
    )
    eq_center = np.array([c[0] + 4.5, c[1] - 2.8, 0])
    eq_box.move_to(eq_center)
    eq_tex = Tex(
        r"\mathbf{Z} = \textbf{softmax}\left(\frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}}\right) \mathbf{V}",
        font_size=32, color=WHITE,
    )
    eq_tex.move_to(eq_center)
    equation_group.add(eq_box, eq_tex)
    diagram.add(equation_group)

    # Store positions for connection animation
    q_entry_ys = [c[1] + 0.8, c[1] + 0.2, c[1] - 0.8]
    k_entry_xs = [c[0] - 0.8, c[0], c[0] + 0.8]
    v_entry_xs = k_entry_xs  # same x positions as keys

    return (diagram, attn_box, query_group, key_group, value_group, output_group,
            equation_group, q_entry_ys, k_entry_xs, v_entry_xs, box_left, box_top, box_bottom)


def slide_attention_formulation(scene: Scene):
    """Generalized Attention Formulation slide with progressive activation."""
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(9)

    title = Text("Generalized Attention Formulation", font_size=44, weight=BOLD)
    title.to_edge(UP, buff=0.3)

    (diagram, attn_box, query_group, key_group, value_group, output_group,
     equation_group, q_entry_ys, k_entry_xs, v_entry_xs, box_left, box_top, box_bottom) = (
        _build_attention_formulation(ORIGIN + DOWN * 0.3)
    )
    diagram.scale(0.85)
    diagram.move_to(ORIGIN).shift(DOWN * 0.2)

    # Dim everything
    diagram.set_opacity(_DIM)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(diagram), run_time=0.6)
    scene.wait()

    # Step 1: Attention box
    scene.play(attn_box.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # Step 2: Queries
    scene.play(query_group.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # Step 3: Keys
    scene.play(key_group.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # Step 4: Values
    scene.play(value_group.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # Step 5: Outputs
    scene.play(output_group.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # Step 6: Equation
    scene.play(equation_group.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # === Steps 7-10: Connection lines inside the box ===
    # Use actual rendered box positions after scale/move
    box_rect = attn_box[0]  # The RoundedRectangle
    actual_left = box_rect.get_left()[0]
    actual_right = box_rect.get_right()[0]
    actual_top = box_rect.get_top()[1]
    actual_bottom = box_rect.get_bottom()[1]
    box_center_y = box_rect.get_center()[1]

    # q entry y positions: match the builder's c[1]+0.8, c[1]+0.2, c[1]-0.8
    # Box height is 3.0 in builder coords, so proportions are 0.8/3, 0.2/3, -0.8/3
    box_height = actual_top - actual_bottom
    q_pts_y = [
        box_center_y + (0.8 / 3.0) * box_height,   # q1
        box_center_y + (0.2 / 3.0) * box_height,   # q2
        box_center_y - (0.8 / 3.0) * box_height,   # qn
    ]
    # k entry x positions (evenly spaced inside box)
    box_width = actual_right - actual_left
    box_cx = box_rect.get_center()[0]
    k_pts_x = [
        box_cx - 0.25 * box_width,  # k1
        box_cx,                      # k2
        box_cx + 0.25 * box_width,  # km
    ]
    # v entry x positions (same as k)
    v_pts_x = k_pts_x

    # q points at left edge of box
    q_pts = [np.array([actual_left, y, 0]) for y in q_pts_y]
    # k points at bottom edge of box
    k_pts = [np.array([x, actual_bottom, 0]) for x in k_pts_x]
    # v points at top edge of box
    v_pts = [np.array([x, actual_top, 0]) for x in v_pts_x]

    q_colors = [BLUE_B, BLUE_C, BLUE_D]

    # Steps 7-9: For each q, draw a horizontal line across the box + dots at k intersections
    for qi in range(3):
        q_lines = VGroup()
        # Horizontal line spanning the box at this q's y level
        h_line = Line(
            np.array([actual_left, q_pts_y[qi], 0]),
            np.array([actual_right, q_pts_y[qi], 0]),
            stroke_color=q_colors[qi], stroke_width=2, stroke_opacity=0.7,
        )
        q_lines.add(h_line)
        # Dots where q line intersects each k column
        for ki in range(3):
            dot = Circle(radius=0.04, fill_color=WHITE, fill_opacity=1.0, stroke_width=0)
            dot.move_to(np.array([k_pts_x[ki], q_pts_y[qi], 0]))
            q_lines.add(dot)
        # Vertical lines from each k entry up to this q's y level
        for ki in range(3):
            v_line = Line(
                np.array([k_pts_x[ki], actual_bottom, 0]),
                np.array([k_pts_x[ki], q_pts_y[qi], 0]),
                stroke_color=q_colors[qi], stroke_width=1.5, stroke_opacity=0.5,
            )
            q_lines.add(v_line)

        scene.play(ShowCreation(q_lines), run_time=0.8)
        scene.wait()

    # Step 10: Connect v's to their associated k entry points (vertical lines top to bottom)
    v_lines = VGroup()
    for vi in range(3):
        line = Line(
            np.array([v_pts_x[vi], actual_top, 0]),
            np.array([v_pts_x[vi], actual_bottom, 0]),
            stroke_color=PURPLE, stroke_width=2.5, stroke_opacity=0.7,
        )
        v_lines.add(line)

    scene.play(ShowCreation(v_lines), run_time=0.8)
    scene.wait()
