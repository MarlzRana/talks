from manimlib import *

from utils.hue.bridge import fire_light_change, fire_light_restore, get_light_state_by_name

_DIM = 0.15


def _build_lstm_equations(center):
    """Build the LSTM gate equations on the left side.

    Returns (panel, groups) where groups maps highlight keys to VGroups.
    """
    # Gate equations with color-coded gate symbols
    eq_f = Tex(
        r"f_k = \sigma(W_h^f \cdot h_{k-1} + W_x^f \cdot x_k + b_f)",
        font_size=22,
        t2c={"f_k": ORANGE, "f": ORANGE},
    )
    eq_i = Tex(
        r"i_k = \sigma(W_h^i \cdot h_{k-1} + W_x^i \cdot x_k + b_i)",
        font_size=22,
        t2c={"i_k": GREEN, "i": GREEN},
    )
    eq_o = Tex(
        r"o_k = \sigma(W_h^o \cdot h_{k-1} + W_x^o \cdot x_k + b_o)",
        font_size=22,
        t2c={"o_k": RED, "o": RED},
    )

    # Cell state and hidden state with color-coded references
    eq_c = Tex(
        r"C_k = \tanh(W_h \cdot h_{k-1} + W_x \cdot x_k + b)",
        font_size=22,
        t2c={"C_k": BLUE},
    )
    eq_h = Tex(
        r"h_k = o_k \cdot \tanh(f_k \cdot C_{k-1} + i_k \cdot C_k)",
        font_size=22,
        t2c={"h_k": PURPLE, "o_k": RED, "f_k": ORANGE, "i_k": GREEN, "C_{k-1}": BLUE, "C_k": BLUE},
    )

    # Group gates together, then cell/hidden
    gates = VGroup(eq_f, eq_i, eq_o)
    gates.arrange(DOWN, buff=0.3, aligned_edge=LEFT)

    state = VGroup(eq_c, eq_h)
    state.arrange(DOWN, buff=0.3, aligned_edge=LEFT)

    # Separator line
    sep = Line(LEFT * 2.5, RIGHT * 2.5, stroke_width=1, stroke_color=GREY_C)

    panel = VGroup(gates, sep, state)
    panel.arrange(DOWN, buff=0.4)
    panel.move_to(center)

    groups = {
        "cell_state": VGroup(eq_c),
        "hidden_state": VGroup(eq_h),
        "forget_gate": VGroup(eq_f),
        "input_gate": VGroup(eq_i),
        "output_gate": VGroup(eq_o),
        "sep": VGroup(sep),
    }

    return panel, groups


def _build_lstm_descriptions(center):
    """Build the symbol/component descriptions on the right side."""
    items = [
        (r"f_k", r"\text{ = forget gate (selects from } C_{k-1} \text{ to keep)}", ORANGE),
        (r"i_k", r"\text{ = input gate (selects from } C_k \text{ to use)}", GREEN),
        (r"o_k", r"\text{ = output gate (selects from } h_k \text{ to use)}", RED),
        (r"C_k", r"\text{ = cell state (context vector)}", BLUE),
        (r"h_k", r"\text{ = hidden state}", PURPLE),
        (r"\sigma", r"\text{ = sigmoid activation}", GREY_A),
    ]

    lines = []
    for sym, desc, color in items:
        line = Tex(sym, desc, font_size=16)
        line[0].set_color(color)
        line[1].set_color(GREY_A)
        lines.append(line)

    panel = VGroup(*lines)
    panel.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
    panel.move_to(center)
    return panel


def _highlight_eq(scene, bright_keys, eq_groups, light_color=None):
    """Highlight specific equation groups, dim others. Descriptions panel never dims."""
    if light_color:
        fire_light_change(light_color, transition_ds=6)
    anims = []
    for key, grp in eq_groups.items():
        if key in bright_keys:
            anims.append(grp.animate.set_opacity(1.0))
        else:
            anims.append(grp.animate.set_opacity(_DIM))
    scene.play(*anims, run_time=0.6)


def slide_lstm(scene: Scene):
    # Reset frame
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(8)

    # Title
    title = Text("LSTM", font_size=48, weight=BOLD)
    title.to_edge(UP, buff=0.5)

    scene.play(Write(title), run_time=0.8)

    # Equations on the left
    eq_panel, eq_groups = _build_lstm_equations(np.array([-3.0, -0.3, 0]))

    scene.play(FadeIn(eq_panel, shift=UP * 0.2), run_time=0.8)
    scene.wait()

    # Descriptions on the right
    desc_panel = _build_lstm_descriptions(np.array([4.0, -0.3, 0]))

    scene.play(FadeIn(desc_panel, shift=LEFT * 0.3), run_time=0.8)

    # >>> WAIT 1: presenter sees full slide <<<
    scene.wait()

    # Save state for restore
    eq_panel.save_state()
    saved_light = get_light_state_by_name()

    # >>> WAIT 2: highlight cell state (C_k) — BLUE
    _highlight_eq(scene, ["cell_state"], eq_groups, light_color=BLUE)
    scene.wait()

    # >>> WAIT 3: highlight hidden state (h_k) — PURPLE
    _highlight_eq(scene, ["hidden_state"], eq_groups, light_color=PURPLE)
    scene.wait()

    # >>> WAIT 4: highlight forget gate (f_k) — ORANGE
    _highlight_eq(scene, ["forget_gate"], eq_groups, light_color=ORANGE)
    scene.wait()

    # >>> WAIT 5: highlight input gate (i_k) — GREEN
    _highlight_eq(scene, ["input_gate"], eq_groups, light_color=GREEN)
    scene.wait()

    # >>> WAIT 6: highlight output gate (o_k) — RED
    _highlight_eq(scene, ["output_gate"], eq_groups, light_color=RED)
    scene.wait()

    # >>> WAIT 7: restore all
    fire_light_restore(saved_light, transition_ds=6)
    scene.play(Restore(eq_panel), run_time=0.6)
    scene.wait()
