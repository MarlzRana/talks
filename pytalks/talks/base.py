from manimlib import *
from pyglet.window import key as PygletKeys


class _GoBack(Exception):
    pass


class SlideTalk(Scene):
    """Base class for slide-based talks with back-navigation support.

    Subclasses must define a SLIDES list of callables: [slide_fn(scene), ...]
    """

    SLIDES: list = []

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
            raise _GoBack()

    def construct(self):
        i = 0
        while i < len(self.SLIDES):
            self._go_back = False
            self._wait_count = 0
            try:
                self.SLIDES[i](self)
            except _GoBack:
                pass

            if self._go_back:
                self.clear()
                if self._wait_count <= 1:
                    # At the beginning of the slide — go to previous
                    i = max(0, i - 1)
                # Otherwise just restart current slide (i stays the same)
                continue

            # Clear before next slide
            if i < len(self.SLIDES) - 1:
                self.play(
                    *[FadeOut(mob) for mob in self.mobjects],
                    run_time=0.5,
                )
            i += 1
