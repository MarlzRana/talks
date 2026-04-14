import styles from './TitleSlide.module.css'

interface TitleSlideProps {
  title: string
  subtitle?: string
  author?: string
}

export default function TitleSlide({ title, subtitle, author }: TitleSlideProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {author && <p className={styles.author}>{author}</p>}
    </div>
  )
}
