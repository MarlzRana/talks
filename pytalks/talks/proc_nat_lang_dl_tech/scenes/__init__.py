from talks.base import SlideTalk
from talks.proc_nat_lang_dl_tech.scenes.s01_title import slide_title
from talks.proc_nat_lang_dl_tech.scenes.s02_contents import slide_contents
from talks.proc_nat_lang_dl_tech.scenes.s03_nlp_task_formulations import (
    slide_nlp_task_formulations,
)


class ProcNatLangDLTechTalk(SlideTalk):
    SLIDES = [
        # slide_title,
        # slide_contents,
        slide_nlp_task_formulations,
    ]
