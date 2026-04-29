from manimlib import Scene

from talks.shared_components.contents_slide import make_contents_slide

_BULLETS = [
    "RNN Architectures for NLP Tasks",
    "Bidirectional LSTM",
    "Multi-Layer RNN",
    "Attention",
    "Attention RNN",
]


def slide_contents(scene: Scene):
    make_contents_slide(scene, _BULLETS)
