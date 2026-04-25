from manimlib import *

from talks.shared_components.word2vec_diagrams import build_cbow, build_skipgram
from utils.hue.bridge import fire_light_change, fire_light_restore, get_light_state_by_name

# Layout constants
OVERVIEW_CENTER = np.array([0, 0, 0])
OVERVIEW_HEIGHT = 16.0
DETAIL_HEIGHT = 8.0

MODEL_POSITIONS = [
    np.array([-6, 0, 0]),  # CBOW
    np.array([6, 0, 0]),  # Skip-Gram
]

_SCALE = OVERVIEW_HEIGHT / DETAIL_HEIGHT  # 2.0

# Example sentence words
_SENTENCE = ["large", "scale", "singular", "value", "computation"]
_TARGET_IDX = 2  # "singular"
_CONTEXT_INDICES = [0, 1, 3, 4]  # "large", "scale", "value", "computation"


def _build_sentence_display(center, is_cbow=True):
    """Build an example sentence display with circled context/target words.

    Returns (group: VGroup, parts: dict) where parts has "context" and "target"
    VGroups for selective highlighting.
    """
    group = VGroup()

    # Single text line for the whole sentence
    sentence_str = 'Example: large scale singular value computation'
    sentence = Text(sentence_str, font_size=18, color=WHITE)
    sentence.move_to(center)

    # Find word submobjects for overlay positioning (need sentence positioned first)
    left_ctx = sentence.select_part("large scale")
    target_word = sentence.select_part("singular")
    right_ctx = sentence.select_part("value computation")

    # Rounded rectangle overlays — add BEFORE sentence so text renders on top
    left_oval = SurroundingRectangle(left_ctx, color=GREEN, buff=0.08)
    left_oval.round_corners(0.15)
    left_oval.set_stroke(width=2)
    left_oval.set_fill(opacity=0)
    group.add(left_oval)

    target_circle = SurroundingRectangle(target_word, color=RED, buff=0.08)
    target_circle.round_corners(0.15)
    target_circle.set_stroke(width=2)
    target_circle.set_fill(opacity=0)
    group.add(target_circle)

    right_oval = SurroundingRectangle(right_ctx, color=GREEN, buff=0.08)
    right_oval.round_corners(0.15)
    right_oval.set_stroke(width=2)
    right_oval.set_fill(opacity=0)
    group.add(right_oval)

    # Add sentence text AFTER ovals so it renders on top
    group.add(sentence)

    # Labels below
    ctx_label_l = Text("context\nwords", font_size=12, color=GREEN, alignment="CENTER")
    ctx_label_l.next_to(left_oval, DOWN, buff=0.1)
    group.add(ctx_label_l)

    target_label = Text("target\nword", font_size=12, color=RED, alignment="CENTER")
    target_label.next_to(target_circle, DOWN, buff=0.1)
    group.add(target_label)

    ctx_label_r = Text("context\nwords", font_size=12, color=GREEN, alignment="CENTER")
    ctx_label_r.next_to(right_oval, DOWN, buff=0.1)
    group.add(ctx_label_r)

    # Sub-groups for highlighting — separate ovals from labels so we can
    # handle them differently (ovals: stroke only, labels: full opacity)
    return group, {
        "context_ovals": VGroup(left_oval, right_oval),
        "context_labels": VGroup(ctx_label_l, ctx_label_r),
        "target_ovals": VGroup(target_circle),
        "target_labels": VGroup(target_label),
        "sentence": sentence,
    }


def _build_cbow_equations(center):
    """LaTeX equations for CBOW, positioned to the right of the model."""
    eq1_text = Tex(
        r"x_{j}",
        r"\text{ = BPE one-hot encoding for the}",
        font_size=20,
    )
    eq1_text2 = Tex(
        r"\text{j-th word in the context window}",
        font_size=20,
    )

    eq2 = Tex(
        r"e_i = \frac{1}{C} \sum_{\substack{j=1 \\ j \neq i}}^{C} x_{j} \cdot W_{V \times N}",
        font_size=24,
    )

    sym_c = Tex(r"C", r"\text{ = size of the context window}", font_size=18, color=GREY_A)
    sym_v = Tex(r"V", r"\text{ = size of the vocabulary from BPE learner}", font_size=18, color=GREY_A)
    sym_n = Tex(r"N", r"\text{ = desired size of the embedding}", font_size=18, color=GREY_A)

    panel = VGroup(eq1_text, eq1_text2, eq2, sym_c, sym_v, sym_n)
    panel.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
    panel.move_to(center)
    return panel


