import { useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import { codeToHtml } from 'shiki'
import { Wireframe } from '@/components/paper'
import { UserBlock, McpBlock, ModelBlock, ThinkingBlockContext, ContextBar, BottomCards, XmlBlock, styles as flowStyles } from '../components'
import styles from './api-not-agent-friendly.module.css'

export const fullbleed = true
export const substeps = 8

/* ── Data ── */

const ENDPOINT_TOOLS = [
  { path: '/customers', methods: ['GET', 'POST'], tools: ['get_customers', 'create_customer'] },
  { path: '/customers/:id', methods: ['GET', 'PUT', 'DEL'], tools: ['get_customer_by_id', 'update_customer', 'delete_customer'] },
  { path: '/customers/:id/orders', methods: ['GET', 'POST'], tools: ['get_customer_orders', 'create_customer_order'] },
  { path: '/orders/:id', methods: ['GET', 'PUT', 'DEL'], tools: ['get_order_by_id', 'update_order', 'delete_order'] },
  { path: '/orders/:id/refund', methods: ['POST'], tools: ['create_refund'] },
]

const ALL_TOOLS = ENDPOINT_TOOLS.flatMap((ep) => ep.tools)

const TOOL_SCHEMAS: Record<string, string> = {
  get_customers: `{
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
}`,
  create_customer: `{
  "name": "create_customer",
  "description": "Create a new customer",
  "inputSchema": {
    "type": "object",
    "properties": {
      "email": { "type": "string" },
      "name": { "type": "string" }
    },
    "required": ["email", "name"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "email": { "type": "string" },
      "name": { "type": "string" },
      "created_at": { "type": "string" }
    }
  }
}`,
  get_customer_by_id: `{
  "name": "get_customer_by_id",
  "description": "Get a single customer by ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": { "type": "string" }
    },
    "required": ["customer_id"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "email": { "type": "string" },
      "name": { "type": "string" },
      "created_at": { "type": "string" }
    }
  }
}`,
  update_customer: `{
  "name": "update_customer",
  "description": "Update customer details",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": { "type": "string" },
      "data": { "type": "object" }
    },
    "required": ["customer_id"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "email": { "type": "string" },
      "name": { "type": "string" },
      "updated_at": { "type": "string" }
    }
  }
}`,
  delete_customer: `{
  "name": "delete_customer",
  "description": "Delete a customer",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": { "type": "string" }
    },
    "required": ["customer_id"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "deleted": { "type": "boolean" }
    }
  }
}`,
  get_customer_orders: `{
  "name": "get_customer_orders",
  "description": "List orders for a customer",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": { "type": "string" },
      "status": { "type": "string" }
    },
    "required": ["customer_id"]
  },
  "outputSchema": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "amount": { "type": "number" },
        "status": { "type": "string" },
        "created_at": { "type": "string" }
      }
    }
  }
}`,
  create_customer_order: `{
  "name": "create_customer_order",
  "description": "Create an order for a customer",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": { "type": "string" },
      "items": { "type": "array" }
    },
    "required": ["customer_id", "items"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "customer_id": { "type": "string" },
      "amount": { "type": "number" },
      "status": { "type": "string" }
    }
  }
}`,
  get_order_by_id: `{
  "name": "get_order_by_id",
  "description": "Get an order by ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string" }
    },
    "required": ["order_id"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "customer_id": { "type": "string" },
      "amount": { "type": "number" },
      "status": { "type": "string" },
      "items": { "type": "array" }
    }
  }
}`,
  update_order: `{
  "name": "update_order",
  "description": "Update an order",
  "inputSchema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string" },
      "status": { "type": "string" }
    },
    "required": ["order_id"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "status": { "type": "string" },
      "updated_at": { "type": "string" }
    }
  }
}`,
  delete_order: `{
  "name": "delete_order",
  "description": "Delete an order",
  "inputSchema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string" }
    },
    "required": ["order_id"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "deleted": { "type": "boolean" }
    }
  }
}`,
  create_refund: `{
  "name": "create_refund",
  "description": "Create a refund for an order",
  "inputSchema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string" },
      "amount": { "type": "number" },
      "reason": { "type": "string" }
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
}`,
}


const SYSTEM_REMINDER_FULL = `[
  { "name": "get_customers", "description": "Retrieve customers by filter", "inputSchema": { "properties": { "email": { "type": "string" }, "limit": { "type": "number" } } } },
  { "name": "create_customer", "description": "Create a new customer", "inputSchema": { "properties": { "email": { "type": "string" }, "name": { "type": "string" } }, "required": ["email", "name"] } },
  { "name": "get_customer_by_id", "description": "Get a single customer by ID", "inputSchema": { "properties": { "customer_id": { "type": "string" } }, "required": ["customer_id"] } },
  { "name": "update_customer", "description": "Update customer details", "inputSchema": { "properties": { "customer_id": { "type": "string" }, "data": { "type": "object" } }, "required": ["customer_id"] } },
  { "name": "delete_customer", "description": "Delete a customer", "inputSchema": { "properties": { "customer_id": { "type": "string" } }, "required": ["customer_id"] } },
  { "name": "get_customer_orders", "description": "List orders for a customer", "inputSchema": { "properties": { "customer_id": { "type": "string" }, "status": { "type": "string" } }, "required": ["customer_id"] } },
  { "name": "create_customer_order", "description": "Create an order for a customer", "inputSchema": { "properties": { "customer_id": { "type": "string" }, "items": { "type": "array" } }, "required": ["customer_id", "items"] } },
  { "name": "get_order_by_id", "description": "Get an order by ID", "inputSchema": { "properties": { "order_id": { "type": "string" } }, "required": ["order_id"] } },
  { "name": "update_order", "description": "Update an order", "inputSchema": { "properties": { "order_id": { "type": "string" }, "status": { "type": "string" } }, "required": ["order_id"] } },
  { "name": "delete_order", "description": "Delete an order", "inputSchema": { "properties": { "order_id": { "type": "string" } }, "required": ["order_id"] } },
  { "name": "create_refund", "description": "Create a refund for an order", "inputSchema": { "properties": { "order_id": { "type": "string" }, "amount": { "type": "number" }, "reason": { "type": "string" } }, "required": ["order_id"] } }
]`

/* ── Sub-components ── */

function HttpMethodBadge({ method }: { method: string }) {
  return (
    <span className={`${styles.badge} ${styles[`badge${method}`]}`}>
      {method}
    </span>
  )
}

function ToolPill({ name }: { name: string }) {
  return (
    <motion.span className={styles.toolPill} layoutId={`tool-${name}`}>
      {name}
    </motion.span>
  )
}

function ToolCard({ name, expanded }: { name: string; expanded: boolean }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (!expanded) return
    let mounted = true
    const schema = TOOL_SCHEMAS[name]
    if (schema) {
      codeToHtml(schema, { lang: 'json', theme: 'github-dark' }).then((result) => {
        if (mounted) setHtml(result)
      })
    }
    return () => { mounted = false }
  }, [name, expanded])

  return (
    <div className={styles.toolCardWrapper}>
      <ToolPill name={name} />
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.toolSchemaExpanded}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {html ? (
              <div className={styles.schemaCode} dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <pre className={styles.schemaCodeFallback}>{TOOL_SCHEMAS[name]}</pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


/* ── Main Slide ── */

export default function ApiNotAgentFriendlySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [showThinking, setShowThinking] = useState(false)
  const phase1 = activeSubstep >= 1 && activeSubstep < 2
  const phase2 = activeSubstep >= 2
  const schemasExpanded = activeSubstep >= 3

  return (
    <Wireframe className={styles.outer} accent="crimson">
      <div className={styles.container} style={{ '--slide-accent': 'var(--accent-crimson)' } as React.CSSProperties}>
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
          <h2 className={styles.title}>APIs Are Not Agent-Friendly</h2>
        </div>

        <LayoutGroup>
          {/* Phase 1: Side-by-side endpoint ↔ tools rows */}
          <AnimatePresence>
            {phase1 && (
              <motion.div
                className={styles.pairedList}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {ENDPOINT_TOOLS.map((ep, i) => (
                  <div key={ep.path}>
                    <div className={styles.pairedRow}>
                      <div className={styles.endpointSide}>
                        <span className={styles.endpointPath}>{ep.path}</span>
                        <div className={styles.badgeGroup}>
                          {ep.methods.map((m) => (
                            <HttpMethodBadge key={m} method={m} />
                          ))}
                        </div>
                      </div>
                      <div className={styles.toolSide}>
                        {ep.tools.map((name) => (
                          <ToolPill key={name} name={name} />
                        ))}
                      </div>
                    </div>
                    {i < ENDPOINT_TOOLS.length - 1 && <div className={styles.dottedSeparator} />}
                  </div>
                ))}
                <div className={styles.dottedSeparator} />
                <div className={styles.pairedRow}>
                  <span className={styles.moreLabel}>[And many more...]</span>
                  <div className={styles.toolSide}>
                    <motion.span className={styles.toolPill} layoutId="tool-more">...</motion.span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Tools left (with expandable schemas), Agent Runtime right */}
          {phase2 && (
            <div className={styles.columns}>
              <div className={styles.leftColumn}>
                <motion.div
                  className={styles.toolCardGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {ALL_TOOLS.map((name) => (
                    <ToolCard key={name} name={name} expanded={schemasExpanded} />
                  ))}
                  <div className={styles.toolCardWrapper}>
                    <motion.span className={styles.toolPill} layoutId="tool-more">...</motion.span>
                  </div>
                </motion.div>
              </div>

              <div className={styles.rightColumn}>
                <AnimatePresence>
                  {activeSubstep >= 4 && (
                  <motion.div
                    className={styles.runtimePanel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Wireframe accent="crimson" className={styles.runtimeWindow}>
                      <span className={styles.columnHeader}>Δ Context Window</span>

                      {/* Tools block */}
                      <XmlBlock tag="tools" accent="crimson" expandedContent={SYSTEM_REMINDER_FULL}>
                        Available tools <span className={styles.toolCountPulse}>(11)</span>: get_customers, create_customer, get_customer_by_id, update_customer, delete_customer, get_customer_orders, create_customer_order, get_order_by_id, update_order, delete_order, create_refund...
                      </XmlBlock>

                      {/* User message */}
                      <UserBlock visible={activeSubstep >= 5}>
                        Refund john@example.com&apos;s last order
                      </UserBlock>

                      <ThinkingBlockContext visible={showThinking && activeSubstep >= 6}>
                        I need to refund this customer. Let me look up the customer by email first.
                      </ThinkingBlockContext>

                      {/* MCP calls */}
                      <McpBlock
                        visible={activeSubstep >= 6}
                        command='get_customer_by_id({ customer_id: "john@example.com" })'
                        response='Error: Invalid customer_id format. Expected UUID.'
                        explainer="WRONG TOOL — confused email for ID"
                      />

                      <ThinkingBlockContext visible={showThinking && activeSubstep >= 6}>
                        That failed. I used the wrong tool — I need get_customers with an email filter, not get_customer_by_id.
                      </ThinkingBlockContext>

                      <McpBlock
                        visible={activeSubstep >= 6}
                        command='get_customers({ email: "john@example.com" })'
                        response='{ id: "cus_123", name: "John Doe" }'
                      />

                      <ThinkingBlockContext visible={showThinking && activeSubstep >= 6}>
                        Got customer cus_123. Now I need to fetch their orders to find the last one.
                      </ThinkingBlockContext>

                      <McpBlock
                        visible={activeSubstep >= 6}
                        command='get_customer_orders({ customer_id: "cus_123" })'
                        response='[{ id: "ord_456", amount: 49.99 }]'
                      />

                      <ThinkingBlockContext visible={showThinking && activeSubstep >= 7}>
                        Found order ord_456 for $49.99. I&apos;ll now create the refund for this order.
                      </ThinkingBlockContext>

                      <McpBlock
                        visible={activeSubstep >= 7}
                        command='create_refund({ order_id: "ord_456" })'
                        response="Refund processed"
                      />

                      <ModelBlock visible={activeSubstep >= 7}>
                        Done! I&apos;ve refunded $49.99 for john@example.com&apos;s last order (ord_456).
                      </ModelBlock>

                      {/* Context bar */}
                      <ContextBar
                        fill={activeSubstep >= 6 ? '72%' : '45%'}
                        active={activeSubstep >= 4}
                        accent="var(--accent-crimson)"
                      />

                      {/* Token cost label */}
                      <motion.div
                        className={flowStyles.tokenCost}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <Wireframe accent="crimson" className={flowStyles.tokenCostInner}>
                          <span className={flowStyles.tokenLabel}>TOKEN COST</span>
                          <span className={flowStyles.tokenValue}>~2,400</span>
                        </Wireframe>
                      </motion.div>
                    </Wireframe>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          )}
        </LayoutGroup>

        {/* Bottom cards */}
        <BottomCards
          accent="crimson"
          visible={activeSubstep >= 3}
          cards={[
            { title: 'Context Bloat', desc: 'Large number of tool schemas size up the context window' },
            { title: 'Multi-Step Chaining', desc: 'Agent must chain 3 atomic calls to complete one action' },
          ]}
        />
      </div>
    </Wireframe>
  )
}

export const notes = `This slide demonstrates why directly converting REST APIs to MCP tools is problematic. Phase 1 shows how a typical API with many endpoints produces a flood of individual tools that bloat the context window. The tool schemas expand to show how much context each tool definition consumes. Phase 2 shows the agent runtime struggling with multi-step chaining — needing 3 separate calls to accomplish a single "refund by email" action, which is error-prone and wasteful.`
