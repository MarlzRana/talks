from manimlib import *

# ── Word vectors (hand-crafted for visual clarity) ──────────────────────────

WORD_VECTORS = {
    "king": np.array([2.0, 1.5, 1.0]),
    "queen": np.array([1.4, 2.0, 0.3]),
    "happy": np.array([-1.0, 2.0, 0.5]),
    "joyful": np.array([-0.8, 2.1, 0.3]),
    "hot": np.array([1.5, -0.5, 1.5]),
    "cold": np.array([-1.5, 0.5, -1.5]),
}

WORD_COLORS = {
    "king": BLUE,
    "queen": BLUE_B,
    "happy": GREEN,
    "joyful": GREEN_B,
    "hot": RED,
    "cold": TEAL,
}

PAIRS = [("king", "queen"), ("happy", "joyful"), ("hot", "cold")]

# Camera presets
_3D_THETA, _3D_PHI = 30, 70
_2D_THETA, _2D_PHI = 0, 0  # top-down view looking at xy plane


# ── Helpers ─────────────────────────────────────────────────────────────────


def _cosine_similarity(v1, v2):
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))


def _make_labeled_arrow(word, vec, color):
    arrow = Arrow(
        ORIGIN,
        vec,
        fill_color=color,
        thickness=2.5,
        buff=0,
        max_tip_length_to_length_ratio=0.15,
    )
    label = Text(word, font_size=22, color=color)
    tip = vec / np.linalg.norm(vec) * (np.linalg.norm(vec) + 0.25)
    label.move_to(tip)
    return arrow, label


def _angle_arc_3d(v1, v2, radius=0.5, color=YELLOW):
    v1_n = v1 / np.linalg.norm(v1)
    v2_n = v2 / np.linalg.norm(v2)
    omega = np.arccos(np.clip(np.dot(v1_n, v2_n), -1, 1))

    # For near-180° vectors, slerp breaks (sin(omega)≈0).
    # Use a perpendicular midpoint to define a two-segment arc instead.
    if omega > np.pi - 0.01:
        # Find a perpendicular vector in the plane
        perp = np.cross(v1_n, np.array([0, 0, 1]))
        if np.linalg.norm(perp) < 0.01:
            perp = np.cross(v1_n, np.array([0, 1, 0]))
        perp = perp / np.linalg.norm(perp)

        # Arc: v1_n → perp → v2_n (two half-slerps via the perpendicular)
        def arc_func(t):
            if t < 0.5:
                # First half: v1_n → perp
                s = t * 2
                half_omega = np.pi / 2
                return (
                    np.sin((1 - s) * half_omega) / np.sin(half_omega) * v1_n
                    + np.sin(s * half_omega) / np.sin(half_omega) * perp
                ) * radius
            else:
                # Second half: perp → v2_n
                s = (t - 0.5) * 2
                half_omega = np.pi / 2
                return (
                    np.sin((1 - s) * half_omega) / np.sin(half_omega) * perp
                    + np.sin(s * half_omega) / np.sin(half_omega) * v2_n
                ) * radius
    else:
        def arc_func(t):
            if omega < 1e-6:
                return v1_n * radius
            return (
                np.sin((1 - t) * omega) / np.sin(omega) * v1_n
                + np.sin(t * omega) / np.sin(omega) * v2_n
            ) * radius

    return ParametricCurve(
        arc_func,
        t_range=(0, 1, 0.02),
        stroke_color=color,
        stroke_width=3,
    )


def _theta_label_pos(v1, v2, radius=1.1):
    """Position for a θ label between two vectors."""
    v1_n = v1 / np.linalg.norm(v1)
    v2_n = v2 / np.linalg.norm(v2)
    mid = v1_n + v2_n
    if np.linalg.norm(mid) < 0.1:
        # Near-180° — use perpendicular
        perp = np.cross(v1, np.array([0, 0, 1]))
        if np.linalg.norm(perp) < 0.01:
            perp = np.cross(v1, np.array([0, 1, 0]))
        return perp / np.linalg.norm(perp) * radius
    return mid / np.linalg.norm(mid) * radius


# ── Slide function ──────────────────────────────────────────────────────────


