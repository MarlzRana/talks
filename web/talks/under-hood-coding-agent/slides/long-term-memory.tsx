import { useState } from 'react'
import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import { FinderOverlay, WriteBlock, UserBlock, BashBlock } from '../components'
import styles from './long-term-memory.module.css'

const FILE_CONTENTS: Record<string, string> = {
  'project_package_manager.md': `---
name: Package Manager
description: This project uses uv, not pip
type: feedback
---

Always use \`uv pip install\` instead of \`pip install\`.`,
  'MEMORY.md': `- [Package manager](project_package_manager.md) — This project uses uv, not pip`,
}


export const fullbleed = true
export const substeps = 12

const SYSTEM_REMINDER_PREVIEW = 'Memories for this project belong in /Users/daniel-tsiang/.claude/project/...'
const SYSTEM_REMINDER_FULL = `Memories for this project belong in /Users/daniel-tsiang/.claude/project/-Users-daniel-tsiang-code-my-repo/memory/, following the below protocol:
1. Write a memory file (e.g., user_role.md, feedback_testing.md) with frontmatter:

---
name: {{memory name}}
description: {{one-line description}}
type: {{user, feedback, project, reference}}
---

{{memory content}}

2. Add a pointer to MEMORY.md — one line, under ~150 characters: - [Title](file.md) — one-line hook

Memory types available:
- user — info about you (role, preferences, knowledge)
- feedback — guidance on how I should approach work (corrections and confirmations)
- project — ongoing work context, goals, decisions
- reference — pointers to external systems/resources`

function SystemReminder() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={styles.systemReminderBlock}
      onClick={() => setExpanded(!expanded)}
    >
      <span className={styles.systemReminderTag}>&lt;system-reminder&gt;</span>
      {expanded ? (
        <pre className={styles.systemReminderContent}>{SYSTEM_REMINDER_FULL}</pre>
      ) : (
        <span className={styles.systemReminderPreview}>
          {SYSTEM_REMINDER_PREVIEW}
          <span className={styles.systemReminderEllipsis}>...</span>
        </span>
      )}
      <span className={styles.systemReminderTag}>&lt;/system-reminder&gt;</span>
    </div>
  )
}

export default function LongTermMemorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const finderFiles = [
    ...(activeSubstep >= 6 ? [{ name: 'project_package_manager.md', content: FILE_CONTENTS['project_package_manager.md'] ?? '' }] : []),
    ...(activeSubstep >= 7 ? [{ name: 'MEMORY.md', content: FILE_CONTENTS['MEMORY.md'] ?? '' }] : []),
  ]

  return (
    <Wireframe className={styles.outer} accent="violet">
      <div className={styles.container}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Context Engineering</span>
          <h2 className={styles.title}>Long Term Memory</h2>
        </div>

        {/* Two session panels */}
        <div className={styles.sessions}>
          {/* Session 1 */}
          <motion.div
            className={styles.sessionPanel}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <Wireframe className={styles.sessionWindow}>
              <div className={styles.sessionHeaderRow}>
                <span className={styles.sessionHeader}>SESSION 1</span>
                <span className={styles.cwd}>~/code/my-repo</span>
              </div>

              {/* System reminder */}
              <SystemReminder />

              {/* User: Install requests */}
              <UserBlock visible={activeSubstep >= 2}>
                Install the requests library
              </UserBlock>

              {/* Agent: pip fails */}
              <BashBlock
                command="pip install requests"
                visible={activeSubstep >= 3}
                response="command not found: pip"
                responseVariant="fail"
              />

              {/* Agent: uv succeeds */}
              <BashBlock
                command="uv pip install requests"
                visible={activeSubstep >= 4}
                response="Successfully installed requests"
              />

              {/* User: Remember */}
              <UserBlock visible={activeSubstep >= 5}>
                Remember to always use uv, not pip
              </UserBlock>

              {/* Write: project_package_manager.md */}
              <WriteBlock
                filename="project_package_manager.md"
                content={FILE_CONTENTS['project_package_manager.md'] ?? ''}
                tooltip="/Users/daniel-tsiang/.claude/project/-Users-daniel-tsiang-code-my-repo/memory/project_package_manager.md"
                visible={activeSubstep >= 6}
              />

              {/* Write: MEMORY.md */}
              <WriteBlock
                filename="MEMORY.md"
                content={FILE_CONTENTS['MEMORY.md'] ?? ''}
                tooltip="/Users/daniel-tsiang/.claude/project/-Users-daniel-tsiang-code-my-repo/memory/MEMORY.md"
                visible={activeSubstep >= 7}
              />
            </Wireframe>
          </motion.div>

          {/* Session 2 */}
          <motion.div
            className={styles.sessionPanel}
            animate={{ opacity: activeSubstep >= 8 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <Wireframe accent="violet" className={styles.sessionWindow}>
              <div className={styles.sessionHeaderRow}>
                <span className={styles.sessionHeader}>SESSION 2</span>
                <span className={styles.cwd}>~/code/my-repo</span>
              </div>

              {/* System reminder */}
              <SystemReminder />

              {/* System reminder: MEMORY.md loaded */}
              <div className={styles.systemReminderBlock}>
                <span className={styles.systemReminderTag}>&lt;system-reminder&gt;</span>
                <pre className={styles.systemReminderContent}>{`Contents of /Users/daniel-tsiang/.claude/project/-Users-daniel-tsiang-code-my-repo/memory/MEMORY.md:\n- [Package manager](project_package_manager.md) — This project uses uv, not pip`}</pre>
                <span className={styles.systemReminderTag}>&lt;/system-reminder&gt;</span>
              </div>

              {/* User: Install pandas */}
              <UserBlock visible={activeSubstep >= 9}>
                Install pandas
              </UserBlock>

              {/* Agent: uv pip install pandas */}
              <BashBlock
                command="uv pip install pandas"
                visible={activeSubstep >= 10}
                response="Successfully installed pandas"
              />
            </Wireframe>
          </motion.div>
        </div>

        {/* Bottom: Benefits row */}
        <motion.div
          className={styles.benefitsRow}
          animate={{ opacity: activeSubstep >= 11 ? 1 : 0, y: activeSubstep >= 11 ? 0 : 20 }}
          transition={{ duration: 0.35 }}
        >
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Persists Across Sessions</span>
            <span className={styles.benefitDesc}>Knowledge survives context resets</span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Learns From Mistakes</span>
            <span className={styles.benefitDesc}>Failures become future guidance</span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Reduces Context Waste</span>
            <span className={styles.benefitDesc}>No tokens spent on known-bad approaches</span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Hierarchical</span>
            <span className={styles.benefitDesc}>Progressively disclose entire memories only when needed</span>
          </Wireframe>
        </motion.div>
        {/* Finder overlay */}
        <FinderOverlay
          files={finderFiles}
          directoryPath="/Users/daniel-tsiang/.claude/project/-Users-daniel-tsiang-code-my-repo/memory/"
        />
      </div>
    </Wireframe>
  )
}

export const notes = `Long-term memory allows coding agents to persist knowledge across sessions. Each new session starts with a blank context, but saved memories are loaded at the top via the system reminder. The agent learns from past mistakes — like discovering a project uses uv instead of pip — and applies that knowledge immediately in future sessions, avoiding repeated failures. The memory protocol writes structured files and indexes them in MEMORY.md for retrieval.`
