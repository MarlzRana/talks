from manimlib import *


# --- Helpers ---

def _block(text, width, height, color, pos):
    """A labeled rounded rectangle block."""
    rect = RoundedRectangle(
        width=width, height=height, corner_radius=0.08,
        color=color, fill_opacity=0.25, stroke_width=1.5,
    )
    label = Text(text, font_size=14, color=WHITE, alignment="CENTER")
    label.move_to(rect)
    group = VGroup(rect, label)
    group.move_to(pos)
    return group


def _arrow_up(start, end):
    return Line(
        start, end,
        stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5,
    )


# --- Layout constants ---
ENC_X = -2.2
DEC_X = 2.2
BLOCK_W = 2.0
BLOCK_H = 0.45
STEP = 0.65  # vertical spacing between blocks


def _build_transformer():
    """Build the full transformer diagram. Returns (all_parts, component_groups_dict)."""

    # Y positions (bottom to top)
    y_base = -3.5

    # ====== ENCODER SIDE ======
    enc_x = ENC_X

    # Inputs label
    inputs_label = Text("Inputs", font_size=14, color=GREY_A)
    inputs_label.move_to(np.array([enc_x, y_base, 0]))

    # Input Embedding
    y_emb = y_base + 0.6
    input_emb = _block("Input\nEmbedding", BLOCK_W, 0.55, PINK, np.array([enc_x, y_emb, 0]))

    # Arrow: Inputs -> Input Embedding
    arr_in_emb = _arrow_up(
        np.array([enc_x, y_base + 0.15, 0]),
        np.array([enc_x, y_emb - 0.3, 0]),
    )

    # Positional Encoding + ⊕ + sinusoidal wave circle
    y_pos_enc = y_emb + 0.55
    pos_enc_circle_l = Circle(radius=0.12, color=WHITE, stroke_width=1.5, fill_opacity=0)
    pos_enc_circle_l.move_to(np.array([enc_x, y_pos_enc, 0]))
    plus_l = Tex(r"+", font_size=14, color=WHITE)
    plus_l.move_to(pos_enc_circle_l)

    # Sinusoidal wave circle (left of ⊕)
    sin_circle_l = Circle(radius=0.15, color=WHITE, stroke_width=1.5, fill_opacity=0)
    sin_circle_l.move_to(np.array([enc_x - 0.5, y_pos_enc, 0]))
    sin_wave_l = Tex(r"\sim", font_size=14, color=WHITE)
    sin_wave_l.move_to(sin_circle_l)
    # Arrow from wave to ⊕
    sin_arr_l = Line(
        np.array([enc_x - 0.5 + 0.15, y_pos_enc, 0]),
        np.array([enc_x - 0.12, y_pos_enc, 0]),
        stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5,
    )

    pos_label_l = Text("Positional\nEncoding", font_size=10, color=GREY_A, alignment="CENTER")
    pos_label_l.move_to(np.array([enc_x - 1.2, y_pos_enc, 0]))

    arr_emb_pos_l = _arrow_up(
        np.array([enc_x, y_emb + 0.3, 0]),
        np.array([enc_x, y_pos_enc - 0.15, 0]),
    )

    # Encoder stack
    y_stack_base = y_pos_enc + 0.8

    # Multi-Head Attention
    y_mha_enc = y_stack_base
    enc_mha = _block("Multi-Head\nAttention", BLOCK_W, BLOCK_H, ORANGE, np.array([enc_x, y_mha_enc, 0]))
    _tri_sp = 0.25  # spacing for triple arrows
    _branch_y_enc = y_mha_enc - BLOCK_H / 2 - 0.15  # branch point just below the block
    arr_pos_mha_l = VGroup(
        # Single stalk from ⊕ up to branch point
        Line(np.array([enc_x, y_pos_enc + 0.15, 0]), np.array([enc_x, _branch_y_enc, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Horizontal bar at branch point
        Line(np.array([enc_x - _tri_sp, _branch_y_enc, 0]), np.array([enc_x + _tri_sp, _branch_y_enc, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Three vertical stubs up into the block
        Line(np.array([enc_x - _tri_sp, _branch_y_enc, 0]), np.array([enc_x - _tri_sp, y_mha_enc - BLOCK_H / 2, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([enc_x, _branch_y_enc, 0]), np.array([enc_x, y_mha_enc - BLOCK_H / 2, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([enc_x + _tri_sp, _branch_y_enc, 0]), np.array([enc_x + _tri_sp, y_mha_enc - BLOCK_H / 2, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )

    # Add & Norm 1
    y_an1_enc = y_mha_enc + STEP
    enc_an1 = _block("Add & Norm", BLOCK_W, BLOCK_H, YELLOW, np.array([enc_x, y_an1_enc, 0]))
    arr_mha_an1_enc = _arrow_up(
        np.array([enc_x, y_mha_enc + BLOCK_H / 2, 0]),
        np.array([enc_x, y_an1_enc - BLOCK_H / 2, 0]),
    )

    # Skip connection 1 (around Multi-Head Attention)
    _sx = enc_x - BLOCK_W / 2 - 0.25
    _s1_y0 = _branch_y_enc - 0.1  # just below the triple-arrow fork
    skip1_enc = VGroup(
        Line(np.array([enc_x, _s1_y0, 0]), np.array([_sx, _s1_y0, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_sx, _s1_y0, 0]), np.array([_sx, y_an1_enc, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_sx, y_an1_enc, 0]), np.array([enc_x - BLOCK_W / 2 - 0.02, y_an1_enc, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )
    skip1_enc_arr = Polygon(
        np.array([enc_x - BLOCK_W / 2 - 0.02, y_an1_enc, 0]),
        np.array([enc_x - BLOCK_W / 2 - 0.1, y_an1_enc + 0.04, 0]),
        np.array([enc_x - BLOCK_W / 2 - 0.1, y_an1_enc - 0.04, 0]),
        fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
    )

    # Feed Forward
    y_ff_enc = y_an1_enc + STEP
    enc_ff = _block("Feed\nForward", BLOCK_W, BLOCK_H, BLUE, np.array([enc_x, y_ff_enc, 0]))
    arr_an1_ff_enc = _arrow_up(
        np.array([enc_x, y_an1_enc + BLOCK_H / 2, 0]),
        np.array([enc_x, y_ff_enc - BLOCK_H / 2, 0]),
    )

    # Add & Norm 2
    y_an2_enc = y_ff_enc + STEP
    enc_an2 = _block("Add & Norm", BLOCK_W, BLOCK_H, YELLOW, np.array([enc_x, y_an2_enc, 0]))
    arr_ff_an2_enc = _arrow_up(
        np.array([enc_x, y_ff_enc + BLOCK_H / 2, 0]),
        np.array([enc_x, y_an2_enc - BLOCK_H / 2, 0]),
    )

    # Skip connection 2 (around Feed Forward)
    _s2_y0 = (y_an1_enc + BLOCK_H / 2 + y_ff_enc - BLOCK_H / 2) / 2  # midpoint between AN1 top and FF bottom
    skip2_enc = VGroup(
        Line(np.array([enc_x, _s2_y0, 0]), np.array([_sx, _s2_y0, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_sx, _s2_y0, 0]), np.array([_sx, y_an2_enc, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_sx, y_an2_enc, 0]), np.array([enc_x - BLOCK_W / 2 - 0.02, y_an2_enc, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )
    skip2_enc_arr = Polygon(
        np.array([enc_x - BLOCK_W / 2 - 0.02, y_an2_enc, 0]),
        np.array([enc_x - BLOCK_W / 2 - 0.1, y_an2_enc + 0.04, 0]),
        np.array([enc_x - BLOCK_W / 2 - 0.1, y_an2_enc - 0.04, 0]),
        fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
    )

    # Encoder bounding box
    enc_box = RoundedRectangle(
        width=BLOCK_W + 0.8, height=(y_an2_enc - y_mha_enc) + BLOCK_H + 0.4,
        corner_radius=0.15, color=GREY, fill_opacity=0.03, stroke_width=1, stroke_opacity=0.3,
    )
    enc_box.move_to(np.array([enc_x, (y_mha_enc + y_an2_enc) / 2, 0]))

    nx_enc = Text("N×", font_size=14, color=GREY_A)
    nx_enc.next_to(enc_box, LEFT, buff=0.15)

    # ====== DECODER SIDE ======
    dec_x = DEC_X

    # Outputs label
    outputs_label = Text("Outputs\n(shifted right)", font_size=14, color=GREY_A, alignment="CENTER")
    outputs_label.move_to(np.array([dec_x, y_base, 0]))

    # Output Embedding
    output_emb = _block("Output\nEmbedding", BLOCK_W, 0.55, PINK, np.array([dec_x, y_emb, 0]))
    arr_out_emb = _arrow_up(
        np.array([dec_x, y_base + 0.2, 0]),
        np.array([dec_x, y_emb - 0.3, 0]),
    )

    # Positional Encoding + ⊕ + sinusoidal wave circle
    pos_enc_circle_r = Circle(radius=0.12, color=WHITE, stroke_width=1.5, fill_opacity=0)
    pos_enc_circle_r.move_to(np.array([dec_x, y_pos_enc, 0]))
    plus_r = Tex(r"+", font_size=14, color=WHITE)
    plus_r.move_to(pos_enc_circle_r)

    # Sinusoidal wave circle (right of ⊕)
    sin_circle_r = Circle(radius=0.15, color=WHITE, stroke_width=1.5, fill_opacity=0)
    sin_circle_r.move_to(np.array([dec_x + 0.5, y_pos_enc, 0]))
    sin_wave_r = Tex(r"\sim", font_size=14, color=WHITE)
    sin_wave_r.move_to(sin_circle_r)
    # Arrow from ⊕ to wave
    sin_arr_r = Line(
        np.array([dec_x + 0.12, y_pos_enc, 0]),
        np.array([dec_x + 0.5 - 0.15, y_pos_enc, 0]),
        stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5,
    )

    pos_label_r = Text("Positional\nEncoding", font_size=10, color=GREY_A, alignment="CENTER")
    pos_label_r.move_to(np.array([dec_x + 1.2, y_pos_enc, 0]))

    arr_emb_pos_r = _arrow_up(
        np.array([dec_x, y_emb + 0.3, 0]),
        np.array([dec_x, y_pos_enc - 0.15, 0]),
    )

    # Decoder stack
    # Masked Multi-Head Attention
    y_mmha = y_stack_base
    dec_mmha = _block("Masked\nMulti-Head\nAttention", BLOCK_W, 0.55, ORANGE, np.array([dec_x, y_mmha, 0]))
    _branch_y_mmha = y_mmha - 0.3 - 0.15
    arr_pos_mmha = VGroup(
        # Single stalk from ⊕ up to branch point
        Line(np.array([dec_x, y_pos_enc + 0.15, 0]), np.array([dec_x, _branch_y_mmha, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Horizontal bar at branch point
        Line(np.array([dec_x - _tri_sp, _branch_y_mmha, 0]), np.array([dec_x + _tri_sp, _branch_y_mmha, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Three vertical stubs up into the block
        Line(np.array([dec_x - _tri_sp, _branch_y_mmha, 0]), np.array([dec_x - _tri_sp, y_mmha - 0.3, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([dec_x, _branch_y_mmha, 0]), np.array([dec_x, y_mmha - 0.3, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([dec_x + _tri_sp, _branch_y_mmha, 0]), np.array([dec_x + _tri_sp, y_mmha - 0.3, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )

    # Add & Norm 1 (decoder)
    y_an1_dec = y_mmha + 0.7
    dec_an1 = _block("Add & Norm", BLOCK_W, BLOCK_H, YELLOW, np.array([dec_x, y_an1_dec, 0]))
    arr_mmha_an1 = _arrow_up(
        np.array([dec_x, y_mmha + 0.3, 0]),
        np.array([dec_x, y_an1_dec - BLOCK_H / 2, 0]),
    )

    # Skip connection 1 decoder
    _dx = dec_x + BLOCK_W / 2 + 0.25
    _d1_y0 = _branch_y_mmha - 0.1  # just below the triple-arrow fork
    skip1_dec = VGroup(
        # Horizontal branch to the right
        Line(np.array([dec_x, _d1_y0, 0]), np.array([_dx, _d1_y0, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Vertical up to Add & Norm
        Line(np.array([_dx, _d1_y0, 0]), np.array([_dx, y_an1_dec, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Horizontal back to block
        Line(np.array([_dx, y_an1_dec, 0]), np.array([dec_x + BLOCK_W / 2 + 0.02, y_an1_dec, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )
    skip1_dec_arr = Polygon(
        np.array([dec_x + BLOCK_W / 2 + 0.02, y_an1_dec, 0]),
        np.array([dec_x + BLOCK_W / 2 + 0.1, y_an1_dec + 0.04, 0]),
        np.array([dec_x + BLOCK_W / 2 + 0.1, y_an1_dec - 0.04, 0]),
        fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
    )

    # Multi-Head Attention (cross-attention)
    y_mha_dec = y_an1_dec + STEP
    dec_mha = _block("Multi-Head\nAttention", BLOCK_W, BLOCK_H, ORANGE, np.array([dec_x, y_mha_dec, 0]))
    # Q from below (center), K and V from encoder (left two arrows)
    arr_an1_mha_dec = _arrow_up(
        np.array([dec_x, y_an1_dec + BLOCK_H / 2, 0]),
        np.array([dec_x, y_mha_dec - BLOCK_H / 2, 0]),
    )

    # Add & Norm 2 (decoder)
    y_an2_dec = y_mha_dec + STEP
    dec_an2 = _block("Add & Norm", BLOCK_W, BLOCK_H, YELLOW, np.array([dec_x, y_an2_dec, 0]))
    arr_mha_an2_dec = _arrow_up(
        np.array([dec_x, y_mha_dec + BLOCK_H / 2, 0]),
        np.array([dec_x, y_an2_dec - BLOCK_H / 2, 0]),
    )

    # Skip connection 2 decoder
    _d2_y0 = (y_an1_dec + BLOCK_H / 2 + y_mha_dec - BLOCK_H / 2) / 2  # midpoint between AN1 and MHA
    skip2_dec = VGroup(
        Line(np.array([dec_x, _d2_y0, 0]), np.array([_dx, _d2_y0, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_dx, _d2_y0, 0]), np.array([_dx, y_an2_dec, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_dx, y_an2_dec, 0]), np.array([dec_x + BLOCK_W / 2 + 0.02, y_an2_dec, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )
    skip2_dec_arr = Polygon(
        np.array([dec_x + BLOCK_W / 2 + 0.02, y_an2_dec, 0]),
        np.array([dec_x + BLOCK_W / 2 + 0.1, y_an2_dec + 0.04, 0]),
        np.array([dec_x + BLOCK_W / 2 + 0.1, y_an2_dec - 0.04, 0]),
        fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
    )

    # Feed Forward (decoder)
    y_ff_dec = y_an2_dec + STEP
    dec_ff = _block("Feed\nForward", BLOCK_W, BLOCK_H, BLUE, np.array([dec_x, y_ff_dec, 0]))
    arr_an2_ff_dec = _arrow_up(
        np.array([dec_x, y_an2_dec + BLOCK_H / 2, 0]),
        np.array([dec_x, y_ff_dec - BLOCK_H / 2, 0]),
    )

    # Add & Norm 3 (decoder)
    y_an3_dec = y_ff_dec + STEP
    dec_an3 = _block("Add & Norm", BLOCK_W, BLOCK_H, YELLOW, np.array([dec_x, y_an3_dec, 0]))
    arr_ff_an3_dec = _arrow_up(
        np.array([dec_x, y_ff_dec + BLOCK_H / 2, 0]),
        np.array([dec_x, y_an3_dec - BLOCK_H / 2, 0]),
    )

    # Skip connection 3 decoder
    _d3_y0 = (y_an2_dec + BLOCK_H / 2 + y_ff_dec - BLOCK_H / 2) / 2  # midpoint between AN2 and FF
    skip3_dec = VGroup(
        Line(np.array([dec_x, _d3_y0, 0]), np.array([_dx, _d3_y0, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_dx, _d3_y0, 0]), np.array([_dx, y_an3_dec, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Line(np.array([_dx, y_an3_dec, 0]), np.array([dec_x + BLOCK_W / 2 + 0.02, y_an3_dec, 0]), stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
    )
    skip3_dec_arr = Polygon(
        np.array([dec_x + BLOCK_W / 2 + 0.02, y_an3_dec, 0]),
        np.array([dec_x + BLOCK_W / 2 + 0.1, y_an3_dec + 0.04, 0]),
        np.array([dec_x + BLOCK_W / 2 + 0.1, y_an3_dec - 0.04, 0]),
        fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
    )

    # Decoder bounding box
    dec_box = RoundedRectangle(
        width=BLOCK_W + 0.8, height=(y_an3_dec - y_mmha) + 0.55 + 0.4,
        corner_radius=0.15, color=GREY, fill_opacity=0.03, stroke_width=1, stroke_opacity=0.3,
    )
    dec_box.move_to(np.array([dec_x, (y_mmha + y_an3_dec) / 2, 0]))

    nx_dec = Text("N×", font_size=14, color=GREY_A)
    nx_dec.next_to(dec_box, RIGHT, buff=0.15)

    # Encoder → Decoder connection
    # Single line from encoder top, goes right to a split point just left of decoder MHA,
    # then splits into two arrows entering the decoder MHA block
    _conn_y = y_an2_enc + BLOCK_H / 2 + 0.1
    _split_x = dec_x - BLOCK_W / 2 - 0.35
    _mha_top = y_mha_dec + 0.08
    _mha_bot = y_mha_dec - 0.08
    enc_dec_conn = VGroup(
        # Vertical stalk up from encoder top Add & Norm
        Line(np.array([enc_x, y_an2_enc + BLOCK_H / 2, 0]), np.array([enc_x, _conn_y, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Single horizontal line from encoder out to split point
        Line(np.array([enc_x, _conn_y, 0]), np.array([_split_x, _conn_y, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Vertical line down from split to just below decoder MHA
        Line(np.array([_split_x, _conn_y, 0]), np.array([_split_x, _mha_bot, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        # Upper branch: horizontal into decoder MHA (top)
        Line(np.array([_split_x, _mha_top, 0]), np.array([dec_x - BLOCK_W / 2, _mha_top, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Polygon(
            np.array([dec_x - BLOCK_W / 2, _mha_top, 0]),
            np.array([dec_x - BLOCK_W / 2 - 0.08, _mha_top + 0.04, 0]),
            np.array([dec_x - BLOCK_W / 2 - 0.08, _mha_top - 0.04, 0]),
            fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
        ),
        # Lower branch: horizontal into decoder MHA (bottom)
        Line(np.array([_split_x, _mha_bot, 0]), np.array([dec_x - BLOCK_W / 2, _mha_bot, 0]),
             stroke_width=1.5, stroke_color=WHITE, stroke_opacity=0.5),
        Polygon(
            np.array([dec_x - BLOCK_W / 2, _mha_bot, 0]),
            np.array([dec_x - BLOCK_W / 2 - 0.08, _mha_bot + 0.04, 0]),
            np.array([dec_x - BLOCK_W / 2 - 0.08, _mha_bot - 0.04, 0]),
            fill_color=WHITE, fill_opacity=0.5, stroke_width=0,
        ),
    )

    # Linear
    y_linear = y_an3_dec + 1.0
    linear = _block("Linear", BLOCK_W, BLOCK_H, PURPLE, np.array([dec_x, y_linear, 0]))
    arr_an3_linear = _arrow_up(
        np.array([dec_x, y_an3_dec + BLOCK_H / 2, 0]),
        np.array([dec_x, y_linear - BLOCK_H / 2, 0]),
    )

    # Softmax
    y_softmax = y_linear + STEP
    softmax = _block("Softmax", BLOCK_W, BLOCK_H, GREEN, np.array([dec_x, y_softmax, 0]))
    arr_linear_softmax = _arrow_up(
        np.array([dec_x, y_linear + BLOCK_H / 2, 0]),
        np.array([dec_x, y_softmax - BLOCK_H / 2, 0]),
    )

    # Output Probabilities label
    out_prob = Text("Output\nProbabilities", font_size=14, color=GREY_A, alignment="CENTER")
    out_prob.move_to(np.array([dec_x, y_softmax + 0.7, 0]))
    arr_softmax_out = _arrow_up(
        np.array([dec_x, y_softmax + BLOCK_H / 2, 0]),
        np.array([dec_x, y_softmax + 0.5, 0]),
    )

    # ====== GROUP COMPONENTS ======

    embeddings = VGroup(input_emb, output_emb)

    positional = VGroup(
        pos_enc_circle_l, plus_l, sin_circle_l, sin_wave_l, sin_arr_l, pos_label_l, arr_emb_pos_l,
        pos_enc_circle_r, plus_r, sin_circle_r, sin_wave_r, sin_arr_r, pos_label_r, arr_emb_pos_r,
    )

    encoder_attention = VGroup(enc_mha)
    decoder_masked_attention = VGroup(dec_mmha)
    decoder_attention = VGroup(dec_mha)

    add_norms = VGroup(
        enc_an1, enc_an2, dec_an1, dec_an2, dec_an3,
        skip1_enc, skip1_enc_arr, skip2_enc, skip2_enc_arr,
        skip1_dec, skip1_dec_arr, skip2_dec, skip2_dec_arr,
        skip3_dec, skip3_dec_arr,
    )

    feed_forwards = VGroup(enc_ff, dec_ff)

    linear_softmax = VGroup(linear, softmax, arr_linear_softmax, arr_softmax_out, out_prob)

    encoder_decoder_connection = enc_dec_conn

    labels = VGroup(inputs_label, outputs_label, nx_enc, nx_dec)
    boxes = VGroup(enc_box, dec_box)

    internal_arrows = VGroup(
        arr_in_emb, arr_out_emb,
        arr_pos_mha_l, arr_pos_mmha,
        arr_mha_an1_enc, arr_an1_ff_enc, arr_ff_an2_enc,
        arr_mmha_an1, arr_an1_mha_dec, arr_mha_an2_dec,
        arr_an2_ff_dec, arr_ff_an3_dec, arr_an3_linear,
    )

    all_parts = VGroup(
        embeddings, positional, encoder_attention, decoder_masked_attention,
        decoder_attention, add_norms, feed_forwards, linear_softmax,
        encoder_decoder_connection, labels, boxes, internal_arrows,
    )

    groups = {
        "embeddings": embeddings,
        "positional": positional,
        "encoder_attention": encoder_attention,
        "decoder_masked_attention": decoder_masked_attention,
        "decoder_attention": decoder_attention,
        "add_norms": add_norms,
        "feed_forwards": feed_forwards,
        "linear_softmax": linear_softmax,
        "encoder_decoder_connection": encoder_decoder_connection,
        "labels": labels,
        "boxes": boxes,
        "internal_arrows": internal_arrows,
    }

    # Store symbol refs for special handling during highlights
    circle_symbols = [plus_l, plus_r, sin_wave_l, sin_wave_r]

    circle_symbols = [plus_l, plus_r, sin_wave_l, sin_wave_r]

    # Activation steps: each is a VGroup of [block + incoming connections + relevant labels]
    encoder_steps = [
        VGroup(input_emb, arr_in_emb, inputs_label),
        VGroup(pos_enc_circle_l, plus_l, sin_circle_l, sin_wave_l, sin_arr_l, arr_emb_pos_l, pos_label_l),
        VGroup(enc_mha, arr_pos_mha_l, nx_enc),
        VGroup(enc_an1, arr_mha_an1_enc, skip1_enc, skip1_enc_arr),
        VGroup(enc_ff, arr_an1_ff_enc),
        VGroup(enc_an2, arr_ff_an2_enc, skip2_enc, skip2_enc_arr),
    ]
    decoder_steps = [
        VGroup(output_emb, arr_out_emb, outputs_label),
        VGroup(pos_enc_circle_r, plus_r, sin_circle_r, sin_wave_r, sin_arr_r, arr_emb_pos_r, pos_label_r),
        VGroup(dec_mmha, arr_pos_mmha, nx_dec),
        VGroup(dec_an1, arr_mmha_an1, skip1_dec, skip1_dec_arr),
        VGroup(dec_mha, arr_an1_mha_dec, enc_dec_conn),
        VGroup(dec_an2, arr_mha_an2_dec, skip2_dec, skip2_dec_arr),
        VGroup(dec_ff, arr_an2_ff_dec),
        VGroup(dec_an3, arr_ff_an3_dec, skip3_dec, skip3_dec_arr),
        VGroup(linear, arr_an3_linear),
        VGroup(softmax, arr_linear_softmax, arr_softmax_out, out_prob),
    ]

    return all_parts, groups, circle_symbols, encoder_steps, decoder_steps


def _highlight(scene, bright_keys, groups, subtitle_text, prev_subtitle, circle_symbols):
    """Highlight specific groups, dim the rest, update subtitle."""
    all_keys = list(groups.keys())
    anims = []
    for key in all_keys:
        if key in bright_keys:
            anims.append(groups[key].animate.set_opacity(1.0))
        else:
            anims.append(groups[key].animate.set_opacity(0.15))

    new_subtitle = Text(subtitle_text, font_size=18, color=GREY_A)
    new_subtitle.to_edge(DOWN, buff=0.15)

    if prev_subtitle:
        anims.append(FadeOut(prev_subtitle))
    anims.append(FadeIn(new_subtitle))

    # Change +/~ symbols: black when positional highlighted (circle fill is white), white otherwise
    if "positional" in bright_keys:
        for sym in circle_symbols:
            anims.append(sym.animate.set_color(BLACK))
    else:
        for sym in circle_symbols:
            anims.append(sym.animate.set_color(WHITE))

    scene.play(*anims, run_time=0.8)
    return new_subtitle


# --- Main slide ---

def slide_transformer_overview(scene: Scene):
    # Title
    title = Text("Transformer Architecture", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.3)

    # Build diagram
    diagram, groups, circle_symbols, encoder_steps, decoder_steps = _build_transformer()
    diagram.scale(0.85)
    diagram.move_to(ORIGIN).shift(DOWN * 0.5)

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(diagram), run_time=1.0)
    scene.wait()

    # Step 1: Embeddings
    sub = _highlight(
        scene,
        ["embeddings"],
        groups,
        "Explained in the embedding FFN section",
        None,
        circle_symbols,
    )
    scene.wait()

    # Step 2: Attention blocks
    sub = _highlight(
        scene,
        ["encoder_attention", "decoder_masked_attention", "decoder_attention"],
        groups,
        "Explained by looking at the history of the RNN",
        sub,
        circle_symbols,
    )
    scene.wait()

    # Step 3: Skip connections + Add & Norm
    sub = _highlight(
        scene,
        ["add_norms"],
        groups,
        "Explained by looking at the history of the ImageNet challenge",
        sub,
        circle_symbols,
    )
    scene.wait()

    # Step 4: The rest
    sub = _highlight(
        scene,
        ["positional", "feed_forwards", "encoder_decoder_connection", "linear_softmax"],
        groups,
        "The glue and the rest of the methodology",
        sub,
        circle_symbols,
    )
    scene.wait()

    # Step 5: Activation demo — dim everything, then sweep
    dim_anims = [g.animate.set_opacity(0.15) for g in groups.values()]
    dim_anims.append(FadeOut(sub))
    # Reset symbols to white when dimmed
    for sym in circle_symbols:
        dim_anims.append(sym.animate.set_color(WHITE))
    scene.play(*dim_anims, run_time=0.6)

    def _sweep_stack(steps, run_time=0.15):
        """Sweep a highlight through a list of step groups, bottom-to-top."""
        for step in steps:
            scene.play(
                step.animate.set_opacity(1.0),
                run_time=run_time,
            )
        # Brief pause at the top, then dim back
        scene.play(
            *[s.animate.set_opacity(0.15) for s in steps],
            run_time=0.3,
        )

    # Encoder activates once (auto-encoding)
    _sweep_stack(encoder_steps, run_time=0.12)

    # Decoder activates three times (auto-regressive)
    for _ in range(5):
        _sweep_stack(decoder_steps, run_time=0.1)

    scene.wait()
