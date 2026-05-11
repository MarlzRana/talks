import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './mcp-capabilities.module.css'

export const fullbleed = true
export const substeps = 3

const CLIENT_CAPABILITIES = [
  { name: 'Roots', desc: 'Expose filesystem entry points to servers' },
  { name: 'Sampling', desc: 'Let servers request LLM completions from the client' },
  { name: 'Elicitation', desc: 'Let servers request user input via forms or URLs' },
]

const SERVER_CAPABILITIES = [
  { name: 'Tools', desc: 'Callable functions the agent can invoke' },
  { name: 'Resources', desc: 'Data the agent can read (files, APIs, databases)' },
  { name: 'Prompts', desc: 'Reusable prompt templates for common workflows' },
  { name: 'Logging', desc: 'Emit structured log messages to the client' },
  { name: 'Completions', desc: 'Argument autocompletion suggestions' },
  { name: 'Skills', desc: 'Composable, higher-level agent behaviors', comingSoon: true },
]

export default function McpCapabilitiesSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <Wireframe className={styles.outer} accent="cyan">
      <div className={styles.container} style={{ '--slide-accent': 'var(--accent-cyan)' } as React.CSSProperties}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Model Context Protocol</span>
          <h2 className={styles.title}>MCP Is More Than Tools</h2>
        </div>

        <div className={styles.columns}>
          {/* Left column: Client Capabilities */}
          <motion.div
            className={styles.column}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.columnHeader}>CLIENT CAPABILITIES</span>
            <div className={styles.cardList}>
              {CLIENT_CAPABILITIES.map((cap, i) => (
                <motion.div
                  key={cap.name}
                  animate={{ opacity: activeSubstep >= 1 ? 1 : 0, y: activeSubstep >= 1 ? 0 : 12 }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                >
                  <Wireframe accent="cyan" className={styles.capabilityCard}>
                    <span className={styles.capabilityName}>{cap.name}</span>
                    <span className={styles.capabilityDesc}>{cap.desc}</span>
                  </Wireframe>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column: Server Capabilities */}
          <motion.div
            className={styles.column}
            animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.columnHeader}>SERVER CAPABILITIES</span>
            <div className={styles.cardList}>
              {SERVER_CAPABILITIES.map((cap, i) => (
                <motion.div
                  key={cap.name}
                  animate={{ opacity: activeSubstep >= 2 ? 1 : 0, y: activeSubstep >= 2 ? 0 : 12 }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                >
                  <Wireframe accent="cyan" className={`${styles.capabilityCard} ${cap.comingSoon ? styles.comingSoon : ''}`}>
                    <span className={styles.capabilityName}>{cap.name}</span>
                    <span className={styles.capabilityDesc}>{cap.desc}</span>
                    {cap.comingSoon && <span className={styles.comingSoonBadge}>COMING SOON</span>}
                  </Wireframe>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Wireframe>
  )
}

export const notes = `MCP is much more than just tool calling. This slide shows the full protocol surface area. Clients can expose filesystem roots, let servers request LLM completions (sampling), and let servers ask for user input (elicitation). Servers can offer tools, resources (readable data), prompt templates, logging, autocompletions, and soon composable skills. The key insight: MCP is a bidirectional protocol where both sides declare capabilities, enabling rich agent-computer interaction beyond simple function calls.`
