from manimlib import *

from talks.shared_components.word2vec_diagrams import vector_block, thin_arrow

_DIM = 0.15
_CELL_SPACING = 3.2


def _prediction_box(center):
    """A prediction layer box (ANN box, green like the seq labelling example)."""
    box = RoundedRectangle(
        width=0.9, height=0.4, corner_radius=0.05,
        color=GREEN, fill_opacity=0.15, stroke_width=1.5, stroke_opacity=0.7,
    )
    box.move_to(center)
    text = Text("ANN", font_size=18, color=GREEN, weight=BOLD)
    text.move_to(box.get_center())
    return VGroup(box, text)


def _build_seq2seq(center):
    """Build the full Seq2Seq diagram.

    Returns (diagram, enc_box_group, dec_box_group, enc_h0, enc_steps, connection, dec_steps, dec_h_out).
    """
    c = center
    enc_words = ["This", "is", "cat"]
    dec_inputs = ["<start>", "C'est", "chat"]
    dec_outputs = ["C'est", "chat", "<end>"]
    num_enc = len(enc_words)
    num_dec = len(dec_inputs)

    # Layout: encoder on left, decoder on right (with gap between them)
    enc_start_x = c[0] - 7.0
    dec_start_x = c[0] + 3.5

    # ====== ENCODER ======
    enc_cell_centers = []
    for i in range(num_enc):
        enc_cell_centers.append(np.array([enc_start_x + i * _CELL_SPACING, c[1], 0]))

    enc_group = VGroup()
    enc_steps = []

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
        x_label = Tex(rf"x_{{{i+1}}}", font_size=24, color=BLUE_B)
        x_label.move_to(cc + DOWN * 2.1)
        word_label = Text(enc_words[i], font_size=26, color=GREY_B)
        word_label.move_to(cc + DOWN * 2.5)
        step["input"] = VGroup(x_arrow, x_label, word_label)
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

    # Encoder bounding box
    enc_box = RoundedRectangle(
        width=num_enc * _CELL_SPACING + 0.8,
        height=5.8,
        corner_radius=0.15,
        color=YELLOW,
        fill_opacity=0,
        stroke_width=2.5,
        stroke_opacity=0.8,
    )
    enc_box_center = np.array([
        (enc_cell_centers[0][0] + enc_cell_centers[-1][0]) / 2,
        c[1] - 0.3,
        0,
    ])
    enc_box.move_to(enc_box_center)
    enc_label = Text("Encoder", font_size=26, color=YELLOW, weight=BOLD)
    enc_label.next_to(enc_box, UP, buff=0.15)
    enc_box_group = VGroup(enc_box, enc_label)
    enc_group.add(enc_box_group)

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
    conn_label = Tex(r"\tilde{h}_0 = h_3", font_size=22, color=GREY_A)
    conn_label.next_to(conn_arrow, UP, buff=0.1)
    connection = VGroup(conn_arrow, conn_label)

    # ====== DECODER ======
    dec_cell_centers = []
    for i in range(num_dec):
        dec_cell_centers.append(np.array([dec_start_x + i * _CELL_SPACING, c[1], 0]))

    dec_group = VGroup()
    dec_steps = []

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
        input_word = Text(dec_inputs[i], font_size=26, color=GREY_B)
        input_word.move_to(cc + DOWN * 2.1)
        step["input"] = VGroup(x_arrow, input_word)
        dec_group.add(step["input"])

        # h_up arrow (cell to prediction layer)
        h_up_arrow = thin_arrow(cc + UP * 1.0, cc + UP * 1.4, color=WHITE, opacity=0.8)
        h_up_label = Tex(rf"\tilde{{h}}_{{{i+1}}}", font_size=22, color=RED_B)
        h_up_label.next_to(h_up_arrow, LEFT, buff=0.08)
        step["h_up"] = VGroup(h_up_arrow, h_up_label)
        dec_group.add(step["h_up"])

        # Prediction layer box
        pred_box = _prediction_box(cc + UP * 1.7)
        step["pred"] = pred_box
        dec_group.add(pred_box)

        # Output arrow + predicted word
        out_arrow = thin_arrow(cc + UP * 1.95, cc + UP * 2.3, color=BLUE, opacity=0.8)
        y_label = Tex(rf"\hat{{Y}}_{{{i+1}}}", font_size=22, color=WHITE)
        y_label.move_to(cc + UP * 2.15 + RIGHT * 0.4)
        out_word = Text(dec_outputs[i], font_size=26, color=GREEN_B, weight=BOLD)
        out_word.move_to(cc + UP * 2.6)
        step["output"] = VGroup(out_arrow, y_label, out_word)
        dec_group.add(step["output"])

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

        # Autoregressive feedback arrow (dashed red) — from output down to next input
        if i < num_dec - 1:
            feedback_start = cc + UP * 2.6 + RIGHT * 0.3
            feedback_end = dec_cell_centers[i + 1] + DOWN * 2.1 + LEFT * 0.1
            feedback = DashedLine(
                feedback_start, feedback_end,
                dash_length=0.08,
                stroke_width=2,
                stroke_color=RED,
                stroke_opacity=0.7,
            )
            # Arrowhead
            direction = feedback_end - feedback_start
            direction = direction / np.linalg.norm(direction)
            perp = np.array([-direction[1], direction[0], 0])
            tip = Polygon(
                feedback_end,
                feedback_end - direction * 0.12 + perp * 0.05,
                feedback_end - direction * 0.12 - perp * 0.05,
                fill_color=RED, fill_opacity=0.7, stroke_width=0,
            )
            step["feedback"] = VGroup(feedback, tip)
            dec_group.add(step["feedback"])

        dec_steps.append(step)

    # Decoder bounding box (taller on top to contain outputs)
    dec_box = RoundedRectangle(
        width=num_dec * _CELL_SPACING + 0.8,
        height=7.2,
        corner_radius=0.15,
        color=PURPLE,
        fill_opacity=0,
        stroke_width=2.5,
        stroke_opacity=0.8,
    )
    dec_box_center = np.array([
        (dec_cell_centers[0][0] + dec_cell_centers[-1][0]) / 2,
        c[1] + 0.4,
        0,
    ])
    dec_box.move_to(dec_box_center)
    dec_label = Text("Decoder", font_size=26, color=PURPLE, weight=BOLD)
    dec_label.next_to(dec_box, UP, buff=0.15)
    dec_box_group = VGroup(dec_box, dec_label)
    dec_group.add(dec_box_group)

    # Final h̃₃ output
    dec_h_out = dec_steps[-1]["h_right"]

    # Full diagram
    diagram = VGroup(enc_group, connection, dec_group)

    return diagram, enc_box_group, dec_box_group, enc_h0, enc_steps, connection, dec_steps, dec_h_out


