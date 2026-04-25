from manimlib import Scene

from talks.shared_components.contents_slide import make_contents_slide

_BULLETS = [
    "Embeddings Explained",
    "Word to Vector (Word2Vec)",
    "Recurrent Neural Networks (RNNs)",
    "Exploding and Vanishing Gradient Problem",
    "Long Short-Term Memory (LSTM)",
]


def slide_contents(scene: Scene):
    make_contents_slide(scene, _BULLETS)
