from manimlib import *


def _right_arrow(opacity=0.6):
    return Arrow(
        LEFT * 0.5, RIGHT * 0.5,
        thickness=1.0, fill_color=WHITE, fill_opacity=opacity,
        stroke_width=0, buff=0, max_tip_length_to_length_ratio=0.15,
    )


def _build_vector_row(word, value, y_pos, is_dots=False):
    """Build one row of the column vector display: word label + [value]."""
    if is_dots:
        word_label = Tex(r"\vdots", font_size=24, color=GREY_A)
        entry = Tex(r"\vdots", font_size=24, color=GREY_A)
    else:
        word_label = Text(f'"{word}"', font_size=22, color=GREY_A)
        if value == 1:
            entry = Text("[ 1 ]", font_size=22, color=GREEN)
        else:
            entry = Text("[ 0 ]", font_size=22)

    word_label.move_to(np.array([-2.0, y_pos, 0]))
    entry.move_to(np.array([0.5, y_pos, 0]))

    row = VGroup(word_label, entry)

    if not is_dots and value == 1:
        arrow_label = Text("← this word", font_size=18, color=GREEN)
        arrow_label.next_to(entry, RIGHT, buff=0.3)
        row.add(arrow_label)

    return row


def _build_mapping_row(word, ones_index, total=5, word_color=GREY_A):
    """Build a horizontal mapping: 'word' → [0, 1, 0, 0, 0, …]."""
    word_text = Text(f'"{word}"', font_size=22, color=word_color)

    entries = []
    for i in range(total):
        entries.append("1" if i == ones_index else "0")
    vec_str = "[" + ", ".join(entries) + ", ...]"
    vec = Text(vec_str, font_size=20)

    arrow = _right_arrow(0.5)
    row = VGroup(word_text, arrow, vec).arrange(RIGHT, buff=0.3)
    return row


# --- Main slide ---

