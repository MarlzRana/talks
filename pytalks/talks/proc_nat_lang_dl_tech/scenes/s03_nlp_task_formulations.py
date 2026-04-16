from manimlib import *

# Layout constants
OVERVIEW_CENTER = np.array([0, 2, 0])
OVERVIEW_HEIGHT = 20.0
DETAIL_HEIGHT = 8.0

CARD_POSITIONS = [
    np.array([-5, 4, 0]),  # Linguistic Term Representation
    np.array([5, 4, 0]),  # Sequence Classification
    np.array([-5, -5, 0]),  # Sequence Labelling
    np.array([5, -5, 0]),  # Sequence-to-Sequence Learning
]

CARD_NAMES = [
    "Linguistic Term\nRepresentation",
    "Sequence\nClassification",
    "Sequence\nLabelling",
    "Sequence-to-Sequence\nLearning",
]

CARD_COLORS = [BLUE, GREEN, YELLOW, RED]


def _make_card(name, position, color):
    rect = RoundedRectangle(
        width=6.0,
        height=3.5,
        corner_radius=0.3,
        color=color,
        fill_opacity=0.05,
        stroke_width=2.0,
        stroke_opacity=0.5,
    )
    label = Text(name, font_size=48, weight=BOLD, alignment="CENTER")
    label.move_to(rect)
    card = VGroup(rect, label)
    card.move_to(position)
    return card


def _right_arrow(opacity=0.6):
    """A thin right-pointing arrow (direction survives .arrange())."""
    return Arrow(
        LEFT * 0.5,
        RIGHT * 0.5,
        thickness=1.0,
        fill_color=WHITE,
        fill_opacity=opacity,
        stroke_width=0,
        buff=0,
        max_tip_length_to_length_ratio=0.15,
    )


def _down_arrow(opacity=0.5):
    """A thin downward-pointing arrow."""
    return Arrow(
        UP * 0.3,
        DOWN * 0.3,
        thickness=1.0,
        fill_color=WHITE,
        fill_opacity=opacity,
        stroke_width=0,
        buff=0,
        max_tip_length_to_length_ratio=0.15,
    )


# --- Task 1: Linguistic Term Representation ---


def _build_task1_detail(center):
    c = center

    # Title
    title = Text(
        "Linguistic Term Representation", font_size=26, weight=BOLD, color=BLUE
    )
    title.move_to(c + UP * 3.2)

    # Graphic: "King" -> column vector
    word1 = Text("King", font_size=20, color=BLUE_B)
    vec1 = Tex(
        r"\begin{bmatrix} 0.2 \\ -0.5 \\ 0.8 \\ \vdots \end{bmatrix}",
        font_size=22,
    )
    row1 = VGroup(word1, _right_arrow(), vec1).arrange(RIGHT, buff=0.3)

    # "The cat sat" -> column vector
    word2 = Text("The cat sat", font_size=20, color=BLUE_B)
    vec2 = Tex(
        r"\begin{bmatrix} 0.1 \\ 0.7 \\ -0.3 \\ \vdots \end{bmatrix}",
        font_size=22,
    )
    row2 = VGroup(word2, _right_arrow(), vec2).arrange(RIGHT, buff=0.3)

    graphic = VGroup(row1, row2).arrange(DOWN, buff=0.5)
    graphic.move_to(c + UP * 0.7)

    # Bullets
    b1 = Text(
        "•  Given a linguistic term, produce a semantic representation",
        font_size=16,
        color=GREY_A,
    )
    b2 = Text(
        "•  These representations are commonly known as embeddings",
        font_size=16,
        color=GREY_A,
    )
    bullets = VGroup(b1, b2).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
    bullets.move_to(c + DOWN * 1.6)

    # LaTeX
    latex = Tex(
        r"x_1, x_2, \ldots, x_n \rightarrow \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_m \end{bmatrix}",
        font_size=20,
    )
    latex.move_to(c + DOWN * 2.8)

    return VGroup(title, graphic, bullets, latex)


# --- Task 2: Sequence Classification ---


def _build_task2_detail(center):
    c = center

    title = Text("Sequence Classification", font_size=26, weight=BOLD, color=GREEN)
    title.move_to(c + UP * 3.2)

    # Graphic: text block -> arrow -> "Horror"
    abstract = Text("It was a dark and\nstormy night...", font_size=18, color=GREY_A)
    abstract_box = RoundedRectangle(
        width=abstract.get_width() + 0.4,
        height=abstract.get_height() + 0.3,
        corner_radius=0.1,
        color=GREY_B,
        fill_opacity=0.05,
        stroke_width=1,
    )
    abstract_box.move_to(abstract)
    abstract_group = VGroup(abstract_box, abstract)

    horror = Text("Horror", font_size=22, color=RED_B, weight=BOLD)
    horror_box = RoundedRectangle(
        width=horror.get_width() + 0.4,
        height=horror.get_height() + 0.3,
        corner_radius=0.1,
        color=RED,
        fill_opacity=0.1,
        stroke_width=1.5,
    )
    horror_box.move_to(horror)
    horror_group = VGroup(horror_box, horror)

    graphic = VGroup(abstract_group, _right_arrow(), horror_group).arrange(
        RIGHT, buff=0.3
    )
    graphic.move_to(c + UP * 0.6)

    # Bullets
    b1 = Text("•  Given a sequence, classify it", font_size=16, color=GREY_A)
    b2 = Text(
        "•  Normally, we use an embedding model to generate\n"
        "   a representation of the sequence, and then we perform\n"
        "   classification with the generated representation",
        font_size=16,
        color=GREY_A,
    )
    bullets = VGroup(b1, b2).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
    bullets.move_to(c + DOWN * 0.9)

    # LaTeX
    latex = Tex(r"x_1, \ldots, x_n \rightarrow c", font_size=20)
    latex.move_to(c + DOWN * 1.8)

    return VGroup(title, graphic, bullets, latex)


