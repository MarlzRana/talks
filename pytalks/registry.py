from talk_types import TalkConfig
from talks.perceptron import talk_config as perceptron
from talks.proc_nat_lang_dl_tech_2 import talk_config as proc_nat_lang_dl_tech_2

ALL_TALKS: list[TalkConfig] = sorted(
    [perceptron, proc_nat_lang_dl_tech_2],
    key=lambda t: t.title,
)


def get_talk(slug: str) -> TalkConfig | None:
    return next((t for t in ALL_TALKS if t.slug == slug), None)
