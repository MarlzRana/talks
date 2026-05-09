from manimlib import *

from talks.shared_components.word2vec_diagrams import vector_block, thin_arrow

_DIM = 0.15
_CELL_SPACING = 3.5
_LAYER_SPACING = 3.0
_NUM_STEPS = 3
_NUM_LAYERS = 3

_LAYER_COLORS = [PURPLE, RED, GREY_D]
_LAYER_LABEL_COLORS = [PURPLE_B, RED_B, GREY_A]


def _build_multi_layer_rnn(center):
    """Build a multi-layer RNN diagram with 3 layers and 3 time steps.

    Returns (diagram, input_group, layer_data, dashed_borders, info_box).
    """
    c = center
    words = ["this", "is", "cat"]

    # Vertical positions
    input_y = c[1] - 1.8 * _LAYER_SPACING
    layer_ys = [c[1] - 0.5 * _LAYER_SPACING + k * _LAYER_SPACING for k in range(_NUM_LAYERS)]

    # Horizontal positions
    total_width = (_NUM_STEPS - 1) * _CELL_SPACING
    start_x = c[0] - total_width / 2
    step_xs = [start_x + i * _CELL_SPACING for i in range(_NUM_STEPS)]

    diagram = VGroup()

    # ====== INPUTS (word embeddings) ======
    input_group = VGroup()
    for i, word in enumerate(words):
        # Horizontal embedding block
        emb = vector_block(1.4, 0.5, 4, PURPLE, dot_radius=0.05)
        emb.move_to(np.array([step_xs[i], input_y, 0]))
        input_group.add(emb)

        # Word text below
        word_text = Text(word, font_size=26, color=WHITE, weight=BOLD)
        word_text.move_to(np.array([step_xs[i], input_y - 0.55, 0]))
        input_group.add(word_text)

        # (e_i) label below word
        e_label = Tex(rf"(e_{{{i+1}}})", font_size=24, color=PURPLE_B)
        e_label.move_to(np.array([step_xs[i], input_y - 1.0, 0]))
        input_group.add(e_label)

        # Arrow from embedding up to layer 1 cell
        x_arrow = thin_arrow(
            np.array([step_xs[i], input_y + 0.35, 0]),
            np.array([step_xs[i], layer_ys[0] - 1.0, 0]),
            color=PURPLE, opacity=0.7,
        )
        input_group.add(x_arrow)

        # x_i label to the left of the arrow
        x_label = Tex(rf"x_{{{i+1}}}", font_size=24, color=PURPLE_B)
        x_label.next_to(x_arrow, LEFT, buff=0.1)
        input_group.add(x_label)

    diagram.add(input_group)

    # ====== LAYERS ======
    layer_data = []
    for k in range(_NUM_LAYERS):
        layer = {}
        color = _LAYER_COLORS[k]
        label_color = _LAYER_LABEL_COLORS[k]
        ly = layer_ys[k]

        # h0 arrow entering from left
        h0_start = np.array([step_xs[0] - 1.8, ly, 0])
        h0_end = np.array([step_xs[0] - 0.5, ly, 0])
        h0_arrow = thin_arrow(h0_start, h0_end, color=color, opacity=0.7)
        h0_label = Tex(rf"h^{{({k+1})}}_0", font_size=22, color=label_color)
        h0_label.move_to(np.array([step_xs[0] - 1.15, ly + 0.35, 0]))
        layer["h0"] = VGroup(h0_arrow, h0_label)
        diagram.add(layer["h0"])

        # Cells
        cells = []
        for i in range(_NUM_STEPS):
            cell = vector_block(0.7, 1.8, 4, color, dot_radius=0.05)
            cell.move_to(np.array([step_xs[i], ly, 0]))
            cells.append(cell)
            diagram.add(cell)
        layer["cells"] = cells

        # Horizontal arrows between cells
        h_arrows = []
        for i in range(_NUM_STEPS):
            if i < _NUM_STEPS - 1:
                h_start = np.array([step_xs[i] + 0.45, ly, 0])
                h_end = np.array([step_xs[i + 1] - 0.45, ly, 0])
            else:
                h_start = np.array([step_xs[i] + 0.45, ly, 0])
                h_end = np.array([step_xs[i] + 1.6, ly, 0])
            h_arr = thin_arrow(h_start, h_end, color=color, opacity=0.7)
            h_arrows.append(h_arr)
            diagram.add(h_arr)
        layer["h_arrows"] = h_arrows

        # Vertical arrows up (layer outputs)
        v_arrows = []
        for i in range(_NUM_STEPS):
            v_start = np.array([step_xs[i], ly + 1.0, 0])
            if k < _NUM_LAYERS - 1:
                v_end = np.array([step_xs[i], layer_ys[k + 1] - 1.0, 0])
            else:
                # Top layer: short output arrow
                v_end = np.array([step_xs[i], ly + 1.6, 0])
            v_arr = thin_arrow(v_start, v_end, color=color, opacity=0.6)
            v_lbl = Tex(rf"h^{{({k+1})}}_{{{i+1}}}", font_size=20, color=label_color)
            v_lbl.next_to(v_arr, RIGHT, buff=0.08)
            v_group = VGroup(v_arr, v_lbl)
            v_arrows.append(v_group)
            diagram.add(v_group)
        layer["v_arrows_up"] = v_arrows

        # Layer label on the left
        layer_label = Text(f"RNN layer {k + 1}", font_size=24, color=label_color, weight=BOLD)
        layer_label.move_to(np.array([step_xs[0] - 3.0, ly, 0]))
        layer["label"] = layer_label
        diagram.add(layer_label)

        layer_data.append(layer)

    # ====== DASHED BORDERS ======
    dashed_borders = VGroup()
    border_top = layer_ys[-1] + 1.8
    border_bottom = input_y + 0.7
    border_height = border_top - border_bottom
    border_width = _CELL_SPACING * 0.75

    for i in range(_NUM_STEPS):
        cx = step_xs[i]
        cy = (border_top + border_bottom) / 2

        # Build dashed rectangle from individual sides for reliable rendering
        top_left = np.array([cx - border_width / 2, border_top, 0])
        top_right = np.array([cx + border_width / 2, border_top, 0])
        bot_left = np.array([cx - border_width / 2, border_bottom, 0])
        bot_right = np.array([cx + border_width / 2, border_bottom, 0])

        sides = VGroup()
        for start, end in [(top_left, top_right), (top_right, bot_right),
                           (bot_right, bot_left), (bot_left, top_left)]:
            line = Line(start, end)
            dashed_line = DashedVMobject(line, num_dashes=15)
            dashed_line.set_stroke(BLUE, width=1.5, opacity=0.5)
            sides.add(dashed_line)

        state_label = Text(f"hidden state {i + 1}", font_size=20, color=BLUE_B)
        state_label.move_to(np.array([cx, border_top + 0.3, 0]))

        dashed_borders.add(VGroup(sides, state_label))

    diagram.add(dashed_borders)

    # ====== INFO BOX (separate from diagram) ======
    info_text = Tex(
        r"\text{For each state, the output of}" + r"\\"
        + r"\text{the hidden layer } i \text{ is used as}" + r"\\"
        + r"\text{the input of the hidden layer } i\!+\!1.",
        font_size=26, color=WHITE,
    )
    info_box = info_text

    return diagram, input_group, layer_data, dashed_borders, info_box