# --- Task 3: Sequence Labelling ---


def _build_task3_detail(center):
    c = center

    title = Text("Sequence Labelling", font_size=26, weight=BOLD, color=YELLOW)
    title.move_to(c + UP * 3.2)

    # Graphic: English words -> French words
    en_words = ["The", "cat", "sat"]
    fr_words = ["Le", "chat", "assis"]

    graphic = VGroup()
    for i, (en, fr) in enumerate(zip(en_words, fr_words)):
        en_text = Text(en, font_size=20, color=BLUE_B)
        fr_text = Text(fr, font_size=20, color=GREEN_B)
        x_offset = RIGHT * (i - 1) * 1.8
        en_text.move_to(c + DOWN * 0.1 + x_offset)
        fr_text.move_to(c + UP * 0.9 + x_offset)
        arrow = Arrow(
            DOWN * 0.3,
            UP * 0.3,
            thickness=1.0,
            fill_color=WHITE,
            fill_opacity=0.5,
            stroke_width=0,
            buff=0,
            max_tip_length_to_length_ratio=0.15,
        )
        arrow.move_to(c + UP * 0.4 + x_offset)
        graphic.add(en_text, arrow, fr_text)

    # Bullets
    b1 = Text(
        "•  Per token in a sequence, assign it a label", font_size=16, color=GREY_A
    )
    bullets = VGroup(b1)
    bullets.move_to(c + DOWN * 1.0)

    # LaTeX
    latex = Tex(
        r"x_1, x_2, \ldots, x_n \rightarrow y_1, y_2, \ldots, y_n", font_size=20
    )
    latex.move_to(c + DOWN * 1.6)

    return VGroup(title, graphic, bullets, latex)


# --- Task 4: Sequence-to-Sequence Learning ---


def _build_task4_detail(center):
    c = center

    title = Text("Sequence-to-Sequence Learning", font_size=26, weight=BOLD, color=RED)
    title.move_to(c + UP * 3.2)

    # Graphic: question -> answer
    question = Text("What is AI?", font_size=20, color=BLUE_B)
    answer = Text("AI is...", font_size=20, color=GREEN_B)
    graphic = VGroup(question, _right_arrow(), answer).arrange(RIGHT, buff=0.4)
    graphic.move_to(c + UP * 0.7)

    # Bullets
    b1 = Text(
        "•  Given a sequence, generate the rest of the sequence",
        font_size=16,
        color=GREY_A,
    )
    b2 = Text(
        "•  Done before with encoder-decoder RNN networks", font_size=16, color=GREY_A
    )
    b3 = Text("•  Superseded by Transformer architecture", font_size=16, color=GREY_A)
    bullets = VGroup(b1, b2, b3).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
    bullets.move_to(c + DOWN * 0.6)

    # LaTeX
    latex = Tex(
        r"x_1, x_2, \ldots, x_n \rightarrow y_1, y_2, \ldots, y_m", font_size=20
    )
    latex.move_to(c + DOWN * 1.6)

    return VGroup(title, graphic, bullets, latex)


# --- Main slide ---


def _show_card_detail(scene, card, card_center, detail):
    # Fade out card and zoom in
    scene.play(
        FadeOut(card),
        scene.frame.animate.move_to(card_center).set_height(DETAIL_HEIGHT),
        run_time=1.0,
    )
    # Show detail
    scene.play(FadeIn(detail), run_time=0.6)
    scene.wait()
    # Fade out detail, zoom back to overview, fade card back in
    scene.play(
        FadeOut(detail),
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        run_time=1.0,
    )
    scene.play(FadeIn(card), run_time=0.3)
    scene.wait()


def slide_nlp_task_formulations(scene: Scene):
    # Set frame to overview
    scene.frame.move_to(OVERVIEW_CENTER)
    scene.frame.set_height(OVERVIEW_HEIGHT)

    # Title
    title = Text("NLP Task Formulations", font_size=72, weight=BOLD)
    title.move_to(np.array([0, 9, 0]))

    # Build cards
    cards = []
    for i in range(4):
        card = _make_card(CARD_NAMES[i], CARD_POSITIONS[i], CARD_COLORS[i])
        cards.append(card)

    # Animate overview
    scene.play(Write(title), run_time=0.8)
    for card in cards:
        scene.play(FadeIn(card, shift=UP * 0.3), run_time=0.4)
    scene.wait()

    # Build detail content
    detail_builders = [
        _build_task1_detail,
        _build_task2_detail,
        _build_task3_detail,
        _build_task4_detail,
    ]

    # Cycle through each card
    for i in range(4):
        detail = detail_builders[i](CARD_POSITIONS[i])
        _show_card_detail(scene, cards[i], CARD_POSITIONS[i], detail)

    scene.wait()