def _build_skipgram_equations(center):
    """LaTeX equations for Skip-Gram, positioned to the right of the model."""
    eq1_text = Tex(
        r"x_{i}",
        r"\text{ = BPE one-hot encoding for}",
        font_size=20,
    )
    eq1_text2 = Tex(
        r"\text{the target word}",
        font_size=20,
    )

    eq2 = Tex(
        r"e_i = x_i \cdot W_{V \times N}",
        font_size=24,
    )

    sym_c = Tex(r"C", r"\text{ = size of the context window}", font_size=18, color=GREY_A)
    sym_v = Tex(r"V", r"\text{ = size of the vocabulary from BPE learner}", font_size=18, color=GREY_A)
    sym_n = Tex(r"N", r"\text{ = desired size of the embedding}", font_size=18, color=GREY_A)

    panel = VGroup(eq1_text, eq1_text2, eq2, sym_c, sym_v, sym_n)
    panel.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
    panel.move_to(center)
    return panel


def _set_sentence_part(anims, sentence_parts, bright_keys):
    """Add animations for sentence sub-parts. Ovals use stroke_opacity only, labels use opacity."""
    # Map highlight keys to sentence part prefixes
    key_map = {"context": "context", "target": "target"}

    bright_prefixes = {key_map[k] for k in bright_keys if k in key_map}

    for part_key, grp in sentence_parts.items():
        if part_key == "sentence":
            # Always keep sentence text fully visible
            continue

        prefix = part_key.split("_")[0]  # "context" or "target"
        is_bright = prefix in bright_prefixes

        if part_key.endswith("_ovals"):
            # Ovals: only change stroke opacity, NEVER fill
            for oval in grp:
                if is_bright:
                    anims.append(oval.animate.set_stroke(opacity=1.0))
                else:
                    anims.append(oval.animate.set_stroke(opacity=0.15))
        elif part_key.endswith("_labels"):
            if is_bright:
                anims.append(grp.animate.set_opacity(1.0))
            else:
                anims.append(grp.animate.set_opacity(0.15))


def _highlight(scene, bright_keys, diagram_groups, sentence_parts, eq_panel, light_color=None):
    """Highlight specific groups, dim everything else. Optionally pulse the Hue light."""
    if light_color:
        fire_light_change(light_color, transition_ds=6)
    anims = []
    for key, grp in diagram_groups.items():
        if key in bright_keys:
            anims.append(grp.animate.set_opacity(1.0))
        else:
            anims.append(grp.animate.set_opacity(0.15))

    _set_sentence_part(anims, sentence_parts, bright_keys)

    # Keep equations always visible so audience can reference symbols

    scene.play(*anims, run_time=0.6)


def _save_state(diagram_groups, sentence_parts, eq_panel):
    """Save state of all groups before highlighting."""
    for grp in diagram_groups.values():
        grp.save_state()
    for part_key, grp in sentence_parts.items():
        if part_key == "sentence":
            continue
        grp.save_state()
    eq_panel.save_state()


def _restore_all(scene, diagram_groups, sentence_parts, eq_panel, saved_light_state=None):
    """Restore all groups to their saved state. Optionally restore light."""
    if saved_light_state:
        fire_light_restore(saved_light_state, transition_ds=6)
    anims = []
    for grp in diagram_groups.values():
        anims.append(Restore(grp))
    for part_key, grp in sentence_parts.items():
        if part_key == "sentence":
            continue
        anims.append(Restore(grp))
    anims.append(Restore(eq_panel))
    scene.play(*anims, run_time=0.6)


