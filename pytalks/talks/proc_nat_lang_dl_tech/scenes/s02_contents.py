from manimlib import *


def _vector_block(width, height, n_dots, color, dot_radius=0.06):
    """A rounded rect with dots inside representing a vector."""
    rect = RoundedRectangle(
        width=width,
        height=height,
        corner_radius=0.1,
        color=color,
        fill_opacity=0.03,
        stroke_width=1.5,
        stroke_opacity=0.15,
    )
    dots = VGroup()
    if height > width:
        usable = height * 0.65
        for i in range(n_dots):
            y = (usable / 2) - i * (usable / max(n_dots - 1, 1))
            dot = Circle(
                radius=dot_radius,
                color=color,
                fill_opacity=0.1,
                stroke_width=1,
                stroke_opacity=0.15,
            )
            dot.move_to(rect.get_center() + np.array([0, y, 0]))
            dots.add(dot)
    else:
        usable = width * 0.65
        for i in range(n_dots):
            x = -(usable / 2) + i * (usable / max(n_dots - 1, 1))
            dot = Circle(
                radius=dot_radius,
                color=color,
                fill_opacity=0.1,
                stroke_width=1,
                stroke_opacity=0.15,
            )
            dot.move_to(rect.get_center() + np.array([x, 0, 0]))
            dots.add(dot)

    return VGroup(rect, dots)


def _build_unrolled_rnn():
    """Build a 4-step unrolled RNN spread across the full scene width."""
    num_steps = 4
    spacing = 3.2

    total_width = (num_steps - 1) * spacing
    start_x = -total_width / 2

    hidden_blocks = []
    input_blocks = []
    step_groups = []

    for i in range(num_steps):
        x = start_x + i * spacing
        step = VGroup()

        h_block = _vector_block(0.45, 1.8, 5, GREEN, dot_radius=0.05)
        h_block.move_to(np.array([x, 0, 0]))
        hidden_blocks.append(h_block)
        step.add(h_block)

        x_block = _vector_block(0.9, 0.35, 3, BLUE, dot_radius=0.04)
        x_block.move_to(np.array([x, -1.6, 0]))
        input_blocks.append(x_block)
        step.add(x_block)

        input_arrow = Arrow(
            x_block[0].get_top(),
            h_block[0].get_bottom(),
            thickness=1.0,
            fill_opacity=0.1,
            fill_color=WHITE,
            stroke_width=0,
            buff=0.06,
            max_tip_length_to_length_ratio=0.1,
        )
        step.add(input_arrow)

        x_label = Tex(f"x_{i + 1}", font_size=16, color=BLUE_B)
        x_label.set_opacity(0.15)
        x_label.next_to(input_arrow, RIGHT, buff=0.08)
        step.add(x_label)

        step_groups.append(step)

    # Arrows between steps
    between_groups = []
    for i in range(num_steps - 1):
        h_arrow = Arrow(
            hidden_blocks[i][0].get_right(),
            hidden_blocks[i + 1][0].get_left(),
            thickness=1.0,
            fill_opacity=0.1,
            fill_color=WHITE,
            stroke_width=0,
            buff=0.08,
            max_tip_length_to_length_ratio=0.1,
        )
        h_label = Tex(f"h_{i + 1}", font_size=16, color=GREEN_B)
        h_label.set_opacity(0.15)
        h_label.next_to(h_arrow, UP, buff=0.06)
        between_groups.append(VGroup(h_arrow, h_label))

    # h0 arrow
    h0_arrow = Arrow(
        hidden_blocks[0][0].get_left() + LEFT * 0.7,
        hidden_blocks[0][0].get_left(),
        thickness=1.0,
        fill_opacity=0.1,
        fill_color=WHITE,
        stroke_width=0,
        buff=0.06,
        max_tip_length_to_length_ratio=0.1,
    )
    h0_label = Tex("h_0", font_size=16, color=GREEN_B)
    h0_label.set_opacity(0.3)
    h0_label.next_to(h0_arrow, UP, buff=0.06)
    h0_group = VGroup(h0_arrow, h0_label)

    # h_out arrow
    h_out_arrow = Arrow(
        hidden_blocks[-1][0].get_right(),
        hidden_blocks[-1][0].get_right() + RIGHT * 0.7,
        thickness=1.0,
        fill_opacity=0.1,
        fill_color=WHITE,
        stroke_width=0,
        buff=0.06,
        max_tip_length_to_length_ratio=0.1,
    )
    h_out_label = Tex(f"h_{num_steps}", font_size=16, color=GREEN_B)
    h_out_label.set_opacity(0.3)
    h_out_label.next_to(h_out_arrow, UP, buff=0.06)
    h_out_group = VGroup(h_out_arrow, h_out_label)

    all_parts = VGroup(h0_group, *step_groups, *between_groups, h_out_group)
    return (
        all_parts,
        step_groups,
        between_groups,
        hidden_blocks,
        input_blocks,
        h0_group,
        h_out_group,
    )


