from manimlib import *

from talks.shared_components.word2vec_diagrams import vector_block, thin_arrow

_DIM = 0.15
_CELL_SPACING = 3.2


def _layer_box(center, label_text, color):
    """A labeled layer box (attention layer or prediction layer)."""
    box = RoundedRectangle(
        width=1.6, height=0.6, corner_radius=0.05,
        color=color, fill_opacity=0.1, stroke_width=1.5, stroke_opacity=0.7,
    )
    box.move_to(center)
    text = Text(label_text, font_size=14, color=color, weight=BOLD)
    text.move_to(box.get_center())
    return VGroup(box, text)


def _build_attention_rnn(center):
    """Build the full Attention RNN diagram.

    Returns (diagram, enc_h0, enc_steps, connection, dec_steps, attention_groups, info_text).
    """
    c = center
    enc_words = ["This", "is", "cat"]
    dec_inputs = ["<start>", "c'est", "un"]
    dec_outputs = ["c'est", "un", "chat"]
    num_enc = len(enc_words)
    num_dec = len(dec_inputs)

    enc_start_x = c[0] - 7.0
    dec_start_x = c[0] + 3.5

    # ====== ENCODER ======
    enc_group = VGroup()
    enc_steps = []
    enc_cell_centers = []

    for i in range(num_enc):
        enc_cell_centers.append(np.array([enc_start_x + i * _CELL_SPACING, c[1], 0]))

    # h₀ arrow
    h0_start = enc_cell_centers[0] + LEFT * 1.8
    h0_end = enc_cell_centers[0] + LEFT * 0.5
    h0_arrow = thin_arrow(h0_start, h0_end, color=WHITE, opacity=0.8)
    h0_label = Tex(r"h_0", font_size=24, color=GREY_A)
    h0_label.move_to((h0_start + h0_end) / 2 + UP * 0.25)
    enc_h0 = VGroup(h0_arrow, h0_label)
    enc_group.add(enc_h0)

    for i in range(num_enc):
        cc = enc_cell_centers[i]
        step = {}

        # Cell
        cell = vector_block(0.7, 1.8, 4, RED, dot_radius=0.05)
        cell.move_to(cc)
        step["cell"] = cell
        enc_group.add(cell)

        # Input
        x_arrow = thin_arrow(cc + DOWN * 1.8, cc + DOWN * 1.0, color=WHITE, opacity=0.8)
        x_label = Tex(
            rf"x_{{{i+1}}} = e_{{{i+1}}} F_{{En}}",
            font_size=18, color=BLUE_B,
        )
        x_label.move_to(cc + DOWN * 2.15)
        word_label = Text(enc_words[i], font_size=22, color=GREY_B, weight=BOLD)
        word_label.move_to(cc + DOWN * 2.7)

        # Embedding block
        emb = vector_block(1.2, 0.45, 4, YELLOW_D, dot_radius=0.04)
        emb.move_to(cc + DOWN * 3.2)

        # (e_i) label
        e_label = Tex(rf"(e_{{{i+1}}})", font_size=18, color=YELLOW_D)
        e_label.move_to(cc + DOWN * 3.7)

        step["input"] = VGroup(x_arrow, x_label, word_label, emb, e_label)
        enc_group.add(step["input"])

        # h_right arrow
        if i < num_enc - 1:
            h_start = cc + RIGHT * 0.45
            h_end = enc_cell_centers[i + 1] + LEFT * 0.45
        else:
            h_start = cc + RIGHT * 0.45
            h_end = cc + RIGHT * 1.8
        h_arrow = thin_arrow(h_start, h_end, color=WHITE, opacity=0.8)
        h_label = Tex(rf"h_{{{i+1}}}", font_size=22, color=GREY_A)
        h_label.move_to((h_start + h_end) / 2 + UP * 0.25)
        step["h_right"] = VGroup(h_arrow, h_label)
        enc_group.add(step["h_right"])

        enc_steps.append(step)

    # ====== CONNECTION ======
    conn_start = enc_cell_centers[-1] + RIGHT * 1.8
    conn_end = np.array([dec_start_x - 0.5, c[1], 0])
    conn_arrow = Arrow(
        conn_start, conn_end,
        thickness=2.5,
        fill_opacity=0.6,
        fill_color=WHITE,
        stroke_width=0,
        buff=0.05,
        max_tip_length_to_length_ratio=0.15,
    )
    connection = conn_arrow

    # ====== DECODER ======
    dec_group = VGroup()
    dec_steps = []
    dec_cell_centers = []

    for i in range(num_dec):
        dec_cell_centers.append(np.array([dec_start_x + i * _CELL_SPACING, c[1], 0]))

    for i in range(num_dec):
        cc = dec_cell_centers[i]
        step = {}

        # Cell
        cell = vector_block(0.7, 1.8, 4, RED, dot_radius=0.05)
        cell.move_to(cc)
        step["cell"] = cell
        dec_group.add(cell)

        # Input from below
        x_arrow = thin_arrow(cc + DOWN * 1.8, cc + DOWN * 1.0, color=WHITE, opacity=0.8)
        y_label = Tex(
            rf"y_{{{i+1}}} = \hat{{e}}_{{{i}}} F_{{Fr}}",
            font_size=18, color=BLUE_B,
        )
        y_label.move_to(cc + DOWN * 2.15)
        input_word = Text(dec_inputs[i], font_size=22, color=GREY_B, weight=BOLD)
        input_word.move_to(cc + DOWN * 2.7)

        # Embedding block
        emb = vector_block(1.2, 0.45, 4, TEAL, dot_radius=0.04)
        emb.move_to(cc + DOWN * 3.2)

        # (ê_i) label
        e_hat_label = Tex(rf"(\hat{{e}}_{{{i}}})", font_size=18, color=TEAL)
        e_hat_label.move_to(cc + DOWN * 3.7)

        step["input"] = VGroup(x_arrow, y_label, input_word, emb, e_hat_label)
        dec_group.add(step["input"])

        # h_right arrow
        if i < num_dec - 1:
            h_start = cc + RIGHT * 0.45
            h_end = dec_cell_centers[i + 1] + LEFT * 0.45
        else:
            h_start = cc + RIGHT * 0.45
            h_end = cc + RIGHT * 1.8
        h_arrow = thin_arrow(h_start, h_end, color=WHITE, opacity=0.8)
        h_label = Tex(rf"\tilde{{h}}_{{{i+1}}}", font_size=22, color=GREY_A)
        h_label.move_to((h_start + h_end) / 2 + UP * 0.25)
        step["h_right"] = VGroup(h_arrow, h_label)
        dec_group.add(step["h_right"])

        dec_steps.append(step)

    # ====== ATTENTION + PREDICTION (per decoder step) ======
    attention_groups = []

    for j in range(num_dec):
        cc = dec_cell_centers[j]
        ag = {}

        # h̃ arrow up from decoder cell to attention layer
        h_up_arrow = thin_arrow(cc + UP * 1.0, cc + UP * 1.8, color=WHITE, opacity=0.8)
        h_up_label = Tex(rf"\tilde{{h}}_{{{j+1}}}", font_size=20, color=RED_B)
        h_up_label.next_to(h_up_arrow, LEFT, buff=0.08)
        ag["h_up"] = VGroup(h_up_arrow, h_up_label)
        dec_group.add(ag["h_up"])

        # Attention layer box
        attn_center = cc + UP * 2.3
        attn_box = _layer_box(attn_center, "attention layer", GREEN)
        ag["attn_box"] = attn_box
        dec_group.add(attn_box)

        # Green attention connections from each encoder cell to this attention box
        attn_connections = VGroup()
        for k in range(num_enc):
            enc_top = enc_cell_centers[k] + UP * 1.0
            attn_bottom = attn_center + DOWN * 0.35
            # Offset connection points slightly for visual clarity
            offset = (k - 1) * 0.15
            line = Line(
                enc_top,
                attn_bottom + np.array([offset, 0, 0]),
                stroke_color=GREEN,
                stroke_width=1.5,
                stroke_opacity=0.6,
            )
            attn_connections.add(line)
        ag["attn_connections"] = attn_connections
        dec_group.add(attn_connections)

        # Arrow from attention to prediction
        attn_to_pred = thin_arrow(
            attn_center + UP * 0.35,
            cc + UP * 3.3,
            color=WHITE, opacity=0.7,
        )
        dec_group.add(attn_to_pred)
        ag["attn_to_pred"] = attn_to_pred

        # Prediction layer box
        pred_center = cc + UP * 3.7
        pred_box = _layer_box(pred_center, "prediction layer", BLUE)
        ag["pred_box"] = pred_box
        dec_group.add(pred_box)

        # Output arrow + Ŷ label + predicted word + (ê) label
        out_arrow = thin_arrow(pred_center + UP * 0.35, pred_center + UP * 0.8, color=BLUE, opacity=0.8)
        y_hat_label = Tex(rf"\hat{{Y}}_{{{j+1}}}", font_size=22, color=WHITE)
        y_hat_label.move_to(pred_center + UP * 0.6 + RIGHT * 0.5)
        out_word = Text(dec_outputs[j], font_size=22, color=RED, weight=BOLD)
        out_word.move_to(pred_center + UP * 1.2)
        out_e_label = Tex(rf"(\hat{{e}}_{{{j+1}}})", font_size=18, color=RED_B)
        out_e_label.move_to(pred_center + UP * 1.6)
        ag["output"] = VGroup(out_arrow, y_hat_label, out_word, out_e_label)
        dec_group.add(ag["output"])

        # Autoregressive feedback (red dashed) to next decoder input
        if j < num_dec - 1:
            feedback_start = pred_center + UP * 1.6 + RIGHT * 0.3
            feedback_end = dec_cell_centers[j + 1] + DOWN * 2.7 + LEFT * 0.1
            feedback = DashedLine(
                feedback_start, feedback_end,
                dash_length=0.08,
                stroke_width=2,
                stroke_color=RED,
                stroke_opacity=0.7,
            )
            direction = feedback_end - feedback_start
            direction = direction / np.linalg.norm(direction)
            perp = np.array([-direction[1], direction[0], 0])
            tip = Polygon(
                feedback_end,
                feedback_end - direction * 0.12 + perp * 0.05,
                feedback_end - direction * 0.12 - perp * 0.05,
                fill_color=RED, fill_opacity=0.7, stroke_width=0,
            )
            ag["feedback"] = VGroup(feedback, tip)
            dec_group.add(ag["feedback"])

        attention_groups.append(ag)

    # ====== INFO TEXT (separate from diagram) ======
    info_text = Tex(
        r"\textbf{Core idea: }" + r"\text{Selectively build}" + r"\\"
        + r"\text{direct connection between each}" + r"\\"
        + r"\text{state in the decoder and the}" + r"\\"
        + r"\text{states in the encoder.}",
        font_size=22, color=WHITE,
    )

    # Full diagram
    diagram = VGroup(enc_group, connection, dec_group)

    return diagram, enc_h0, enc_steps, connection, dec_steps, attention_groups, info_text


