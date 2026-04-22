from manimlib import *

# Layout constants
OVERVIEW_CENTER = np.array([0, 0, 0])
OVERVIEW_HEIGHT = 16.0
DETAIL_HEIGHT = 8.0
CARD_POSITIONS = [np.array([-5, 0, 0]), np.array([5, 0, 0])]


def _make_card(name, subtitle_code, position, color):
    rect = RoundedRectangle(
        width=5.0, height=3.0, corner_radius=0.3,
        color=color, fill_opacity=0.05, stroke_width=2.0, stroke_opacity=0.5,
    )
    label = Text(name, font_size=40, weight=BOLD, alignment="CENTER")
    code_label = Text(subtitle_code, font_size=24, color=GREY_A, font="Consolas for Powerline")
    label.move_to(rect.get_center() + UP * 0.4)
    code_label.move_to(rect.get_center() + DOWN * 0.5)
    card = VGroup(rect, label, code_label)
    card.move_to(position)
    return card


# ====== TOKEN LEARNER CONTENT ======

def _build_learner_steps(center):
    c = center
    title = Text("Token Learner", font_size=26, weight=BOLD, color=BLUE)
    title.move_to(c + UP * 3.2)

    steps_text = [
        "1. Get an initial vocabulary of symbols:\n"
        "   {'A', 'B', 'C', ..., 'a', 'b', 'c', ...}",
        "2. Space-separate text into words, then separate\n"
        "   each word into symbols with a special _ end char:\n"
        "   e.g.  l o w _  ,  l o w e s t _",
        "3. Find the two most common adjacent symbols\n"
        "   S\u2081 S\u2082 in the training corpus",
        "4. Merge them in the vocabulary as a new\n"
        "   symbol (S\u2081S\u2082)",
        "5. Replace all instances of S\u2081 S\u2082 in the set\n"
        "   of words with a single S\u2081S\u2082",
        "6. Repeat the above K times\n"
        "   (where K is a hyperparameter)",
    ]

    bullets = VGroup()
    for t in steps_text:
        b = Text(t, font_size=20, color=GREY_A)
        bullets.add(b)
    bullets.arrange(DOWN, aligned_edge=LEFT, buff=0.25)
    bullets.move_to(c + DOWN * 0.3)

    return VGroup(title, bullets), title, bullets


def _build_learner_table_rows(center):
    """Build the 5 merge example rows. Returns list of VGroups (one per row) + header."""
    c = center
    header_merge = Text("Merge", font_size=20, weight=BOLD, color=WHITE)
    header_vocab = Text("Current Vocabulary", font_size=20, weight=BOLD, color=WHITE)
    header_merge.move_to(c + UP * 3.0 + LEFT * 2.0)
    header_vocab.move_to(c + UP * 3.0 + RIGHT * 1.0)
    header = VGroup(header_merge, header_vocab)

    # Separator line
    sep = Line(
        c + UP * 2.8 + LEFT * 3.5, c + UP * 2.8 + RIGHT * 3.5,
        stroke_width=1, stroke_color=GREY, stroke_opacity=0.5,
    )

    base_vocab = "_, d, e, i, l, n, o, r, s, t, w, er, er_,\nne, "
    rows_data = [
        ("(ne, w)", base_vocab + "new", "new"),
        ("(l, o)", base_vocab + "new, lo", "lo"),
        ("(lo, w)", base_vocab + "new, lo, low", "low"),
        ("(new, er_)", base_vocab + "new, lo, low,\nnewer_", "newer_"),
        ("(low, _)", base_vocab + "new, lo, low,\nnewer_, low_", "low_"),
    ]

    y_start = 2.4
    row_spacing = 1.1
    rows = []
    for i, (merge, vocab, new_entry) in enumerate(rows_data):
        y = y_start - i * row_spacing
        merge_text = Text(merge, font_size=18, color=YELLOW)
        merge_text.move_to(c + LEFT * 2.0 + UP * y)

        vocab_text = Text(vocab, font_size=14, color=GREY_A)
        vocab_text.move_to(c + RIGHT * 1.0 + UP * y)

        row = VGroup(merge_text, vocab_text)
        rows.append(row)

    return header, sep, rows


