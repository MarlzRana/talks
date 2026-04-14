import { talks } from '@/lib/talks'
import TalkCard from '@/components/picker/TalkCard'
import styles from './TalkPicker.module.css'

export default function TalkPicker() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Talks</h1>
      <div className={styles.grid}>
        {talks.map((talk) => (
          <TalkCard key={talk.slug} talk={talk} />
        ))}
      </div>
    </div>
  )
}
