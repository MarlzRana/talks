from talks.base import SlideTalk
from talks.proc_nat_lang_dl_tech_2.scenes.s01_title import slide_title
from talks.proc_nat_lang_dl_tech_2.scenes.s02_contents import slide_contents
from talks.proc_nat_lang_dl_tech_2.scenes.s02_embeddings import slide_embeddings
from talks.proc_nat_lang_dl_tech_2.scenes.s03_word2vec import slide_word2vec
from talks.proc_nat_lang_dl_tech_2.scenes.s04_rnn import slide_rnn
from talks.proc_nat_lang_dl_tech_2.scenes.s05_vanishing_exploding import (
    slide_vanishing_exploding,
)
from talks.proc_nat_lang_dl_tech_2.scenes.s06_lstm import slide_lstm
from talks.shared_components.transformer_overview import slide_transformer_overview


class ProcNatLangDLTech2Talk(SlideTalk):
    SLIDES = [
        slide_title,
        slide_transformer_overview,
        slide_contents,
        slide_embeddings,
        slide_word2vec,
        slide_rnn,
        slide_vanishing_exploding,
        slide_lstm,
    ]
