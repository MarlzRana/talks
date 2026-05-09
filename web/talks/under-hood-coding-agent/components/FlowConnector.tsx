import { motion } from 'motion/react'
import { styles } from './AgentFlowLayout'

interface FlowConnectorProps {
  visible?: boolean
}

export function FlowConnector({ visible = true }: FlowConnectorProps) {
  return (
    <motion.div
      className={styles.connector}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35 }}
    />
  )
}
