import styles from './TagBadge.module.css'

export default function TagBadge({ label }: { label: string }) {
  return <span className={styles.badge}>{label}</span>
}
