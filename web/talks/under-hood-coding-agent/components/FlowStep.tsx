import { motion } from 'motion/react'
import { styles } from './AgentFlowLayout'

interface FlowStepProps {
  label: string
  visible?: boolean
  delay?: number
  children?: React.ReactNode
}

export function FlowStep({ label, visible = true, delay = 0, children }: FlowStepProps) {
  return (
    <motion.div
      className={styles.flowStep}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <span className={styles.stepLabel}>{label}</span>
      {children}
    </motion.div>
  )
}
