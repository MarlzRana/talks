from talks.base import SlideTalk
from talks.proc_nat_lang_dl_tech_3.scenes.s01_title import slide_title
from talks.proc_nat_lang_dl_tech_3.scenes.s02_contents import slide_contents
from talks.shared_components.attention_formulation_slide import (
    slide_attention_formulation,
)
from talks.shared_components.rnn_attention_slide import slide_rnn_attention
from talks.shared_components.rnn_bidirectional_slide import slide_rnn_bidirectional
from talks.shared_components.rnn_classification_slide import slide_rnn_classification
from talks.shared_components.rnn_multi_layer_slide import slide_rnn_multi_layer
from talks.shared_components.rnn_seq2seq_slide import slide_rnn_seq2seq
from talks.shared_components.rnn_seq_labelling_slide import slide_rnn_seq_labelling
from talks.shared_components.transformer_overview import slide_transformer_overview


class ProcNatLangDLTech3Talk(SlideTalk):
    SLIDES = [
        slide_title,
        slide_transformer_overview,
        slide_contents,
        slide_rnn_classification,
        slide_rnn_seq_labelling,
        slide_rnn_seq2seq,
        slide_rnn_bidirectional,
        slide_rnn_multi_layer,
        slide_rnn_attention,
        slide_attention_formulation,
    ]
