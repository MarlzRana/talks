import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import { Wireframe } from '@/components/paper'
import styles from './06-mcp-lifecycle.module.css'

export const fullbleed = true
export const substeps = 7

/* ── Sequence data ── */

interface ArrowDef {
  label: string
  direction: 'right' | 'left'
  variant: 'request' | 'response' | 'notification'
  clickable?: boolean
  popupKey?: string
}

const INIT_ARROWS: ArrowDef[] = [
  { label: 'initialize', direction: 'right', variant: 'request' },
  { label: 'initialize (response)', direction: 'left', variant: 'response' },
  { label: 'notifications/initialized', direction: 'right', variant: 'notification' },
]

const OPERATION_ARROWS: ArrowDef[] = [
  { label: 'tools/list', direction: 'right', variant: 'request', clickable: true, popupKey: 'toolsListReq' },
  { label: 'tools/list (response)', direction: 'left', variant: 'response', clickable: true, popupKey: 'toolsListRes' },
  { label: 'tools/call', direction: 'right', variant: 'request', clickable: true, popupKey: 'toolsCallReq' },
  { label: 'tools/call (response)', direction: 'left', variant: 'response', clickable: true, popupKey: 'toolsCallRes' },
]

/* ── Popup JSON content (separate request and response) ── */

const POPUP_CONTENT: Record<string, { title: string; code: string }> = {
  toolsListReq: {
    title: 'tools/list — Request',
    code: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}`,
  },
  toolsListRes: {
    title: 'tools/list — Response',
    code: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_customers",
        "description": "Retrieve customers by filter",
        "inputSchema": {
          "type": "object",
          "properties": {
            "email": { "type": "string" },
            "limit": { "type": "number" }
          }
        },
        "outputSchema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "email": { "type": "string" },
              "name": { "type": "string" }
            }
          }
        }
      },
      {
        "name": "create_refund",
        "description": "Create a refund for an order",
        "inputSchema": {
          "type": "object",
          "properties": {
            "order_id": { "type": "string" },
            "amount": { "type": "number" }
          },
          "required": ["order_id"]
        },
        "outputSchema": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "order_id": { "type": "string" },
            "amount": { "type": "number" },
            "status": { "type": "string" }
          }
        }
      }
    ]
  }
}`,
  },
  toolsCallReq: {
    title: 'tools/call — Request',
    code: `{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_customers",
    "arguments": {
      "email": "john@example.com"
    }
  }
}`,
  },
  toolsCallRes: {
    title: 'tools/call — Response',
    code: `{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{ \\"id\\": \\"cus_123\\", \\"name\\": \\"John Doe\\", \\"email\\": \\"john@example.com\\" }"
      }
    ]
  }
}`,
  },
}

/* ── Sub-components ── */

function Arrow({ arrow, visible, onClick }: { arrow: ArrowDef; visible: boolean; onClick?: () => void }) {
  return (
    <motion.div
      className={`${styles.arrowRow} ${arrow.clickable ? styles.arrowClickable : ''}`}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.35 }}
      onClick={arrow.clickable && visible ? onClick : undefined}
    >
      <div className={`${styles.arrow} ${styles[arrow.variant]} ${styles[arrow.direction]}`}>
        <span className={styles.arrowLabel}>{arrow.label}</span>
      </div>
    </motion.div>
  )
}

function DetailPopup({ popupKey, onClose }: { popupKey: string; onClose: () => void }) {
  const [html, setHtml] = useState('')
  const content = POPUP_CONTENT[popupKey]

  useEffect(() => {
    let mounted = true
    if (content) {
      codeToHtml(content.code, { lang: 'json', theme: 'github-dark' }).then((result) => {
        if (mounted) setHtml(result)
      })
    }
    return () => { mounted = false }
  }, [content])

  if (!content) return null

  return (
    <motion.div
      className={styles.popupBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.popupWindow}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.popupTitleBar}>
          <button className={styles.popupCloseBtn} onClick={onClose} type="button" />
          <span className={styles.popupTitle}>{content.title}</span>
        </div>
        <div className={styles.popupContent}>
          {html ? (
            <div className={styles.popupCode} dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <pre className={styles.popupCodeFallback}>{content.code}</pre>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Main Slide ── */

export default function McpLifecycleSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [openPopup, setOpenPopup] = useState<string | null>(null)

  return (
    <Wireframe className={styles.outer} accent="cyan">
      <div className={styles.container} style={{ '--slide-accent': 'var(--accent-cyan)' } as React.CSSProperties}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Model Context Protocol</span>
          <h2 className={styles.title}>MCP Lifecycle</h2>
        </div>

        {/* Sequence diagram */}
        <motion.div
          className={styles.diagram}
          animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Participant boxes */}
          <div className={styles.participantRow}>
            <Wireframe accent="cyan" className={styles.participant}>
              <span className={styles.participantLabel}>CLIENT</span>
            </Wireframe>
            <Wireframe accent="cyan" className={styles.participant}>
              <span className={styles.participantLabel}>SERVER</span>
            </Wireframe>
          </div>

          {/* Lifelines + arrows */}
          <div className={styles.lifelines}>
            <div className={styles.lifeline} />
            <div className={styles.lifeline} />

            {/* Initialization phase — appears at substep 2 */}
            <div className={styles.phaseGroup}>
              {INIT_ARROWS.map((arrow) => (
                <Arrow key={arrow.label} arrow={arrow} visible={activeSubstep >= 2} />
              ))}
            </div>

            {/* Separator */}
            <motion.div
              className={styles.phaseSeparator}
              animate={{ opacity: activeSubstep >= 3 ? 0.4 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Operation phase — each arrow at its own substep (3, 4, 5, 6) */}
            <div className={styles.phaseGroup}>
              {OPERATION_ARROWS.map((arrow, i) => (
                <Arrow
                  key={arrow.label}
                  arrow={arrow}
                  visible={activeSubstep >= i + 3}
                  onClick={() => setOpenPopup(arrow.popupKey!)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detail popup */}
        <AnimatePresence>
          {openPopup && (
            <DetailPopup popupKey={openPopup} onClose={() => setOpenPopup(null)} />
          )}
        </AnimatePresence>
      </div>
    </Wireframe>
  )
}

export const notes = `This slide shows the MCP protocol lifecycle as a sequence diagram. The initialization phase establishes the connection: the client sends an initialize request with its capabilities, the server responds with its own capabilities, and the client confirms with a notifications/initialized message. Then the operation phase begins — the client can list available tools and call them. Click on any tools/list or tools/call arrow to see the actual JSON-RPC message format for that specific request or response.`
