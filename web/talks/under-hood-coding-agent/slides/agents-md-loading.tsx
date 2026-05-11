import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UserBlock, XmlBlock, ReadBlock } from '../components/context-window'
import styles from './skills-under-hood.module.css'

export const fullbleed = true
export const substeps = 4

const ROOT_AGENTS_MD = `# My Services Monorepo

- All services use Java 21 + Spring Boot 3
- Follow the shared API design guide in /docs
- Use structured logging (SLF4J + Logback)`

const SERVICE_1_AGENTS_MD = `# Service 1 — Customer API

- Handles customer CRUD and notifications
- Uses PostgreSQL via Spring Data JPA
- API prefix: /api/v1/customers`

const FEATURE_MODULE_AGENTS_MD = `# Feature Module 1 — Loyalty Points

- Points calculation uses BigDecimal (never double)
- All point mutations must go through PointsLedger
- Feature flag: loyalty.points.enabled`

const FEATURE_JAVA = `public class Feature {
    private final PointsLedger ledger;

    public Feature(PointsLedger ledger) {
        this.ledger = ledger;
    }

    public BigDecimal calculatePoints(Order order) {
        BigDecimal base = order.getTotal()
            .multiply(BigDecimal.valueOf(0.01));
        return ledger.credit(order.getCustomerId(), base);
    }
}`

const ANCESTOR_CONTENT = `Contents of ~/code/my-services/AGENTS.md:
${ROOT_AGENTS_MD}

---

Contents of ~/code/my-services/service-1/AGENTS.md:
${SERVICE_1_AGENTS_MD}`

interface FileEntry {
  name: string
  content: string
  language: string
}

const FILES: FileEntry[] = [
  { name: 'AGENTS.md (root)', content: ROOT_AGENTS_MD, language: 'markdown' },
  { name: 'service-1/AGENTS.md', content: SERVICE_1_AGENTS_MD, language: 'markdown' },
  { name: 'service-1/feature-module-1/AGENTS.md', content: FEATURE_MODULE_AGENTS_MD, language: 'markdown' },
  { name: 'service-2/AGENTS.md', content: '# Service 2 — Billing API\n\n- Handles invoicing and payment processing\n- Uses Stripe SDK for payments', language: 'markdown' },
  { name: 'service-2/feature-module-1/AGENTS.md', content: '# Feature Module 1 — Recurring Billing\n\n- Cron-based subscription renewal\n- Retry logic with exponential backoff', language: 'markdown' },
]

function HighlightedFile({ code }: { code: string }) {
  return <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, color: 'var(--ink-on-dark-1)', whiteSpace: 'pre-wrap' }}>{code}</pre>
}

