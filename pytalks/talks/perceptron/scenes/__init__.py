from manimlib import *

from talks.perceptron.scenes.s01_title import slide_title
from talks.perceptron.scenes.s02_single_perceptron import slide_single_perceptron
from talks.perceptron.scenes.s03_activation import slide_activation
from talks.perceptron.scenes.s04_perceptron_math import slide_perceptron_math
from talks.perceptron.scenes.s05_multi_layer import slide_multi_layer
from talks.perceptron.scenes.s06_forward_pass import slide_forward_pass

SLIDES = [
    slide_title,
    slide_single_perceptron,
    slide_activation,
    slide_perceptron_math,
    slide_multi_layer,
    slide_forward_pass,
]


class PerceptronTalk(Scene):
    def construct(self):
        for i, slide_fn in enumerate(SLIDES):
            slide_fn(self)
            # Clear all objects before the next slide (except the last)
            if i < len(SLIDES) - 1:
                self.play(
                    *[FadeOut(mob) for mob in self.mobjects],
                    run_time=0.5,
                )
