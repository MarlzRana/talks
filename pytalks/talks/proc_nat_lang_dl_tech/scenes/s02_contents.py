from manimlib import Scene

from talks.shared_components.contents_slide import make_contents_slide

_BULLETS = [
    "Look at Natural Language Processing (NLP) Task Formulations",
    "Highlight Types of Neural Language Models",
    "Tokenization",
    "Predictive Embedding Feed Forward Neural Networks (FNNs)",
]


def slide_contents(scene: Scene):
    make_contents_slide(scene, _BULLETS)
