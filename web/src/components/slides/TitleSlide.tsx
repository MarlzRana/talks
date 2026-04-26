import { Wireframe } from '@/components/paper'
import styles from './TitleSlide.module.css'

interface TitleSlideProps {
  title: string
  subtitle?: string
  author?: string | string[]
}

export default function TitleSlide({ title, subtitle, author }: TitleSlideProps) {
  const authors = Array.isArray(author) ? author : author ? [author] : []

  return (
    <div className={styles.slide}>
      <Wireframe className={styles.titleZone}>
        <div className={styles.titleContent}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {authors.length > 0 && (
            <div className={styles.authors}>
              {authors.map((a) => (
                <p key={a} className={styles.author}>{a}</p>
              ))}
            </div>
          )}
        </div>
      </Wireframe>
    </div>
  )
}
