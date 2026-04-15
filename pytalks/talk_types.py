from dataclasses import dataclass, field


@dataclass
class TalkConfig:
    slug: str
    title: str
    description: str
    scene_file: str
    author: str = ""
    date: str = ""
    tags: list[str] = field(default_factory=list)