def slide_rnn_multi_layer(scene: Scene):
    """Multi-Layer RNN slide with progressive bottom-up activation."""
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(11)

    title = Text("Multi-Layer RNN", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.3)

    diagram, input_group, layer_data, dashed_borders, info_box = _build_multi_layer_rnn(
        ORIGIN + DOWN * 1.0
    )
    diagram.scale(0.6, about_point=ORIGIN)
    diagram.shift(DOWN * 0.5)

    # Position info box to the right
    info_box.scale(0.7)
    info_box.move_to(np.array([5.5, 0.5, 0]))

    # Dim diagram, keep info box at full opacity
    diagram.set_opacity(_DIM)
    info_box.set_opacity(1.0)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(diagram), FadeIn(info_box), run_time=0.6)
    scene.wait()

    # === Step 1: Inputs activate ===
    scene.play(input_group.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()

    # === Steps 2-4: Each layer activates left to right ===
    for k in range(_NUM_LAYERS):
        ld = layer_data[k]

        # h0 + layer label
        scene.play(
            ld["h0"].animate.set_opacity(1.0),
            ld["label"].animate.set_opacity(1.0),
            run_time=0.4,
        )

        # Each cell activates with its arrows
        for i in range(_NUM_STEPS):
            scene.play(
                ld["cells"][i].animate.set_opacity(1.0),
                ld["h_arrows"][i].animate.set_opacity(1.0),
                ld["v_arrows_up"][i].animate.set_opacity(1.0),
                run_time=0.3,
            )

        scene.wait()

    # === Final step: Dashed borders ===
    scene.play(dashed_borders.animate.set_opacity(1.0), run_time=0.5)
    scene.wait()
