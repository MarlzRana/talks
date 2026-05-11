import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import AgentStackDiagram, { type ArrowDirection } from '../components/AgentStackDiagram'
import { UserBlock, ThinkingBlockContext, BashBlock, ModelBlock } from '../components/context-window'
import { codeToHtml } from 'shiki'
import styles from './react-loop.module.css'

export const fullbleed = true
export const substeps = 16

const REACT_CODE = `def on_user_query(context, new_query):
    context += [new_query]
    while True:
        new_parts = model.predict(context)
        context += new_parts
        last_part = new_parts[-1]
        if last_part.type == "END":
            break
        if last_part.type == "TOOL_CALL":
            tool_call = last_part.content
            tool_res = call_tool(
                tool_call.tool_name,
                tool_call.args
            )
            context += tool_res
    return context`

// Substep → active arrow mapping
// 0: layout appears
// 1: User block + agent-to-model
// 2: model-to-agent + Thinking + Bash(mkdir)
// 3: agent-to-tools
// 4: tools-to-env
// 5: env-to-tools
// 6: tools-to-agent + bash response
// 7: agent-to-model (sending tool result)
// 8: model-to-agent + Thinking("Folder created") + Bash(echo)
// 9: agent-to-tools
// 10: tools-to-env
// 11: env-to-tools
// 12: tools-to-agent + bash response
// 13: agent-to-model (sending tool result)
// 14: model-to-agent + ModelBlock (final response)
// 15: code appears

function getActiveArrow(substep: number): ArrowDirection {
  switch (substep) {
    case 1: case 7: case 13: return 'agent-to-model'
    case 2: case 8: case 14: return 'model-to-agent'
    case 3: case 9: return 'agent-to-tools'
    case 4: case 10: return 'tools-to-env'
    case 5: case 11: return 'env-to-tools'
    case 6: case 12: return 'tools-to-agent'
    default: return null
  }
}

export default function ReactLoopExampleSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [codeHtml, setCodeHtml] = useState('')

  const showExample = activeSubstep <= 14
  const showCode = activeSubstep >= 15

  useEffect(() => {
    let mounted = true
    if (showCode) {
      codeToHtml(REACT_CODE, { lang: 'python', theme: 'github-dark' }).then((result) => {
        if (mounted) setCodeHtml(result)
      })
    }
    return () => { mounted = false }
  }, [showCode])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left: Vertical diagram */}
        <div className={styles.diagramLeft}>
          <AgentStackDiagram activeArrow={showExample ? getActiveArrow(activeSubstep) : null} />
        </div>

        {/* Right: Context window (example) or Code */}
        <AnimatePresence mode="wait">
          {showExample && (
            <motion.div
              key="example"
              className={styles.contextArea}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.runtimeHeader}>AGENT RUNTIME</div>
              <div className={styles.runtimeFrame}>
                <UserBlock visible={activeSubstep >= 1}>
                  Create a new folder called &apos;demo&apos; and add a README
                </UserBlock>
                <ThinkingBlockContext visible={activeSubstep >= 2}>
                  I need to create a directory first, then write a file.
                </ThinkingBlockContext>
                <BashBlock
                  visible={activeSubstep >= 2}
                  command="mkdir demo"
                  response={activeSubstep >= 6 ? '✓' : undefined}
                  responseVariant="success"
                />
                <ThinkingBlockContext visible={activeSubstep >= 8}>
                  Folder created. Now I&apos;ll write the README.
                </ThinkingBlockContext>
                <BashBlock
                  visible={activeSubstep >= 8}
                  command="echo '# Demo\n\nA demo project.' > demo/README.md"
                  response={activeSubstep >= 12 ? '✓' : undefined}
                  responseVariant="success"
                />
                <ModelBlock visible={activeSubstep >= 14}>
                  Done! Created <code>demo/</code> folder with a README.md file.
                </ModelBlock>
              </div>
            </motion.div>
          )}

          {showCode && (
            <motion.div
              key="code"
              className={styles.codeArea}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.codePanel}>
                {codeHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
                ) : (
                  <pre><code>{REACT_CODE}</code></pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const notes = `Walk through a real example of the ReAct loop.
Query: "Create a new folder called 'demo' and add a README"
Two tool calls: mkdir then echo.

Each substep lights up the corresponding arrow in the vertical diagram,
showing exactly which component is communicating with which.

Then show the actual code — it's just a while loop!`