def slide_rnn_seq2seq(scene: Scene):
    """Seq2Seq RNN slide with progressive activation."""
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(8)

    title = Text("RNN-based Seq2Seq Model", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.4)

    diagram, enc_box_group, dec_box_group, enc_h0, enc_steps, connection, dec_steps, dec_h_out = _build_seq2seq(
        ORIGIN + DOWN * 0.2
    )
    diagram.scale(0.6)
    diagram.move_to(ORIGIN).shift(DOWN * 0.3)

    # Start everything dimmed
    diagram.set_opacity(_DIM)
    # Keep boxes extra subtle initially
    enc_box_group.set_opacity(0.05)
    dec_box_group.set_opacity(0.05)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(diagram), run_time=0.6)
    scene.wait()

    # === Step 1: Encoder h₀ ===
    scene.play(enc_h0.animate.set_opacity(1.0), run_time=0.4)
    scene.wait()

    # === Step 2: Encoder cells (input → cell → h_right) ===
    for step in enc_steps:
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()
        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.4)
        scene.wait()

    # === Step 3: Connection arrow (h₃ → h̃₀) ===
    scene.play(connection.animate.set_opacity(1.0), run_time=0.4)
    scene.wait()

    # === Step 4: Encoder box reveal ===
    enc_box = enc_box_group[0]
    enc_lbl = enc_box_group[1]
    scene.play(
        enc_box.animate.set_stroke(opacity=0.8),
        enc_lbl.animate.set_opacity(1.0),
        run_time=0.6,
    )
    scene.wait()

    # === Step 5: Decoder cells ===
    for i, step in enumerate(dec_steps):
        # Input + cell
        scene.play(
            step["input"].animate.set_opacity(1.0),
            step["cell"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        # h_up + prediction layer + output
        scene.play(
            step["h_up"].animate.set_opacity(1.0),
            step["pred"].animate.set_opacity(1.0),
            step["output"].animate.set_opacity(1.0),
            run_time=0.4,
        )
        scene.wait()

        # Feedback arrow (if not last)
        if "feedback" in step:
            scene.play(step["feedback"].animate.set_opacity(1.0), run_time=0.3)
            scene.wait()

        # h_right
        scene.play(step["h_right"].animate.set_opacity(1.0), run_time=0.4)
        scene.wait()

    # === Step 6: Final h̃₃ dims back (already shown) ===
    # (h_right for last step already lit in the loop)

    # === Step 7: Decoder box reveal ===
    dec_box = dec_box_group[0]
    dec_lbl = dec_box_group[1]
    scene.play(
        dec_box.animate.set_stroke(opacity=0.8),
        dec_lbl.animate.set_opacity(1.0),
        run_time=0.6,
    )
    scene.wait()
