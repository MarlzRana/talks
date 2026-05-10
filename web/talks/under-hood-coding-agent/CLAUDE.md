<presentation_intention>
Often, whether or not something will be good in the coding agent space, is based on anecdotal, rather than "first principles"/fundamentals. Understanding how the "thing works under the hood" aids in understanding coding agent capability, and how to design, write and structure agent configuration (e.g. AGENTS.md, skills, rules).

The aim to produce a presentation that explains the below fundamentals first, and then talk about the practical mechanism to enable it, opposed to, the practical mechanism and then fundamental:
- Context Management
- Progressive Disclosure
- Programmatic Tool Execution (PTC)
- Model Context Protocol (MCP)
- Long Term Memory

The talk should remain objective, and stray away from subjectivity.
</presentation_intention>

<presenters>

Machine Learning Engineers, working on agents: 
1. Marlin Ranasinghe (leading the presentation)
2. Jake Mitchinson
3. Daniel Tsiang 

</presenters>

<presentation_structure>
    Below is a rough outline of what the content of the presentation is:
    <title_slide>
        <content>
            Title: "Under the Hood of a Coding Agent"
            Presenter names
        </content>
    </title_slide>
    <agentic_coding_history>
        A timeline should be presented, with the following points:
            1. Generative AI
            2. Inline Copilot Suggestions
            3. Copilot Chat
            4. Copilot Agent
            5. Agentic IDEs
            6. Claude Code/General CLI-based Coding Agents
    </agentic_coding_history>
    <coding_agent>
        The aim here is to explain what a coding agent fundamentally is before explaining key context engineering fundamentals
        <generative_ai>
            Explain what a model and system prompt is by itself, with an example of prompting back and forth with it. Highlight the limits of this. No tools, no ability to do things, only knows information up to its training time, and unable to automatically contextualize itself on your specific problem/yourself.
        </generative_ai>
        <agentic_ai>
            Explain what a tool and environment is.
            Shows an example of prompting back and forth with Agentic AI, and how it may not respond immediately with an output, but instead a tool call, which our agent runtime will go ahead execute, get the output, and call `predict` again
            Show the while loop code
        </agentic_ai>
    </coding_agent>
    <context_engineering_fundamentals>
        <context_management>
            1. Why is there a context limit?
            2. What is context rot?
            3. What is compaction?
            4. A touch on caching
            <mechanisms>
            1. AGENTS.MD
            2. Additive AGENTS.md
            </mechanisms>
        </context_management>
        <progressive_disclosure>
            Context is limited, so load stuff JIT.
            <mechanisms>
                1. Skill
                2. Rules
                3. Descendant AGENT.md (only loaded when we access the directory it is in)
                4. Fun one: how Claude Design under the hood is just a skill creator
            </mechanisms>
        </progressive_disclosure>
        <programmatic_tool_execution>
            Analogy based explanation.
            <analogy>
                You ask Claude "How much did I spend at Starbucks over the past month?"
                <tools>
                    1. `get_transactions(period='last_month')`
                </tools>
            </analogy>
            1. Show what the traditional flow would look like without PTC
                - Tool returns all 150 transactions
                - All transactions flood into the context window
                - Model manually scans for Starbucks transactions
                - Model tries to sum amounts (error-prone on long lists)
            2. Show what the flow would look like with PTC highlighting how we
                a. Did not pollute the context (code executes outside, only result enters)
                b. Did not rely on long context retrieval which models can struggle on (guaranteed accurate math)
                c. Token savings (~800 vs ~45,000 tokens = 98% savings)
        </programmatic_tool_execution>
        <model_context_protocol>
            <different_computer_interfaces>
                1. GUI - Human -> Computer
                2. API - Computer <-> Computer
                3. MCP - Agent <-> Computer 
            </different_computer_interfaces>
            <compare_api_mcp>
                1. Show an API - highlight how it is not agent friendly
                2. Show an MCP variant of it, and highlight why it is more agent friendly
                3. Highlight that MCP can do much more than tools
            </compare_api_mcp>
        </model_context_protocol>
        <long_term_memory>
            1. Highlight how each session is a fresh piece of context
            2. Explain how memory is used to persist things across sessions
            3. An example scenario:
                a. Memory Saving Session
                    1. A project uses `uv` over `pip`
                    2. Agent attempts to use pip to install a new dependency
                    3. Agent fails, tries `uv` and succeeds
                b. Memory Retrieval Session:
                    1. Memory is inserted at the top of the context window
                    2. You ask to install another new dependency
                    3. Model is able to leverage memory to know to use `uv`
            4. Talk about memory consolidation/auto-dreaming (Claude Code feature)
        </long_term_memory>
    </context_engineering_fundamentals>
    <outro>
        "The highest impact engineers don't have 25 skills, War and Peace in their personal AGENTS.md, and 67 plugins. They are context engineering their codebases to be more coding agent friendly, via the coding agent configuration they check in, whose impact shows up in every PR, for every engineer, every day"
    </outro>
