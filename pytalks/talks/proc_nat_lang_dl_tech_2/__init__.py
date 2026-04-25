from pathlib import Path

from talk_types import TalkConfig

talk_config = TalkConfig(
    slug="proc-nat-lang-dl-tech-2",
    title="Processing Natural Language using Deep Learning Techniques Part 2",
    description="Embeddings, Word2Vec, RNNs, vanishing gradients, and LSTMs.",
    scene_file=str(Path(__file__).parent / "scenes" / "__init__.py"),
    author="Marlin Ranasinghe",
    date="2026-04-22",
    tags=["nlp", "embeddings", "word2vec", "rnn", "lstm", "deep-learning"],
)
