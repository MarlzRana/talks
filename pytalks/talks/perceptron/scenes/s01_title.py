from manimlib import *


def slide_title(scene: Scene):
    title = Text(
        "The Perceptron",
        font_size=72,
        weight=BOLD,
    )
    subtitle = Text(
        "From a Single Neuron to Neural Networks",
        font_size=36,
        color=GREY_A,
    )
    author = Text(
        "Marlz Rana",
        font_size=28,
        color=BLUE_C,
    )

    subtitle.next_to(title, DOWN, buff=0.5)
    author.next_to(subtitle, DOWN, buff=1.0)

    scene.play(Write(title), run_time=1.5)
    scene.play(FadeIn(subtitle, shift=UP * 0.3), run_time=1.0)
    scene.play(FadeIn(author, shift=UP * 0.2), run_time=0.8)
    scene.wait()
