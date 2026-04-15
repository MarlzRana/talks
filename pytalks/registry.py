from talk_types import TalkConfig
from talks.perceptron import talk_config as perceptron

ALL_TALKS: list[TalkConfig] = sorted(
    [perceptron],
    key=lambda t: t.title,
)


def get_talk(slug: str) -> TalkConfig | None:
    return next((t for t in ALL_TALKS if t.slug == slug), None)
