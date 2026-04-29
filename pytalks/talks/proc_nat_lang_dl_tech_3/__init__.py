from pathlib import Path

from talk_types import TalkConfig

talk_config = TalkConfig(
    slug="proc-nat-lang-dl-tech-3",
    title="Processing Natural Language using Deep Learning Techniques Part 3",
    description="RNN architectures, bidirectional LSTMs, multi-layer RNNs, and attention mechanisms.",
    scene_file=str(Path(__file__).parent / "scenes" / "__init__.py"),
    author="Marlin Ranasinghe",
    date="2026-04-29",
    tags=["nlp", "rnn", "lstm", "attention", "deep-learning"],
)
