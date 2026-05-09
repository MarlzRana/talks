import { Wireframe } from '@/components/paper'
import styles from './agent-flow.module.css'

interface AgentFlowLayoutProps {
  eyebrow: string
  title: string
  accent: 'forest' | 'crimson'
  bottom?: React.ReactNode
  children: React.ReactNode
}

function AgentFlowLayout({ eyebrow, title, accent, bottom, children }: AgentFlowLayoutProps) {
  return (
    <div style={{ '--slide-accent': `var(--accent-${accent})` } as React.CSSProperties} className={styles.outer}>
      <Wireframe className={styles.outer} accent={accent}>
        <div className={styles.container}>
          <div className={styles.titleBar}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <div className={styles.columns}>
            {children}
          </div>
          {bottom}
        </div>
      </Wireframe>
    </div>
  )
}

function Runtime({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.flowColumn}>
      <span className={styles.columnHeader}>AGENT RUNTIME</span>
      {children}
    </div>
  )
}

function Context({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.contextColumn}>
      <span className={styles.columnHeader}>Δ Context Window</span>
      {children}
    </div>
  )
}

export default Object.assign(AgentFlowLayout, { Runtime, Context })
export { styles }