def slide_rnn_attention(scene: Scene):
    """Attention RNN slide with progressive activation."""
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(9)

    title = Text("Attention RNN", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.3)

    diagram, enc_h0, enc_steps, connection, dec_steps, attention_groups, info_text = _build_attention_rnn(
        ORIGIN + DOWN * 0.5
    )
    diagram.scale(0.6)
    diagram.move_to(ORIGIN).shift(DOWN * 0.3)

    # Position info text top-right
    info_text.scale(0.8)
    info_text.move_to(np.array([5.0, 2.5, 0]))

    # Dim everything
    diagram.set_opacity(_DIM)
    info_text.set_opacity(1.0)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(diagram), FadeIn(info_text), run_time=0.6)
    scene.wait()

    # === Step 1: Encoder activates ===
    scene.play(enc_h0.animate.set_opacity(1.0), run_time=0.4)
    for step in enc_steps:
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.3,
        )
        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.3)
    scene.wait()

    # === Step 2: Decoder chain activates ===
    scene.play(connection.animate.set_opacity(1.0), run_time=0.4)
    for step in dec_steps:
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.3,
        )
        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.3)
    scene.wait()

    # === Steps 3-5: Attention + prediction per decoder step ===
    for j, ag in enumerate(attention_groups):
        anims = [
            ag["h_up"].animate.set_opacity(1.0),
            ag["attn_connections"].animate.set_opacity(1.0),
            ag["attn_box"].animate.set_opacity(1.0),
            ag["attn_to_pred"].animate.set_opacity(1.0),
            ag["pred_box"].animate.set_opacity(1.0),
            ag["output"].animate.set_opacity(1.0),
        ]
        if "feedback" in ag:
            anims.append(ag["feedback"].animate.set_opacity(1.0))
        scene.play(*anims, run_time=0.5)
        scene.wait()

    # === Step 6: Attention formulation — focus on first decoder cell ===
    # Dim decoder steps 2 and 3 (cells, inputs, h_rights, attention groups)
    dim_anims = []
    for j in range(1, 3):
        dim_anims.extend([
            dec_steps[j]["input"].animate.set_opacity(_DIM),
            dec_steps[j]["cell"].animate.set_opacity(_DIM),
            dec_steps[j]["h_right"].animate.set_opacity(_DIM),
            attention_groups[j]["h_up"].animate.set_opacity(_DIM),
            attention_groups[j]["attn_connections"].animate.set_opacity(_DIM),
            attention_groups[j]["attn_box"].animate.set_opacity(_DIM),
            attention_groups[j]["attn_to_pred"].animate.set_opacity(_DIM),
            attention_groups[j]["pred_box"].animate.set_opacity(_DIM),
            attention_groups[j]["output"].animate.set_opacity(_DIM),
        ])
        if "feedback" in attention_groups[j]:
            dim_anims.append(attention_groups[j]["feedback"].animate.set_opacity(_DIM))
    # Also dim feedback from step 0 and connection
    if "feedback" in attention_groups[0]:
        dim_anims.append(attention_groups[0]["feedback"].animate.set_opacity(_DIM))
    # Fade out info text
    dim_anims.append(info_text.animate.set_opacity(0.0))

    # Build attention formulation equations
    eq_title = Text("Attention formulation:", font_size=24, color=BLUE, weight=BOLD)
    eq1 = Tex(
        r"s_i^1 = \textit{similarity}\left(\mathbf{h}_i,\, \tilde{\mathbf{h}}_1\right),\; i = 1,2,3",
        font_size=24, color=WHITE,
    )
    eq2 = Tex(
        r"[a_1, a_2, a_3] = \textbf{softmax}\left(s_1^1,\, s_2^1,\, s_3^1\right)",
        font_size=24, color=WHITE,
    )
    eq3 = Tex(
        r"\tilde{\mathbf{h}}_1^a = a_1 \mathbf{h}_1 + a_2 \mathbf{h}_2 + a_3 \mathbf{h}_3",
        font_size=24, color=WHITE,
    )
    eq4 = Tex(
        r"\hat{\mathbf{h}}_1 = \left[\tilde{\mathbf{h}}_1^a,\, \tilde{\mathbf{h}}_1\right]",
        font_size=24, color=WHITE,
    )
    equations = VGroup(eq_title, eq1, eq2, eq3, eq4)
    equations.arrange(DOWN, buff=0.2, aligned_edge=LEFT)
    equations.move_to(np.array([-4.5, 1.5, 0]))

    scene.play(*dim_anims, run_time=0.6)
    scene.play(FadeIn(equations), run_time=0.6)
    scene.wait()