def _build_learner_code(center):
    c = center
    code_str = (
        'def bpe_learn(text: str, k: int) -> set[str]:\n'
        '    vocab: set[str] = get_unique_symbols(text)\n'
        '    words: list[str] = get_words(text, delimiter=" ")\n'
        '    symbol_words: list[list[str]] = get_symbols(\n'
        '        words, end_char="_"\n'
        '    )\n'
        '    # adds a special _ at the end of each\n'
        '    # set of symbols for a word\n'
        '\n'
        '    for _ in range(k):\n'
        '        most_freq_pair = get_most_frequent_symbol_pair(\n'
        '            symbol_words\n'
        '        )\n'
        '        vocab.add(\n'
        '            most_freq_pair[0] + most_freq_pair[1]\n'
        '        )\n'
        '        merge_symbol_instances(\n'
        '            symbol_words, most_freq_pair\n'
        '        )\n'
        '\n'
        '    return vocab'
    )
    code = Text(code_str, font_size=16, font="Consolas for Powerline", color=GREY_A)
    code.move_to(c)
    return code


# ====== TOKEN SEGMENTER CONTENT ======

def _build_segmenter_steps(center):
    c = center
    title = Text("Token Segmenter", font_size=26, weight=BOLD, color=GREEN)
    title.move_to(c + UP * 3.2)

    steps_text = [
        "1. Segment text into words using whitespace\n"
        "   as a delimiter",
        "2. Separate each word into symbols and add\n"
        "   a _ at the end of each word",
        "3. Greedily, starting from the first compound\n"
        "   symbol added to the vocabulary, merge the\n"
        "   symbols in the text until you have gone\n"
        "   through each compound symbol",
    ]

    bullets = VGroup()
    for t in steps_text:
        b = Text(t, font_size=20, color=GREY_A)
        bullets.add(b)
    bullets.arrange(DOWN, aligned_edge=LEFT, buff=0.3)
    bullets.move_to(c + DOWN * 0.2)

    return VGroup(title, bullets), title, bullets


def _build_segmenter_example(center):
    """Build a step-by-step tokenization example for 'lower'."""
    c = center
    ex_title = Text('Tokenize: "lower"', font_size=22, weight=BOLD, color=GREEN)
    ex_title.move_to(c + UP * 3.0)

    vocab_label = Text(
        "Vocabulary:  _, d, e, i, l, n, o, r, s, t, w, er, er_, ne, new, lo, low, newer_, low_",
        font_size=12, color=GREY_B,
    )
    vocab_label.move_to(c + UP * 2.4)

    # Vocab compound symbols (in learning order):
    # er, er_, ne, new, lo, low, newer_, low_
    steps = [
        ('Start:',        'l  o  w  e  r  _', None),
        ('Apply er:',     'l  o  w  er  _',   'merged e+r'),
        ('Apply er_:',    'l  o  w  er_',     'merged er+_'),
        ('Apply ne:',     'l  o  w  er_',     'no match'),
        ('Apply new:',    'l  o  w  er_',     'no match'),
        ('Apply lo:',     'lo  w  er_',       'merged l+o'),
        ('Apply low:',    'low  er_',         'merged lo+w'),
        ('Apply newer_:', 'low  er_',         'no match'),
        ('Apply low_:',   'low  er_',         'no match'),
    ]

    step_group = VGroup()
    for label, content, note in steps:
        label_t = Text(label, font_size=16, color=GREY_A)
        content_t = Text(content, font_size=16, color=WHITE)
        if note and "merged" in note:
            note_t = Text(note, font_size=14, color=GREEN)
        elif note:
            note_t = Text(note, font_size=14, color=RED_B)
        else:
            note_t = Text("", font_size=14)
        row = VGroup(label_t, content_t, note_t).arrange(RIGHT, buff=0.2)
        step_group.add(row)
    step_group.arrange(DOWN, aligned_edge=LEFT, buff=0.15)
    step_group.move_to(c + DOWN * 0.2)

    result = Text('Result:  ["low", "er_"]', font_size=18, color=YELLOW)
    result.next_to(step_group, DOWN, buff=0.35)

    return VGroup(ex_title, vocab_label, step_group, result)


def _build_segmenter_code(center):
    c = center
    code_str = (
        'def tokenize(\n'
        '    text: str, vocab: list[str], k: int\n'
        ') -> list[str]:\n'
        '    words: list[str] = get_words_vec(\n'
        '        text, delimiter=" "\n'
        '    )\n'
        '    symbol_words: list[list[str]] = set_symbols(\n'
        '        words, end_char="_"\n'
        '    )\n'
        '\n'
        '    for i in range(len(vocab) - k, len(vocab)):\n'
        '        merge(symbol_words, vocab[i])\n'
        '\n'
        '    return flatten(symbol_words)'
    )
    code = Text(code_str, font_size=18, font="Consolas for Powerline", color=GREY_A)
    code.move_to(c)
    return code


# ====== MAIN SLIDE ======

