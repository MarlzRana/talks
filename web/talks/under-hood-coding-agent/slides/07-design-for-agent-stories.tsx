import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { codeToHtml } from 'shiki'
import { Wireframe } from '@/components/paper'
import { UserBlock, McpBlock, ModelBlock, ThinkingBlockContext, ContextBar, BottomCards, styles as flowStyles } from '../components'
import styles from './07-design-for-agent-stories.module.css'

export const fullbleed = true
export const substeps = 3

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

const SYSTEM_REMINDER_CONTENT = `Available tools (1): refund_customer_by_email

[{ "name": "refund_customer_by_email", "description": "Refund the last order for a customer identified by email", "inputSchema": { "type": "object", "properties": { "email": { "type": "string" } }, "required": ["email"] }, "outputSchema": { "type": "object", "properties": { "refund_id": { "type": "string" }, "order_id": { "type": "string" }, "amount": { "type": "number" }, "status": { "type": "string" } } } }]`

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
      <div className={styles.container}>
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
          {/* Left column: Single tool card */}
          <motion.div
            className={styles.leftColumn}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.columnHeader}>MCP TOOL</span>
            <Wireframe accent="forest" className={styles.toolCard}>
              {schemaHtml ? (
                <div className={styles.toolSchema} dangerouslySetInnerHTML={{ __html: schemaHtml }} />
              ) : (
                <pre className={styles.toolSchemaFallback}>{TOOL_SCHEMA}</pre>
              )}
            </Wireframe>
          </motion.div>

          {/* Right column: Agent Runtime */}
          <motion.div
            className={styles.rightColumn}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Wireframe accent="forest" className={styles.runtimeWindow}>
              <span className={styles.columnHeader}>Δ Context Window</span>

              {/* Small system reminder */}
              <div className={styles.systemReminderBlock}>
                <span className={styles.systemReminderTag}>&lt;system-reminder&gt;</span>
                <pre className={styles.systemReminderContent}>{SYSTEM_REMINDER_CONTENT}</pre>
                <span className={styles.systemReminderTag}>&lt;/system-reminder&gt;</span>
              </div>

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

              {/* Context bar */}
              <ContextBar
                fill={activeSubstep >= 2 ? '18%' : '8%'}
                active={activeSubstep >= 1}
                accent="var(--accent-forest)"
              />
            </Wireframe>
          </motion.div>
        </div>

        {/* Bottom cards */}
        <BottomCards
          accent="forest"
          visible={activeSubstep >= 2}
          cards={[
            { title: 'Deterministic', desc: 'Single tool call, no multi-step chaining' },
            { title: 'Minimal Context', desc: 'One schema instead of seven' },
            { title: 'Purpose-Built', desc: 'Designed for the agent story, not the API spec' },
          ]}
        />
      </div>
    </Wireframe>
  )
}

export const notes = `The solution: instead of converting every API endpoint into a tool, start with the agent story. "As an agent, given a customer email, I use refund_customer_by_email to achieve a refund." One tool replaces three atomic calls. The system reminder is tiny (one tool schema vs seven). Context usage drops from 72% to 18%. The action is deterministic — no risk of the agent picking the wrong intermediate step.`
