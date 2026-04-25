from manimlib import *

from talks.shared_components.rnn_diagrams import build_rnn
from talks.shared_components.word2vec_diagrams import vector_block, thin_arrow, build_cbow

# Layout constants
OVERVIEW_CENTER = np.array([0, 0, 0])
OVERVIEW_HEIGHT = 24.0
DETAIL_HEIGHT = 8.0

MODEL_POSITIONS = [
    np.array([-12, 0, 0]),  # FNN
    np.array([0, 0, 0]),  # RNN
    np.array([12, 0, 0]),  # Transformer
]

MODEL_COLORS = [BLUE, GREEN, RED]


# --- RNN (Rolled cell) ---


# --- Transformer (Attention) ---


def _build_transformer(center):
    c = center
    group = VGroup()

    # Central attention box
    box = RoundedRectangle(
        width=3.0,
        height=2.0,
        corner_radius=0.15,
        color=YELLOW,
        fill_opacity=0.05,
        stroke_width=2,
        stroke_opacity=0.7,
    )
    box.move_to(c)
    attn_text = Text("Attention", font_size=24, weight=BOLD, color=YELLOW)
    attn_text.move_to(c)
    group.add(box, attn_text)

    # Top: Values (purple, arrows pointing down into box)
    v_labels = [r"v_1", r"v_2", r"\cdots", r"v_m"]
    v_x_offsets = [-1.0, -0.33, 0.33, 1.0]
    for label_tex, x_off in zip(v_labels, v_x_offsets):
        arrow_start = c + UP * 2.2 + RIGHT * x_off
        arrow_end = c + UP * 1.1 + RIGHT * x_off
        arrow = thin_arrow(arrow_start, arrow_end, color=PURPLE, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=PURPLE_B)
        label.move_to(arrow_start + UP * 0.25)
        group.add(arrow, label)

    # Left: Queries (blue, arrows pointing right into box)
    q_labels = [r"q_1", r"q_2", r"\vdots", r"q_n"]
    q_y_offsets = [0.5, 0.17, -0.17, -0.5]
    for label_tex, y_off in zip(q_labels, q_y_offsets):
        arrow_start = c + LEFT * 2.8 + UP * y_off
        arrow_end = c + LEFT * 1.6 + UP * y_off
        arrow = thin_arrow(arrow_start, arrow_end, color=BLUE, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=BLUE_B)
        label.move_to(arrow_start + LEFT * 0.3)
        group.add(arrow, label)

    # Bottom: Keys (green, arrows pointing up into box)
    k_labels = [r"k_1", r"k_2", r"\cdots", r"k_m"]
    k_x_offsets = [-1.0, -0.33, 0.33, 1.0]
    for label_tex, x_off in zip(k_labels, k_x_offsets):
        arrow_start = c + DOWN * 2.2 + RIGHT * x_off
        arrow_end = c + DOWN * 1.1 + RIGHT * x_off
        arrow = thin_arrow(arrow_start, arrow_end, color=GREEN, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=GREEN_B)
        label.move_to(arrow_start + DOWN * 0.25)
        group.add(arrow, label)

    # Right: Outputs (red, arrows pointing right out of box)
    z_labels = [r"z_1", r"z_2", r"\vdots", r"z_n"]
    z_y_offsets = [0.5, 0.17, -0.17, -0.5]
    for label_tex, y_off in zip(z_labels, z_y_offsets):
        arrow_start = c + RIGHT * 1.6 + UP * y_off
        arrow_end = c + RIGHT * 2.8 + UP * y_off
        arrow = thin_arrow(arrow_start, arrow_end, color=RED, opacity=0.6)
        label = Tex(label_tex, font_size=18, color=RED_B)
        label.move_to(arrow_end + RIGHT * 0.3)
        group.add(arrow, label)

    label = Text("Transformer", font_size=28, weight=BOLD, color=RED)
    label.move_to(c + DOWN * 3.5)

    return group, label


# Scale factor: overview/detail height ratio
_SCALE = OVERVIEW_HEIGHT / DETAIL_HEIGHT  # 3.0


# --- Zoom helper ---


def _zoom_to_model(scene, model_center, label):
    # Zoom in + scale label down to normal size
    scene.play(
        scene.frame.animate.move_to(model_center).set_height(DETAIL_HEIGHT),
        label.animate.scale(1 / _SCALE),
        run_time=1.2,
        rate_func=smooth,
    )
    scene.wait()
    # Zoom out + scale label back up
    scene.play(
        scene.frame.animate.move_to(OVERVIEW_CENTER).set_height(OVERVIEW_HEIGHT),
        label.animate.scale(_SCALE),
        run_time=1.2,
        rate_func=smooth,
    )
    scene.wait()


# --- Main slide ---


def slide_neural_lang_models(scene: Scene):
    # Set frame to overview
    scene.frame.move_to(OVERVIEW_CENTER)
    scene.frame.set_height(OVERVIEW_HEIGHT)

    # Title
    title = Text("Neural Language Models", font_size=72, weight=BOLD)
    title.move_to(np.array([0, 8, 0]))

    # Build all 3 model diagrams + labels
    def _build_cbow_compat(center):
        diagram, label, _groups = build_cbow(center)
        return diagram, label

    builders = [_build_cbow_compat, build_rnn, _build_transformer]
    diagrams = []
    labels = []
    for i, builder in enumerate(builders):
        diagram, label = builder(MODEL_POSITIONS[i])
        # Scale label up for overview readability
        label.scale(_SCALE)
        diagrams.append(diagram)
        labels.append(label)

    # Animate overview
    scene.play(Write(title), run_time=0.8)
    for diagram, label in zip(diagrams, labels):
        scene.play(
            FadeIn(diagram, shift=UP * 0.3),
            FadeIn(label, shift=UP * 0.3),
            run_time=0.5,
        )
    scene.wait()

    # Zoom into each model in sequence
    for i in range(3):
        _zoom_to_model(scene, MODEL_POSITIONS[i], labels[i])

    scene.wait()