def slide_word2vec(scene: Scene):
    # Set frame to overview
    scene.frame.move_to(OVERVIEW_CENTER)
    scene.frame.set_height(OVERVIEW_HEIGHT)

    # Title
    title = Text("Word2Vec", font_size=72, weight=BOLD)
    title.move_to(np.array([0, 5.5, 0]))

    # Build both model diagrams
    cbow_diagram, cbow_label, cbow_groups = build_cbow(MODEL_POSITIONS[0])
    sg_diagram, sg_label, sg_groups = build_skipgram(MODEL_POSITIONS[1])

    # Shrink diagrams so they fit comfortably when zoomed in with equations beside them
    _DIAGRAM_SCALE = 0.7
    cbow_diagram.scale(_DIAGRAM_SCALE, about_point=MODEL_POSITIONS[0])
    sg_diagram.scale(_DIAGRAM_SCALE, about_point=MODEL_POSITIONS[1])

    # Scale labels for overview readability
    cbow_label.scale(_SCALE)
    sg_label.scale(_SCALE)

    # Animate overview
    scene.play(Write(title), run_time=0.8)
    scene.play(
        FadeIn(cbow_diagram, shift=UP * 0.3),
        FadeIn(cbow_label, shift=UP * 0.3),
        FadeIn(sg_diagram, shift=UP * 0.3),
        FadeIn(sg_label, shift=UP * 0.3),
        run_time=0.6,
    )

    # >>> WAIT: overview of both models <<<
    scene.wait()

    # ── Zoom into CBOW ──────────────────────────────────────────────────────
    _DIAGRAM_SHIFT = LEFT * 2.5
    scene.play(
        scene.frame.animate.move_to(MODEL_POSITIONS[0]).set_height(DETAIL_HEIGHT),
        cbow_diagram.animate.shift(_DIAGRAM_SHIFT),
        cbow_label.animate.scale(1 / _SCALE).shift(_DIAGRAM_SHIFT),
        run_time=1.2,
        rate_func=smooth,
    )

    # Equations in the right half of the view
    cbow_eq = _build_cbow_equations(MODEL_POSITIONS[0] + RIGHT * 4.5)

    # Example sentence at top
    cbow_sentence, cbow_sent_parts = _build_sentence_display(
        MODEL_POSITIONS[0] + UP * 3.0,
        is_cbow=True,
    )

    scene.play(
        FadeIn(cbow_eq, shift=LEFT * 0.3),
        FadeIn(cbow_sentence, shift=UP * 0.2),
        run_time=0.8,
    )

    # >>> WAIT: examine CBOW detail <<<
    scene.wait()

    # Save state before highlights so we can restore original appearance
    _save_state(cbow_groups, cbow_sent_parts, cbow_eq)
    saved_light = get_light_state_by_name()

    # CBOW highlights: input+context → embedding → output+target → restore
    _highlight(scene, ["input", "context"], cbow_groups, cbow_sent_parts, cbow_eq, light_color=GREEN)
    scene.wait()

    _highlight(scene, ["embedding"], cbow_groups, cbow_sent_parts, cbow_eq, light_color=BLUE)
    scene.wait()

    _highlight(scene, ["output", "target"], cbow_groups, cbow_sent_parts, cbow_eq, light_color=RED)
    scene.wait()

    _restore_all(scene, cbow_groups, cbow_sent_parts, cbow_eq, saved_light_state=saved_light)
    scene.wait()

    # Zoom back out
    scene.play(
        FadeOut(cbow_eq),
        FadeOut(cbow_sentence),
        run_time=0.4,
    )
    scene.play(
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        cbow_diagram.animate.shift(-_DIAGRAM_SHIFT),
        cbow_label.animate.scale(_SCALE).shift(-_DIAGRAM_SHIFT),
        run_time=1.2,
        rate_func=smooth,
    )

    # >>> WAIT: overview again <<<
    scene.wait()

    # ── Zoom into Skip-Gram ─────────────────────────────────────────────────
    scene.play(
        scene.frame.animate.move_to(MODEL_POSITIONS[1]).set_height(DETAIL_HEIGHT),
        sg_diagram.animate.shift(_DIAGRAM_SHIFT),
        sg_label.animate.scale(1 / _SCALE).shift(_DIAGRAM_SHIFT),
        run_time=1.2,
        rate_func=smooth,
    )

    # Equations in the right half of the view
    sg_eq = _build_skipgram_equations(MODEL_POSITIONS[1] + RIGHT * 4.5)

    # Example sentence at top
    sg_sentence, sg_sent_parts = _build_sentence_display(
        MODEL_POSITIONS[1] + UP * 3.0,
        is_cbow=False,
    )

    scene.play(
        FadeIn(sg_eq, shift=LEFT * 0.3),
        FadeIn(sg_sentence, shift=UP * 0.2),
        run_time=0.8,
    )

    # >>> WAIT: examine Skip-Gram detail <<<
    scene.wait()

    _save_state(sg_groups, sg_sent_parts, sg_eq)
    saved_light = get_light_state_by_name()

    # Skip-Gram highlights: input+target → embedding → output+context → restore
    _highlight(scene, ["input", "target"], sg_groups, sg_sent_parts, sg_eq, light_color=RED)
    scene.wait()

    _highlight(scene, ["embedding"], sg_groups, sg_sent_parts, sg_eq, light_color=BLUE)
    scene.wait()

    _highlight(scene, ["output", "context"], sg_groups, sg_sent_parts, sg_eq, light_color=GREEN)
    scene.wait()

    _restore_all(scene, sg_groups, sg_sent_parts, sg_eq, saved_light_state=saved_light)
    scene.wait()

    # Zoom back out
    scene.play(
        FadeOut(sg_eq),
        FadeOut(sg_sentence),
        run_time=0.4,
    )
    scene.play(
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        sg_diagram.animate.shift(-_DIAGRAM_SHIFT),
        sg_label.animate.scale(_SCALE).shift(-_DIAGRAM_SHIFT),
        run_time=1.2,
        rate_func=smooth,
    )

    # >>> WAIT: final overview <<<
    scene.wait()