def slide_tokenization(scene: Scene):
    scene.frame.to_default_state()

    # ====== PART 1: One-hot vector display ======
    title = Text("One-Hot Encoding", font_size=48, weight=BOLD)
    title.move_to(UP * 3.2)

    # "cat" label on the left with arrow pointing to vector
    cat_label = Text('"cat"', font_size=28)
    cat_label.set_color(YELLOW)
    cat_label.move_to(LEFT * 4.0)
    cat_arrow = _right_arrow(0.6)
    cat_arrow.next_to(cat_label, RIGHT, buff=0.3)

    # Column vector entries (values + vocab labels on right)
    values = [0, 0, 1, 0, None, 0]  # None = dots
    words = ["the", "happy", "cat", "dog", None, "house"]
    y_positions = [1.5, 0.9, 0.3, -0.3, -0.9, -1.5]
    vec_x = 0.0  # center x of the values column

    entries_group = VGroup()
    vocab_group = VGroup()

    for val, word, y in zip(values, words, y_positions):
        if val is None:
            entry = Tex(r"\vdots", font_size=24, color=GREY_A)
            entry.move_to(np.array([vec_x, y, 0]))
            entries_group.add(entry)
            word_dots = Tex(r"\vdots", font_size=24, color=GREY_A)
            word_dots.move_to(np.array([vec_x + 1.8, y, 0]))
            vocab_group.add(word_dots)
        else:
            if val == 1:
                entry = Text("1", font_size=22)
                entry.set_color(YELLOW)
            else:
                entry = Text("0", font_size=22)
            entry.move_to(np.array([vec_x, y, 0]))
            entries_group.add(entry)
            wlabel = Text(f'"{word}"', font_size=18)
            wlabel.set_color(YELLOW if val == 1 else GREY_A)
            wlabel.move_to(np.array([vec_x + 1.8, y, 0]))
            vocab_group.add(wlabel)

    # Tall bracket lines around the entries
    bracket_top = y_positions[0] + 0.3
    bracket_bot = y_positions[-1] - 0.3
    bracket_x = vec_x - 0.4
    bracket_r = vec_x + 0.4

    left_bracket = VGroup(
        Line(np.array([bracket_x, bracket_top, 0]), np.array([bracket_x, bracket_bot, 0]),
             stroke_width=2, stroke_color=WHITE),
        Line(np.array([bracket_x, bracket_top, 0]), np.array([bracket_x + 0.12, bracket_top, 0]),
             stroke_width=2, stroke_color=WHITE),
        Line(np.array([bracket_x, bracket_bot, 0]), np.array([bracket_x + 0.12, bracket_bot, 0]),
             stroke_width=2, stroke_color=WHITE),
    )
    right_bracket = VGroup(
        Line(np.array([bracket_r, bracket_top, 0]), np.array([bracket_r, bracket_bot, 0]),
             stroke_width=2, stroke_color=WHITE),
        Line(np.array([bracket_r, bracket_top, 0]), np.array([bracket_r - 0.12, bracket_top, 0]),
             stroke_width=2, stroke_color=WHITE),
        Line(np.array([bracket_r, bracket_bot, 0]), np.array([bracket_r - 0.12, bracket_bot, 0]),
             stroke_width=2, stroke_color=WHITE),
    )


    # Position cat + arrow vertically centered on the "1" entry
    cat_group = VGroup(cat_label, cat_arrow)
    cat_group.move_to(np.array([-3.0, 0.3, 0]))

    vector_display = VGroup(
        cat_group, entries_group, left_bracket, right_bracket,
        vocab_group,
    )

    # x_v label
    x_label = Tex(r"\mathbf{x} \in \mathbb{R}^V", font_size=28)
    x_label.move_to(DOWN * 2.2)

    x_desc = Text(
        "where V is the number of unique words\nin the training corpora",
        font_size=18, color=GREY_A, alignment="CENTER",
    )
    x_desc.move_to(DOWN * 2.9)

    part1 = VGroup(title, vector_display, x_label, x_desc)

    # Animate part 1
    scene.play(Write(title), run_time=0.8)
    scene.play(FadeIn(vector_display), run_time=1.0)
    scene.play(FadeIn(x_label), FadeIn(x_desc), run_time=0.6)
    scene.wait()

    # ====== PART 2: Word-to-vector mappings + OOV ======
    scene.play(FadeOut(part1), run_time=0.5)

    title2 = Text("One-Hot Encoding", font_size=48, weight=BOLD)
    title2.move_to(UP * 3.2)

    # Normal mappings
    row_the = _build_mapping_row("the", ones_index=1)
    row_happy = _build_mapping_row("happy", ones_index=3)
    row_cat = _build_mapping_row("cat", ones_index=2)

    normal_rows = VGroup(row_the, row_happy, row_cat)
    normal_rows.arrange(DOWN, buff=0.5)
    normal_rows.move_to(UP * 1.2)

    # OOV label
    oov_label = VGroup(
        Text("OOV", font_size=28, weight=BOLD, color=RED),
        Text("— Out of Vocabulary", font_size=24, color=RED_B),
    ).arrange(RIGHT, buff=0.2)
    oov_label.move_to(DOWN * 0.3)

    # OOV mapping: "vibe"
    row_vibe = _build_mapping_row("vibe", ones_index=0, word_color=RED)
    row_vibe.move_to(DOWN * 1.2)

    # OOV mapping: "selfie" (the reveal — same vector!)
    row_selfie = _build_mapping_row("selfie", ones_index=0, word_color=RED)
    row_selfie.move_to(DOWN * 2.0)

    # "Same vector!" annotation
    both_vecs = VGroup(row_vibe[2], row_selfie[2])  # the vector parts
    highlight_rect = SurroundingRectangle(
        VGroup(row_vibe, row_selfie),
        color=RED, buff=0.15, stroke_width=2,
    )
    same_label = Text("Same vector!", font_size=22, color=RED, weight=BOLD)
    same_label.next_to(highlight_rect, RIGHT, buff=0.3)
    same_group = VGroup(highlight_rect, same_label)

    part2 = VGroup(title2, normal_rows, oov_label, row_vibe, row_selfie, same_group)

    # Animate part 2
    scene.play(Write(title2), run_time=0.5)
    scene.play(FadeIn(normal_rows), run_time=0.8)
    scene.play(FadeIn(oov_label), run_time=0.5)
    scene.play(FadeIn(row_vibe), run_time=0.6)
    scene.play(FadeIn(row_selfie), run_time=0.6)
    scene.play(FadeIn(same_group), run_time=0.5)
    scene.wait()

    # ====== PART 3: Disadvantages ======
    scene.play(FadeOut(part2), run_time=0.5)

    title3 = Text("Disadvantages", font_size=48, weight=BOLD, color=RED)
    title3.move_to(UP * 2.5)

    b1 = Text(
        "•  Very sparse vectors — the size of your vocabulary\n"
        "   is directly proportional to the number of words\n"
        "   in your training corpora",
        font_size=28, color=GREY_A,
    )
    b2 = Text(
        "•  Out of Vocabulary words are all handled\n"
        "   the same way",
        font_size=28, color=GREY_A,
    )
    bullets = VGroup(b1, b2).arrange(DOWN, aligned_edge=LEFT, buff=0.5)
    bullets.move_to(ORIGIN + DOWN * 0.3)

    part3 = VGroup(title3, bullets)

    scene.play(Write(title3), run_time=0.6)
    scene.play(FadeIn(bullets), run_time=0.8)
    scene.wait()
