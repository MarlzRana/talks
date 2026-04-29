from talks.base import SlideTalk
from talks.proc_nat_lang_dl_tech_3.scenes.s01_title import slide_title
from talks.proc_nat_lang_dl_tech_3.scenes.s02_contents import slide_contents
from talks.shared_components.rnn_classification_slide import slide_rnn_classification
from talks.shared_components.rnn_seq2seq_slide import slide_rnn_seq2seq
from talks.shared_components.rnn_seq_labelling_slide import slide_rnn_seq_labelling
from talks.shared_components.transformer_overview import slide_transformer_overview


class ProcNatLangDLTech3Talk(SlideTalk):
    SLIDES = [
        # slide_title,
        # slide_transformer_overview,
        # slide_contents,
        # slide_rnn_classification,
        # slide_rnn_seq_labelling,
        slide_rnn_seq2seq,
    ]
