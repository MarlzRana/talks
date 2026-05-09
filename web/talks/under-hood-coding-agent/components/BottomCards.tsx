import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import { styles } from './AgentFlowLayout'

interface Card {
  title: string
  desc: string
}

interface BottomCardsProps {
  visible?: boolean
  accent: 'forest' | 'crimson'
  cards: Card[]
}

export function BottomCards({ visible = true, accent, cards }: BottomCardsProps) {
  return (
    <motion.div
      className={styles.cardsRow}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.35 }}
    >
      {cards.map((card, i) => (
        <Wireframe key={i} accent={accent} className={styles.card}>
          <span className={styles.cardTitle}>{card.title}</span>
          <span className={styles.cardDesc}>{card.desc}</span>
        </Wireframe>
      ))}
    </motion.div>
  )
}
