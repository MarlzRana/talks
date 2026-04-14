import { Link } from 'react-router-dom'
import type { TalkConfig } from '@/types'
import TagBadge from './TagBadge'
import styles from './TalkCard.module.css'

export default function TalkCard({ talk }: { talk: TalkConfig }) {
  return (
    <Link to={`/talks/${talk.slug}`} className={styles.card}>
      <h2 className={styles.title}>{talk.title}</h2>
      <p className={styles.description}>{talk.description}</p>
      <div className={styles.meta}>
        {talk.tags && talk.tags.length > 0 && (
          <div className={styles.tags}>
            {talk.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
        )}
        {talk.date && <span className={styles.date}>{talk.date}</span>}
      </div>
    </Link>
  )
}
