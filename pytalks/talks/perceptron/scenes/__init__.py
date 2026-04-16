from talks.base import SlideTalk
from talks.perceptron.scenes.s01_title import slide_title
from talks.perceptron.scenes.s02_single_perceptron import slide_single_perceptron
from talks.perceptron.scenes.s03_activation import slide_activation
from talks.perceptron.scenes.s04_perceptron_math import slide_perceptron_math
from talks.perceptron.scenes.s05_multi_layer import slide_multi_layer
from talks.perceptron.scenes.s06_forward_pass import slide_forward_pass


class PerceptronTalk(SlideTalk):
    SLIDES = [
        slide_title,
        slide_single_perceptron,
        slide_activation,
        slide_perceptron_math,
        slide_multi_layer,
        slide_forward_pass,
    ]
