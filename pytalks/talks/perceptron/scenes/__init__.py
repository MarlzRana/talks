from manimlib import *
from pyglet.window import key as PygletKeys

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


class GoBack(Exception):
    pass


class PerceptronTalk(Scene):
    def setup(self):
        self._go_back = False
        self._wait_count = 0

    def on_key_press(self, symbol, modifiers):
        if symbol == PygletKeys.LEFT:
            self._go_back = True
            self.hold_on_wait = False
            return
        super().on_key_press(symbol, modifiers)

    def wait(self, *args, **kwargs):
        self._wait_count += 1
        super().wait(*args, **kwargs)
        if self._go_back:
            raise GoBack()

    def construct(self):
        i = 0
        while i < len(SLIDES):
            self._go_back = False
            self._wait_count = 0
            try:
                SLIDES[i](self)
            except GoBack:
                pass

            if self._go_back:
                self.clear()
                if self._wait_count <= 1:
                    # At the beginning of the slide — go to previous
                    i = max(0, i - 1)
                # Otherwise just restart current slide (i stays the same)
                continue

            # Clear before next slide
            if i < len(SLIDES) - 1:
                self.play(
                    *[FadeOut(mob) for mob in self.mobjects],
                    run_time=0.5,
                )
            i += 1