def slide_bpe_tokenizer(scene: Scene):
    scene.frame.to_default_state()

    # ====== SUB-SCENE 1: High-level overview ======
    title1 = Text("BPE Tokenizer", font_size=48, weight=BOLD)
    title1.move_to(UP * 2.5)

    b1 = Text(
        "•  They take a better approach to understanding\n"
        "   OOV (Out of Vocabulary) words",
        font_size=28, color=GREY_A,
    )
    b2 = Text(
        "•  Philosophy: if we haven't seen a word before,\n"
        "   split it up and at least try to understand\n"
        "   some subwords of it",
        font_size=28, color=GREY_A,
    )
    bullets1 = VGroup(b1, b2).arrange(DOWN, aligned_edge=LEFT, buff=0.5)
    bullets1.move_to(DOWN * 0.3)

    scene.play(Write(title1), run_time=0.8)
    scene.play(FadeIn(bullets1), run_time=0.8)
    scene.wait()

    # ====== SUB-SCENE 2: Two-tile overview ======
    sub1 = VGroup(title1, bullets1)
    scene.play(FadeOut(sub1), run_time=0.5)

    # Set frame for overview
    scene.play(
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        run_time=0.8,
    )

    overview_title = Text("BPE Tokenizer", font_size=48, weight=BOLD)
    overview_title.move_to(UP * 5.5)

    card1 = _make_card("Token Learner", "tokenizer.fit()", CARD_POSITIONS[0], BLUE)
    card2 = _make_card("Token Segmenter", "tokenizer.tokenize()", CARD_POSITIONS[1], GREEN)

    scene.play(Write(overview_title), run_time=0.5)
    scene.play(FadeIn(card1, shift=UP * 0.3), run_time=0.5)
    scene.play(FadeIn(card2, shift=UP * 0.3), run_time=0.5)
    scene.wait()

    # ====== ZOOM INTO TOKEN LEARNER ======
    scene.play(
        FadeOut(card1),
        scene.frame.animate.move_to(CARD_POSITIONS[0]).set_height(DETAIL_HEIGHT),
        run_time=1.0,
    )

    # Phase A: Steps
    learner_all, learner_title, learner_bullets = _build_learner_steps(CARD_POSITIONS[0])
    scene.play(FadeIn(learner_all), run_time=0.8)
    scene.wait()

    # Phase B: Table — shift steps right, show table on left
    table_center = CARD_POSITIONS[0] + LEFT * 0.5
    scene.play(
        learner_all.animate.scale(0.7).move_to(CARD_POSITIONS[0] + RIGHT * 3.5),
        run_time=0.8,
    )

    header, sep, rows = _build_learner_table_rows(CARD_POSITIONS[0] + LEFT * 3.0)
    scene.play(FadeIn(header), FadeIn(sep), run_time=0.4)

    for row in rows:
        scene.play(FadeIn(row, shift=UP * 0.2), run_time=0.4)
        scene.wait()

    # Phase C: Code replaces the steps (right side), table stays
    learner_code = _build_learner_code(CARD_POSITIONS[0] + RIGHT * 3.5)
    scene.play(FadeOut(learner_all), FadeIn(learner_code), run_time=0.6)
    scene.wait()

    # Zoom out
    table_group = VGroup(header, sep, *rows)
    scene.play(
        FadeOut(learner_code), FadeOut(table_group),
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        run_time=1.0,
    )
    scene.play(FadeIn(card1), run_time=0.3)
    scene.wait()

    # ====== ZOOM INTO TOKEN SEGMENTER ======
    scene.play(
        FadeOut(card2),
        scene.frame.animate.move_to(CARD_POSITIONS[1]).set_height(DETAIL_HEIGHT),
        run_time=1.0,
    )

    # Phase A: Steps
    seg_all, seg_title, seg_bullets = _build_segmenter_steps(CARD_POSITIONS[1])
    scene.play(FadeIn(seg_all), run_time=0.8)
    scene.wait()

    # Phase B: Example — shift steps right, show example on left
    scene.play(
        seg_all.animate.scale(0.7).move_to(CARD_POSITIONS[1] + RIGHT * 3.5),
        run_time=0.8,
    )

    seg_example = _build_segmenter_example(CARD_POSITIONS[1] + LEFT * 3.0)
    scene.play(FadeIn(seg_example), run_time=0.6)
    scene.wait()

    # Phase C: Code replaces steps, example stays
    seg_code = _build_segmenter_code(CARD_POSITIONS[1] + RIGHT * 3.5)
    scene.play(FadeOut(seg_all), FadeIn(seg_code), run_time=0.6)
    scene.wait()

    # Zoom out
    scene.play(
        FadeOut(seg_code), FadeOut(seg_example),
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        run_time=1.0,
    )
    scene.play(FadeIn(card2), run_time=0.3)
    scene.wait()
