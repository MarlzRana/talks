import { motion, AnimatePresence } from 'motion/react'
import styles from './ChatWindow.module.css'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  annotation?: string
}

interface ChatWindowProps {
  messages: ChatMessage[]
  visibleCount: number
}

export default function ChatWindow({ messages, visibleCount }: ChatWindowProps) {
  const visible = messages.slice(0, visibleCount)

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.title}>Chat</span>
      </div>
      <div className={styles.messages}>
        <AnimatePresence>
          {visible.map((msg, i) => (
            <motion.div
              key={i}
              className={msg.role === 'user' ? styles.userBubble : styles.assistantBubble}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {msg.annotation && <span className={styles.annotation}>{msg.annotation}</span>}
              <span className={styles.roleLabel}>
                {msg.role === 'user' ? 'You' : 'Model'}
              </span>
              <p className={styles.text}>{msg.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