def _activate_step(scene, step_group, hidden_block, input_block):
    """Pulse a single RNN step to full brightness."""
    h_rect, h_dots = hidden_block[0], hidden_block[1]
    x_rect, x_dots = input_block[0], input_block[1]
    # Brighten everything in this step
    scene.play(
        # Hidden block — subtle brightening
        h_rect.animate.set_fill(GREEN, opacity=0.1).set_stroke(GREEN, opacity=0.4),
        *[
            d.animate.set_fill(GREEN, opacity=0.3).set_stroke(GREEN, opacity=0.4)
            for d in h_dots
        ],
        # Input block
        x_rect.animate.set_fill(BLUE, opacity=0.1).set_stroke(BLUE, opacity=0.4),
        *[
            d.animate.set_fill(BLUE, opacity=0.3).set_stroke(BLUE, opacity=0.4)
            for d in x_dots
        ],
        # Arrows and labels in step
        *[m.animate.set_opacity(0.4) for m in step_group[2:]],
        run_time=0.3,
    )


def slide_contents(scene: Scene):
    # Build and show dim RNN background
    (
        rnn_all,
        step_groups,
        between_groups,
        hidden_blocks,
        input_blocks,
        h0_group,
        h_out_group,
    ) = _build_unrolled_rnn()
    rnn_all.to_edge(DOWN, buff=0.3)
    scene.play(FadeIn(rnn_all), run_time=0.8)

    # Title
    title = Text("Contents", font_size=56, weight=BOLD)
    title.to_edge(UP, buff=0.6)
    scene.play(Write(title), run_time=0.6)

    # Bullet list (vertical, below title)
    bullets_text = [
        "Look at Natural Language Processing (NLP) Task Formulations",
        "Highlight Types of Neural Language Models",
        "Predictive Embedding Feed Forward Neural Networks (FNNs)",
        "Deep Dive on Recurrent Neural Networks (RNNs)",
    ]

    bullet_group = VGroup()
    for text in bullets_text:
        bullet = Text(f"•  {text}", font_size=38, color=WHITE)
        bullet_group.add(bullet)
    bullet_group.arrange(DOWN, aligned_edge=LEFT, buff=0.4)
    bullet_group.next_to(title, DOWN, buff=0.7)

    for i, bullet in enumerate(bullet_group):
        # Activate corresponding RNN step and show bullet together
        anims = [FadeIn(bullet, shift=RIGHT * 0.3)]
        if i == 0:
            # Light up h0 arrow with first bullet
            anims.extend([m.animate.set_opacity(0.4) for m in h0_group])
        else:
            anims.extend([m.animate.set_opacity(0.4) for m in between_groups[i - 1]])
        scene.play(*anims, run_time=0.4)
        _activate_step(scene, step_groups[i], hidden_blocks[i], input_blocks[i])

    # Light up h_out arrow after the last step
    scene.play(*[m.animate.set_opacity(0.4) for m in h_out_group], run_time=0.3)

    scene.wait()
