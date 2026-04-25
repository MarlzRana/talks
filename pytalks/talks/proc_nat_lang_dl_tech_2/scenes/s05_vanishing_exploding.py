from manimlib import *

from utils.hue.bridge import fire_light_change, fire_light_restore, get_light_state_by_name

_DIM = 0.15

# Power demo steps: (exponent, vanishing_result, exploding_result)
_STEPS = [
    (1, 0.9**1, 1.1**1),
    (2, 0.9**2, 1.1**2),
    (5, 0.9**5, 1.1**5),
    (10, 0.9**10, 1.1**10),
    (50, 0.9**50, 1.1**50),
]


def _fmt(val):
    """Format a float for display — use scientific notation if very small or large."""
    if abs(val) < 0.01:
        return f"{val:.1e}"
    if abs(val) > 1000:
        return f"{val:.1f}"
    return f"{val:.2f}"


def _build_gradient_equations(center):
    """Build the BPTT gradient equations.

    Returns (eq_group, wh_term) where wh_term is the (W_h)^{t-i} part for highlighting.
    """
    line1 = Tex(
        r"G_{t,i} = \frac{\partial h_t}{\partial h_{t-1}} \times "
        r"\frac{\partial h_{t-1}}{\partial h_{t-2}} \times \cdots \times "
        r"\frac{\partial h_{i+1}}{\partial h_i}",
        font_size=28,
    )

    line2_prefix = Tex(r"=", font_size=28)
    line2_wh = Tex(r"(W_h)^{t-i}", font_size=28, color=YELLOW)
    line2_prod = Tex(r"\prod_{j=i+1}^{t} D_j", font_size=28)

    line2 = VGroup(line2_prefix, line2_wh, line2_prod)
    line2.arrange(RIGHT, buff=0.2)
    line2.next_to(line1, DOWN, buff=0.4, aligned_edge=LEFT)
    line2.shift(RIGHT * 0.8)

    eq_group = VGroup(line1, line2)
    eq_group.move_to(center)

    return eq_group, line1, line2_wh


def _build_symbol_defs(center):
    """Build the symbol definitions panel."""
    sym_g = Tex(
        r"G_{t,i}", r"\text{ = product of gradients from t to i}",
        font_size=18, color=GREY_A,
    )
    sym_wh = Tex(
        r"W_h", r"\text{ = weight matrix for hidden states}",
        font_size=18, color=GREY_A,
    )
    sym_d = Tex(
        r"D_j", r"\text{ = diag. matrix of } \tanh' \text{ derivative}",
        font_size=18, color=GREY_A,
    )

    panel = VGroup(sym_g, sym_wh, sym_d)
    panel.arrange(DOWN, buff=0.3, aligned_edge=LEFT)
    panel.move_to(center)
    return panel


def _run_power_demo(scene, base, steps, demo_center, is_vanishing, saved_light=None):
    """Run the progressive power demonstration.

    Shows (base)^{t-i} with increasing exponents and computed results.
    Pulses light red on the final step, restores after.
    """
    # Initial display: (base)^{t-i}
    base_str = str(base)
    power_tex = Tex(
        rf"({base_str})^{{t-i}}",
        font_size=32,
    )
    power_tex.move_to(demo_center)
    scene.play(FadeIn(power_tex, shift=UP * 0.2), run_time=0.6)
    scene.wait()

    # Step through each exponent value
    result_tex = None
    for i, (exp, van_val, exp_val) in enumerate(steps):
        val = van_val if is_vanishing else exp_val
        is_last = i == len(steps) - 1

        # New power with specific exponent
        new_power = Tex(
            rf"({base_str})^{{{exp}}}",
            font_size=32,
        )
        if is_last:
            new_power.set_color(RED)
        new_power.move_to(demo_center)

        # Result value
        new_result = Tex(
            rf"= {_fmt(val)}",
            font_size=32,
        )
        if is_last:
            new_result.set_color(RED)
        new_result.next_to(new_power, RIGHT, buff=0.3)

        # Pulse light red on final step
        if is_last:
            fire_light_change(RED, transition_ds=6)

        if result_tex is None:
            scene.play(
                FadeOut(power_tex),
                FadeIn(new_power),
                FadeIn(new_result),
                run_time=0.5,
            )
        else:
            scene.play(
                FadeOut(power_tex),
                FadeOut(result_tex),
                FadeIn(new_power),
                FadeIn(new_result),
                run_time=0.5,
            )

        power_tex = new_power
        result_tex = new_result
        scene.wait()

    return VGroup(power_tex, result_tex)