export default function AgentsMdLoadingSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [openFile, setOpenFile] = useState<FileEntry | null>(null)

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleBar}>
        <span className={styles.eyebrow}>Progressive Disclosure</span>
        <h1 className={styles.slideTitle}>AGENTS.md</h1>
      </div>

      {/* Left: Finder window showing project structure */}
      <div className={styles.finderArea}>
        <div className={styles.finderWindow}>
          <div className={styles.finderTitleBar}>
            <span className={`${styles.finderDot} ${styles.finderDotRed}`} />
            <span className={`${styles.finderDot} ${styles.finderDotYellow}`} />
            <span className={`${styles.finderDot} ${styles.finderDotGreen}`} />
            <span className={styles.finderPath}>code/my-services/</span>
          </div>
          <div className={styles.finderBody}>
            {/* Root AGENTS.md — highlighted at substep 1 (ancestor) */}
            <div className={`${styles.finderItem} ${activeSubstep >= 1 ? styles.finderItemHighlighted : ''}`} onClick={() => setOpenFile(FILES[0]!)}>
              <span className={styles.finderIcon}>📄</span> AGENTS.md
            </div>
            <div className={`${styles.finderItem} ${styles.finderFolder}`}>
              <span className={styles.finderIcon}>📁</span> service-1/
            </div>
            {/* service-1/AGENTS.md — highlighted at substep 1 (ancestor, CWD) */}
            <div className={`${styles.finderItem} ${activeSubstep >= 1 ? styles.finderItemHighlighted : ''}`} style={{ paddingLeft: 30 }} onClick={() => setOpenFile(FILES[1]!)}>
              <span className={styles.finderIcon}>📄</span> AGENTS.md
            </div>
            <div className={`${styles.finderItem} ${styles.finderFolder}`} style={{ paddingLeft: 30 }}>
              <span className={styles.finderIcon}>📁</span> feature-module-1/
            </div>
            {/* feature-module-1/AGENTS.md — highlighted at substep 3 (descendant) */}
            <div className={`${styles.finderItem} ${activeSubstep >= 3 ? styles.finderItemHighlighted : ''}`} style={{ paddingLeft: 50 }} onClick={() => setOpenFile(FILES[2]!)}>
              <span className={styles.finderIcon}>📄</span> AGENTS.md
            </div>
            <div className={styles.finderItem} style={{ paddingLeft: 50 }}>
              <span className={styles.finderIcon}>☕</span> Feature.java
            </div>
            <div className={`${styles.finderItem} ${styles.finderFolder}`}>
              <span className={styles.finderIcon}>📁</span> service-2/
            </div>
            <div className={styles.finderItem} style={{ paddingLeft: 30 }} onClick={() => setOpenFile(FILES[3]!)}>
              <span className={styles.finderIcon}>📄</span> AGENTS.md
            </div>
            <div className={`${styles.finderItem} ${styles.finderFolder}`} style={{ paddingLeft: 30 }}>
              <span className={styles.finderIcon}>📁</span> feature-module-1/
            </div>
            <div className={styles.finderItem} style={{ paddingLeft: 50 }} onClick={() => setOpenFile(FILES[4]!)}>
              <span className={styles.finderIcon}>📄</span> AGENTS.md
            </div>
          </div>
        </div>
      </div>

      {/* Right: Agent Runtime */}
      <div className={styles.runtimeArea}>
        <div className={styles.runtimeHeader}>AGENT RUNTIME &nbsp; <span style={{ opacity: 0.5, fontSize: '10px' }}>cwd: ~/code/my-services/service-1</span></div>
        <div className={styles.runtimeBlocks}>
          <XmlBlock
            tag="system-reminder"
            visible={activeSubstep >= 1}
            accent="cyan"
            expandedContent={ANCESTOR_CONTENT}
          >
            Ancestor AGENTS.md loaded (root + service-1)
          </XmlBlock>

          <UserBlock visible={activeSubstep >= 2}>
            What is in feature-module-1/Feature.java?
          </UserBlock>

          <ReadBlock
            filename="feature-module-1/Feature.java"
            visible={activeSubstep >= 3}
            content={FEATURE_JAVA}
            language="java"
            systemReminder={{
              label: 'Descendant injected: service-1/feature-module-1/AGENTS.md',
              content: FEATURE_MODULE_AGENTS_MD,
            }}
            showSystemReminder={activeSubstep >= 3}
          />
        </div>
      </div>

      {/* File overlay */}
      <AnimatePresence>
        {openFile && (
          <motion.div
            className={styles.fileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpenFile(null)}
          >
            <motion.div
              className={styles.fileViewer}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.fileViewerTitle}>
                <button className={styles.fileViewerClose} onClick={() => setOpenFile(null)} />
                <span className={styles.fileViewerName}>{openFile.name}</span>
              </div>
              <div className={styles.fileViewerContent}>
                <HighlightedFile code={openFile.content} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const notes = `Demonstrates ancestor + descendant AGENTS.md loading.

CWD is ~/code/my-services/service-1.

Ancestor loading (at startup):
- Traverses UP from CWD to root, finds AGENTS.md at each level
- root/AGENTS.md + service-1/AGENTS.md are combined additively

Descendant loading (lazy, on access):
- When agent reads feature-module-1/Feature.java
- System discovers feature-module-1/AGENTS.md exists
- Injects it as a system-reminder (shown attached to the Read result)

Key point: Descendant context is ONLY loaded when the agent accesses that directory.
This prevents irrelevant context from service-2/ polluting the window.`
