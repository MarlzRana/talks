from pathlib import Path

from talk_types import TalkConfig

talk_config = TalkConfig(
    slug="perceptron",
    title="The Perceptron & Neural Networks",
    description="From a single perceptron to a multi-layer network — visualizing how neurons compose.",
    scene_file=str(Path(__file__).parent / "scenes" / "__init__.py"),
    author="Marlz Rana",
    date="2026-04-15",
    tags=["neural-networks", "math", "ml"],
)