def slide_vanishing_exploding(scene: Scene):
    # Reset frame
    scene.frame.move_to(ORIGIN)
    scene.frame.set_height(8)

    # ── Part 1: BPTT equation ───────────────────────────────────────────────
    title = Text("Backpropagation Through Time", font_size=42, weight=BOLD)
    title.to_edge(UP, buff=0.5)

    eq_group, eq_line1, wh_term = _build_gradient_equations(
        np.array([-2.0, 0.3, 0])
    )
    sym_panel = _build_symbol_defs(np.array([4.5, 0.3, 0]))

    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(eq_group, shift=UP * 0.2), run_time=0.8)
    scene.play(FadeIn(sym_panel, shift=LEFT * 0.3), run_time=0.6)

    # >>> WAIT: presenter explains BPTT equation <<<
    scene.wait()

    # ── Part 2: Vanishing gradient ──────────────────────────────────────────

    # Save state for later restore
    eq_group.save_state()
    sym_panel.save_state()

    # Change title
    vanish_title = Text("Vanishing Gradient Problem", font_size=42, weight=BOLD, color=BLUE)
    vanish_title.to_edge(UP, buff=0.5)
    scene.play(ReplacementTransform(title, vanish_title), run_time=0.6)

    # Dim equation except W_h^{t-i} term
    scene.play(
        eq_line1.animate.set_opacity(_DIM),
        # Keep wh_term bright, dim the rest of line2
        *[
            m.animate.set_opacity(_DIM)
            for m in eq_group[1]  # line2 group
            if m is not wh_term
        ],
        run_time=0.6,
    )
    scene.wait()

    # Power demo below the equation
    demo_center = eq_group.get_center() + DOWN * 2.0
    saved_light = get_light_state_by_name()
    vanish_demo = _run_power_demo(scene, 0.9, _STEPS, demo_center, is_vanishing=True)

    # >>> WAIT: presenter discusses vanishing gradient <<<
    scene.wait()

    # Restore light after vanishing demo
    fire_light_restore(saved_light, transition_ds=6)

    # ── Part 3: Exploding gradient ──────────────────────────────────────────

    # Clean up vanishing demo, restore equation
    scene.play(FadeOut(vanish_demo), run_time=0.4)
    scene.play(
        Restore(eq_group),
        Restore(sym_panel),
        run_time=0.5,
    )

    # Save state again for exploding
    eq_group.save_state()
    sym_panel.save_state()

    # Change title
    explode_title = Text("Exploding Gradient Problem", font_size=42, weight=BOLD, color=RED)
    explode_title.to_edge(UP, buff=0.5)
    scene.play(ReplacementTransform(vanish_title, explode_title), run_time=0.6)

    # Dim equation except W_h^{t-i} term (same pattern)
    scene.play(
        eq_line1.animate.set_opacity(_DIM),
        *[
            m.animate.set_opacity(_DIM)
            for m in eq_group[1]
            if m is not wh_term
        ],
        run_time=0.6,
    )
    scene.wait()

    # Power demo
    saved_light = get_light_state_by_name()
    explode_demo = _run_power_demo(scene, 1.1, _STEPS, demo_center, is_vanishing=False)

    # >>> WAIT: presenter discusses exploding gradient <<<
    scene.wait()

    # Restore light after exploding demo
    fire_light_restore(saved_light, transition_ds=6)
