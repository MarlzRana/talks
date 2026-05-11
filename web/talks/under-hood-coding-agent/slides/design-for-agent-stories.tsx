import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import { Wireframe } from '@/components/paper'
import { UserBlock, McpBlock, ModelBlock, ThinkingBlockContext, BottomCards, XmlBlock, styles as flowStyles } from '../components'
import styles from './design-for-agent-stories.module.css'

export const fullbleed = true
export const substeps = 4

const TOOL_SCHEMA = `{
  "name": "refund_customer_by_email",
  "description": "Refund the last order for a customer identified by email",
  "inputSchema": {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "description": "Customer email address"
      }
    },
    "required": ["email"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "refund_id": { "type": "string" },
      "order_id": { "type": "string" },
      "amount": { "type": "number" },
      "status": { "type": "string" }
    }
  }
}`


const OLD_TOOLS = ['get_customers', 'get_customer_orders', 'create_refund']

export default function DesignForAgentStoriesSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [showThinking, setShowThinking] = useState(false)
  const [schemaHtml, setSchemaHtml] = useState('')

  useEffect(() => {
    let mounted = true
    codeToHtml(TOOL_SCHEMA, { lang: 'json', theme: 'github-dark' }).then((result) => {
      if (mounted) setSchemaHtml(result)
    })
    return () => { mounted = false }
  }, [])

  return (
    <Wireframe className={styles.outer} accent="forest">
      <div className={styles.container} style={{ '--slide-accent': 'var(--accent-forest)' } as React.CSSProperties}>
        {/* Thinking toggle */}
        <button
          className={`${flowStyles.thinkingToggle} ${!showThinking ? flowStyles.thinkingToggleOff : ''}`}
          onClick={() => setShowThinking((v) => !v)}
        >
          <img src="/assets/brain.svg" alt="Toggle thinking" width={28} height={28} />
        </button>

        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Model Context Protocol</span>
          <h2 className={styles.title}>Design for Agent Stories</h2>
          <p className={styles.agentStory}>
            &ldquo;As an agent, given <em>{'{'}&thinsp;context&thinsp;{'}'}</em>, I use <em>{'{'}&thinsp;tool&thinsp;{'}'}</em> to achieve <em>{'{'}&thinsp;outcome&thinsp;{'}'}</em>&rdquo;
          </p>
        </div>

        <div className={styles.columns}>
          {/* Left column: Old tools struck through → single tool card */}
          <motion.div
            className={styles.leftColumn}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.columnHeader}>MCP TOOL</span>

            {/* Old tools crossed out */}
            <AnimatePresence>
              {activeSubstep === 1 && (
                <motion.div
                  className={styles.oldToolsList}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  {OLD_TOOLS.map((name) => (
                    <span key={name} className={styles.oldToolPill}>{name}</span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* New single tool */}
            <motion.div
              className={styles.toolCardWrapper}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.4, delay: activeSubstep === 1 ? 0.6 : 0 }}
            >
              <Wireframe accent="forest" className={styles.toolCard}>
                {schemaHtml ? (
                  <div className={styles.toolSchema} dangerouslySetInnerHTML={{ __html: schemaHtml }} />
                ) : (
                  <pre className={styles.toolSchemaFallback}>{TOOL_SCHEMA}</pre>
                )}
              </Wireframe>
            </motion.div>
          </motion.div>

          {/* Right column: Context Window */}
          <motion.div
            className={styles.rightColumn}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Wireframe accent="forest" className={styles.runtimeWindow}>
              <span className={styles.columnHeader}>Δ Context Window</span>

              {/* Tools block with pulsing (1) */}
              <XmlBlock tag="tools" accent="forest">
                Available tools <span className={styles.toolCountPulse}>(1)</span>: refund_customer_by_email
              </XmlBlock>

              {/* User message */}
              <UserBlock visible={activeSubstep >= 2}>
                Refund john@example.com&apos;s last order
              </UserBlock>

              <ThinkingBlockContext visible={showThinking && activeSubstep >= 2}>
                The user wants to refund john@example.com&apos;s last order. I can do this in one call with refund_customer_by_email.
              </ThinkingBlockContext>

              {/* Single MCP call */}
              <McpBlock
                visible={activeSubstep >= 2}
                command='refund_customer_by_email({ email: "john@example.com" })'
                response="Refund of $49.99 processed for order ord_456"
              />

              <ModelBlock visible={activeSubstep >= 2}>
                Done! I&apos;ve refunded $49.99 for john@example.com&apos;s last order (ord_456).
              </ModelBlock>

              {/* Context bar with comparison */}
              <div className={styles.contextBarWrapper}>
                <span className={styles.contextBarLabel}>CONTEXT USAGE</span>
                <div className={styles.contextBarTrack}>
                  {/* Crimson hollow bar showing old 72% */}
                  <motion.div
                    className={styles.contextBarOld}
                    animate={{ width: activeSubstep >= 3 ? '72%' : '0%', opacity: activeSubstep >= 3 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Green solid fill showing new 18% */}
                  <motion.div
                    className={styles.contextBarFill}
                    initial={false}
                    animate={{ width: activeSubstep >= 2 ? '18%' : '8%' }}
                    style={{ backgroundColor: activeSubstep >= 1 ? 'var(--accent-forest)' : 'var(--ink-4)' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Token cost */}
              <motion.div
                className={flowStyles.tokenCost}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <Wireframe accent="forest" className={flowStyles.tokenCostInner}>
                  <span className={flowStyles.tokenLabel}>TOKEN COST</span>
                  <span className={flowStyles.tokenValue}>&lt;400</span>
                </Wireframe>
              </motion.div>
            </Wireframe>
          </motion.div>
        </div>

        {/* Bottom cards */}
        <BottomCards
          accent="forest"
          visible={activeSubstep >= 3}
          cards={[
            { title: 'Deterministic', desc: 'Single tool call, no multi-step chaining' },
            { title: 'Minimal Context', desc: 'One schema instead of eleven' },
            { title: 'Purpose-Built', desc: 'Designed for the agent story, not the API spec' },
          ]}
        />
      </div>
    </Wireframe>
  )
}

export const notes = `The solution: instead of converting every API endpoint into a tool, start with the agent story. "As an agent, given a customer email, I use refund_customer_by_email to achieve a refund." One tool replaces three atomic calls. The system reminder is tiny (one tool schema vs eleven). Context usage drops from 72% to 18%. The action is deterministic — no risk of the agent picking the wrong intermediate step.`
