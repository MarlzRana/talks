# pytalks

Animated technical presentations powered by **manimgl** (ManimGL v1.7.x).

## Quick Start

```bash
# Run a talk (e.g. the perceptron talk)
PYTHONPATH=. uv run manimgl talks/perceptron/scenes/__init__.py PerceptronTalk -f

# Add -p for presenter mode
PYTHONPATH=. uv run manimgl talks/perceptron/scenes/__init__.py PerceptronTalk -p -f
```

Navigation: **Space/Right** = next slide, **Left** = go back.

## Project Structure

```
pytalks/
├── registry.py          # Central list of all talks (ALL_TALKS)
├── talk_types.py         # TalkConfig dataclass
├── custom_config.yml     # Manim camera config (black background)
├── talks/
│   ├── shared-images/    # Assets shared across talks
│   └── <talk-slug>/      # One directory per talk
│       ├── __init__.py   # TalkConfig metadata
│       ├── scenes/
│       │   ├── __init__.py        # Main Scene class + SLIDES list
│       │   ├── s01_title.py       # Individual slides (functions)
│       │   └── ...
│       └── components/   # Reusable VGroup builders for this talk
└── prompts/              # Planning docs for future talks (not code)
```

## Adding a New Talk

1. Create `talks/<slug>/` with `__init__.py` exporting a `TalkConfig`.
2. Create `talks/<slug>/scenes/__init__.py` with a `Scene` subclass that aggregates slides via a `SLIDES` list.
3. Add individual slides as `s##_name.py` files — each exports a function `def slide_name(scene: Scene)`.
4. Register the talk in `registry.py` → `ALL_TALKS`.
5. Optionally add `components/` for reusable manimgl VGroups.

## Slide Pattern

Each slide is a standalone function:

```python
def slide_title(scene: Scene):
    title = Text("Hello", font_size=48)
    scene.play(Write(title))
    scene.wait()
```

The main Scene class calls these sequentially and handles back-navigation via a `GoBack` exception.

## Conventions

- Slides are numbered `s01_`, `s02_`, etc.
- Color scheme: inputs = BLUE, hidden = GREEN, outputs = RED, weights = GREEN, bias = ORANGE, activation = RED.
- Components return `VGroup`s (not Scene subclasses).
- `PYTHONPATH=.` is required when running — manimgl needs the project root on the path.

## Dependencies

- `manimgl >= 1.7.2` — animation engine
- `setuptools < 81` — manimgl requires `pkg_resources` (removed in setuptools 82+)
- `ffmpeg` — required system dependency (install via `brew install ffmpeg`)
