import { useRef, useState, type ReactNode } from 'react'
import { useInView } from 'motion/react'
import styles from './ScrollySlide.module.css'

interface Step {
  label: string
  body: string
}

interface ScrollySlideProps {
  steps: Step[]
  visual: (activeStep: number) => ReactNode
}

function StepItem({ step, index, onActivate }: { step: Step; index: number; onActivate: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.5 })

  if (isInView) {
    // Schedule activation outside render to avoid setState during render
    queueMicrotask(() => onActivate(index))
  }

  return (
    <div ref={ref} className={`${styles.step}${isInView ? ` ${styles.active}` : ''}`}>
      <div className={styles.stepLabel}>{step.label}</div>
      <div className={styles.stepBody}>{step.body}</div>
    </div>
  )
}

export default function ScrollySlide({ steps, visual }: ScrollySlideProps) {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        {steps.map((step, i) => (
          <StepItem key={i} step={step} index={i} onActivate={setActiveStep} />
        ))}
      </div>
      <div className={styles.visual}>{visual(activeStep)}</div>
    </div>
  )
}
