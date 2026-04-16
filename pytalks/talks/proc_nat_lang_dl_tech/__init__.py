from pathlib import Path

from talk_types import TalkConfig

talk_config = TalkConfig(
    slug="proc-nat-lang-dl-tech",
    title="Processing Natural Language using Deep Learning Techniques Part 1",
    description="From FFNs to RNNs and Attention — the history of neural language models leading to transformers.",
    scene_file=str(Path(__file__).parent / "scenes" / "__init__.py"),
    author="Marlin Ranasinghe",
    date="2026-04-16",
    tags=["nlp", "rnn", "attention", "deep-learning"],
)