</presentation_structure>


<context_window_blocks>
Shared components in `talks/under-hood-coding-agent/components/context-window/` for rendering context window entries consistently across slides. Each block uses AnimatePresence (only mounts when visible) and accepts a `visible` prop.

| Component | Label Color | Purpose |
|-----------|-------------|---------|
| `UserBlock` | grey | User message |
| `ThinkingBlockContext` | grey (dashed border) | Model thinking/reasoning. Supports `label` prop (default "Thinking", use "MODEL PREDICT" in agent runtime, `null` to hide) |
| `ModelBlock` | grey | Model response. Supports `label` prop (default "Model") |
| `WriteBlock` | violet | Write tool call. Props: `filename`, `content`, `language`, `tooltip`, `response`, `explainer` |
| `BashBlock` | yellow | Bash tool call. Props: `command`, `response` (string or ReactNode), `responseVariant`, `explainer` |
| `McpBlock` | ink-blue | MCP tool call. Props: `command`, `response` (string or ReactNode), `explainer` |
| `ContextBar` | slide-accent | Context usage progress bar. Props: `fill`, `active`, `accent` |
| `ContextEntry` | varies | Generic entry (legacy, prefer specific blocks above) |

All blocks support animated response reveal (height + opacity transition when response prop changes from undefined to a value).

The `explainer` prop renders uppercase grey text above the block label — used in agent runtime to describe what's happening (e.g. "Model Asks Agent Runner to Write Below Code").
</context_window_blocks>

<shared_components>
Other shared components in `talks/under-hood-coding-agent/components/`:

| Component | Purpose |
|-----------|---------|
| `AgentFlowLayout` | Two-column shell (Agent Runtime / Context Window). Props: `eyebrow`, `title`, `accent`, `bottom`. Compound: `.Runtime`, `.Context` |
| `FlowStep` | Agent runtime step with label |
| `FlowConnector` | Vertical line between steps |
| `ThinkingBlock` | Agent runtime thinking (legacy, replaced by ThinkingBlockContext) |
| `CommentaryBlock` | Green/accent dashed explainer box (e.g. "BASH TOOL EXECUTES CODE") |
| `BottomCards` | Benefits/problems card row |
| `FinderOverlay` | Interactive file explorer overlay. Props: `files` (array of {name, content, language}), `directoryPath` |

CSS theming: Components use `--slide-accent` CSS variable set by `AgentFlowLayout` or manually.
</shared_components>

<slide_features>
- **Thinking toggle**: Brain icon (top-right) persists to localStorage key `showThinking`. Hides all ThinkingBlockContext blocks + their connectors on slides 3 and 4.
- **Finder overlay**: Clickable Finder icon shows a file explorer. Files appear progressively based on substep. Used on slides 4 (tmp python file) and 5 (memory files).
- **Shiki highlighting**: WriteBlock uses `codeToHtml` from shiki with `github-dark` theme. FinderOverlay also syntax-highlights file contents.
</slide_features>

<resources>
| Resource | Path |
|---------|------|
| Claude Code Documentation | `~/gh/ericbuess/claude-code-docs` |
| Live Talk URL | `http://talks.localhost/talks/under-hood-coding-agent` |
</resources>

<guidance>
- The user will develop each section/set of slides with you 
- Practical mechanism and what they look like in the context, should assume Claude Code is the tool of use
- Use the AskUserQuestion tool until you are 95% confident
</guidance>


