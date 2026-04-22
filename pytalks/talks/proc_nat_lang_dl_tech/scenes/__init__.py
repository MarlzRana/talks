from talks.base import SlideTalk
from talks.proc_nat_lang_dl_tech.scenes.s01_title import slide_title
from talks.proc_nat_lang_dl_tech.scenes.s02_contents import slide_contents
from talks.proc_nat_lang_dl_tech.scenes.s03_nlp_task_formulations import (
    slide_nlp_task_formulations,
)
from talks.proc_nat_lang_dl_tech.scenes.s04_neural_lang_models import (
    slide_neural_lang_models,
)
from talks.proc_nat_lang_dl_tech.scenes.s05_transformer_overview import (
    slide_transformer_overview,
)
from talks.proc_nat_lang_dl_tech.scenes.s06_tokenization import (
    slide_tokenization,
)
from talks.proc_nat_lang_dl_tech.scenes.s07_bpe_tokenizer import (
    slide_bpe_tokenizer,
)


class ProcNatLangDLTechTalk(SlideTalk):
    SLIDES = [
        slide_title,
        slide_contents,
        slide_nlp_task_formulations,
        slide_neural_lang_models,
        slide_transformer_overview,
        slide_tokenization,
        slide_bpe_tokenizer,
    ]