def slide_embeddings(scene: Scene):
    frame = scene.frame

    # ────────────────────────────────────────────────────────────────────────
    # PART 1: 3D exploration of word vectors
    # ────────────────────────────────────────────────────────────────────────
    frame.reorient(_3D_THETA, _3D_PHI)
    frame.set_height(8)

    axes = ThreeDAxes(
        x_range=(-3, 3, 1),
        y_range=(-3, 3, 1),
        z_range=(-2, 2, 1),
    )
    scene.play(ShowCreation(axes), run_time=1.0)

    # Animate word vectors pair by pair
    arrows = {}
    labels = {}

    for w1, w2 in PAIRS:
        for word in (w1, w2):
            a, l = _make_labeled_arrow(word, WORD_VECTORS[word], WORD_COLORS[word])
            arrows[word] = a
            labels[word] = l

        scene.play(
            GrowArrow(arrows[w1]),
            FadeIn(labels[w1]),
            GrowArrow(arrows[w2]),
            FadeIn(labels[w2]),
            run_time=0.6,
        )

    # >>> WAIT: user explores 3D space with d+mouse <<<
    scene.wait()

    # ────────────────────────────────────────────────────────────────────────
    # PART 2: Cosine similarity
    # Reset to 2D top-down view, then shift left for equation panel
    # ────────────────────────────────────────────────────────────────────────

    # Flatten to 2D top-down view
    scene.play(
        frame.animate.reorient(_2D_THETA, _2D_PHI).move_to(ORIGIN),
        run_time=1.0,
    )

    # Shift view left + dim all + highlight king-queen
    scene.play(
        frame.animate.shift(RIGHT * 3),
        *[arrows[w].animate.set_opacity(0.2) for w in WORD_VECTORS],
        *[labels[w].animate.set_opacity(0.2) for w in WORD_VECTORS],
        arrows["king"].animate.set_opacity(1.0),
        arrows["queen"].animate.set_opacity(1.0),
        labels["king"].animate.set_opacity(1.0),
        labels["queen"].animate.set_opacity(1.0),
        run_time=0.8,
    )

    # Show equation panel on right (fixed in frame)
    eq_title = Text("Cosine Similarity", font_size=28, weight=BOLD)
    eq_formula = Tex(
        r"\cos(\theta) = \frac{\vec{A} \cdot \vec{B}}{||\vec{A}|| \; ||\vec{B}||}",
        font_size=36,
    )
    eq_panel = VGroup(eq_title, eq_formula)
    eq_panel.arrange(DOWN, buff=0.5)
    eq_panel.to_edge(RIGHT, buff=0.8).shift(UP * 1.0)
    eq_panel.fix_in_frame()

    scene.play(FadeIn(eq_panel, shift=LEFT * 0.3), run_time=0.8)

    # >>> WAIT: presenter explains cosine similarity formula <<<
    scene.wait()

    # Draw angle arc between king and queen
    kq_arc = _angle_arc_3d(WORD_VECTORS["king"], WORD_VECTORS["queen"], radius=0.8)
    theta_label = Tex(r"\theta", font_size=32, color=YELLOW)
    theta_label.move_to(_theta_label_pos(WORD_VECTORS["king"], WORD_VECTORS["queen"]))

    scene.play(ShowCreation(kq_arc), FadeIn(theta_label), run_time=0.8)

    # >>> WAIT: presenter explains the angle <<<
    scene.wait()

    # Show computed cosine similarity result
    kq_sim = _cosine_similarity(WORD_VECTORS["king"], WORD_VECTORS["queen"])
    eq_result = Tex(
        rf"\cos(\theta) \approx {kq_sim:.2f}",
        font_size=36,
        color=GREEN,
    )
    eq_result.next_to(eq_formula, DOWN, buff=0.5)
    eq_result.fix_in_frame()

    scene.play(FadeIn(eq_result, shift=UP * 0.2), run_time=0.6)

    # >>> WAIT: presenter discusses high similarity <<<
    scene.wait()

    # Swap focus to hot-cold (dissimilar)
    hc_arc = _angle_arc_3d(
        WORD_VECTORS["hot"], WORD_VECTORS["cold"], radius=0.6, color=ORANGE
    )
    theta_label_2 = Tex(r"\theta", font_size=32, color=ORANGE)
    theta_label_2.move_to(_theta_label_pos(WORD_VECTORS["hot"], WORD_VECTORS["cold"]))

    scene.play(
        # Dim king-queen
        arrows["king"].animate.set_opacity(0.2),
        arrows["queen"].animate.set_opacity(0.2),
        labels["king"].animate.set_opacity(0.2),
        labels["queen"].animate.set_opacity(0.2),
        FadeOut(kq_arc),
        FadeOut(theta_label),
        # Brighten hot-cold
        arrows["hot"].animate.set_opacity(1.0),
        arrows["cold"].animate.set_opacity(1.0),
        labels["hot"].animate.set_opacity(1.0),
        labels["cold"].animate.set_opacity(1.0),
        run_time=0.6,
    )

    # >>> WAIT: presenter discusses dissimilar vectors <<<
    scene.wait()

    # Show angle arc and update cosine result
    hc_sim = _cosine_similarity(WORD_VECTORS["hot"], WORD_VECTORS["cold"])
    eq_result_new = Tex(
        rf"\cos(\theta) \approx {hc_sim:.2f}",
        font_size=36,
        color=RED,
    )
    eq_result_new.move_to(eq_result)
    eq_result_new.fix_in_frame()

    scene.play(
        ShowCreation(hc_arc),
        FadeIn(theta_label_2),
        ReplacementTransform(eq_result, eq_result_new),
        run_time=0.8,
    )

    # >>> WAIT: presenter discusses negative cosine similarity <<<
    scene.wait()

    # ────────────────────────────────────────────────────────────────────────
    # PART 3: Why length doesn't matter
    # Clear, reset to 3D, show vectors, then flatten to 2D + normalize
    # ────────────────────────────────────────────────────────────────────────

    # Clean up everything except axes
    all_mob = [
        *arrows.values(),
        *labels.values(),
        hc_arc,
        theta_label_2,
        eq_panel,
        eq_result_new,
    ]
    scene.play(*[FadeOut(m) for m in all_mob], run_time=0.6)

    # Reset to 3D centered view
    scene.play(
        frame.animate.reorient(_3D_THETA, _3D_PHI).move_to(ORIGIN),
        run_time=0.8,
    )

    # Two vectors, same direction, different lengths
    v_short = np.array([0.8, 0.6, 0.4])
    v_long = np.array([2.4, 1.8, 1.2])

    short_arrow = Arrow(ORIGIN, v_short, fill_color=BLUE, thickness=2.5, buff=0)
    long_arrow = Arrow(ORIGIN, v_long, fill_color=YELLOW, thickness=2.5, buff=0)
    short_label = Text("short", font_size=20, color=BLUE)
    short_label.move_to(
        v_short / np.linalg.norm(v_short) * (np.linalg.norm(v_short) + 0.3)
    )
    long_label = Text("long", font_size=20, color=YELLOW)
    long_label.move_to(
        v_long / np.linalg.norm(v_long) * (np.linalg.norm(v_long) + 0.3)
    )

    scene.play(
        GrowArrow(short_arrow),
        FadeIn(short_label),
        GrowArrow(long_arrow),
        FadeIn(long_label),
        run_time=0.8,
    )

    # >>> WAIT: user explores short/long vectors in 3D <<<
    scene.wait()

    # Flatten to 2D top-down + shift left for panel
    scene.play(
        frame.animate.reorient(_2D_THETA, _2D_PHI).move_to(ORIGIN).shift(RIGHT * 3),
        run_time=1.0,
    )

    # Context panel on right
    short_text = Text('"A scary movie"', font_size=20, color=BLUE)
    short_vec_text = Tex(r"[0.80,\ 0.60,\ 0.40]", font_size=24, color=BLUE_B)
    short_group = VGroup(short_text, short_vec_text).arrange(DOWN, buff=0.15)

    long_text = Text(
        '"A terrifying horror film with\njump scares and supernatural\nelements that kept me on the\nedge of my seat"',
        font_size=16,
        color=YELLOW,
    )
    long_vec_text = Tex(r"[2.40,\ 1.80,\ 1.20]", font_size=24, color=YELLOW_B)
    long_group = VGroup(long_text, long_vec_text).arrange(DOWN, buff=0.15)

    context_panel = VGroup(short_group, long_group)
    context_panel.arrange(DOWN, buff=0.6)
    context_panel.to_edge(RIGHT, buff=0.5)
    context_panel.fix_in_frame()

    scene.play(FadeIn(context_panel, shift=LEFT * 0.3), run_time=0.8)

    # >>> WAIT: presenter explains same direction, different lengths <<<
    scene.wait()

    # Normalize both vectors
    v_short_n = v_short / np.linalg.norm(v_short)
    v_long_n = v_long / np.linalg.norm(v_long)

    norm_formula = Tex(
        r"\hat{v} = \frac{v}{||v||}",
        font_size=36,
        color=WHITE,
    )
    norm_formula.next_to(context_panel, UP, buff=0.5)
    norm_formula.fix_in_frame()

    # Updated normalized vector texts
    short_vec_new = Tex(r"[0.74,\ 0.56,\ 0.37]", font_size=24, color=GREEN)
    short_vec_new.move_to(short_vec_text)
    short_vec_new.fix_in_frame()

    long_vec_new = Tex(r"[0.74,\ 0.56,\ 0.37]", font_size=24, color=GREEN)
    long_vec_new.move_to(long_vec_text)
    long_vec_new.fix_in_frame()

    scene.play(
        FadeIn(norm_formula),
        # Animate arrows to unit length
        short_arrow.animate.put_start_and_end_on(ORIGIN, v_short_n),
        long_arrow.animate.put_start_and_end_on(ORIGIN, v_long_n),
        # Move labels to new positions
        short_label.animate.move_to(
            v_short_n / np.linalg.norm(v_short_n) * (np.linalg.norm(v_short_n) + 0.3)
        ),
        long_label.animate.move_to(
            v_long_n / np.linalg.norm(v_long_n) * (np.linalg.norm(v_long_n) + 0.3)
        ),
        # Update numerical values
        ReplacementTransform(short_vec_text, short_vec_new),
        ReplacementTransform(long_vec_text, long_vec_new),
        run_time=1.0,
    )

    # >>> WAIT: presenter highlights identical normalized vectors <<<
    scene.wait()
