import ScrollySlide from '@/components/slides/ScrollySlide'

const steps = [
  { label: 'Step 1', body: 'Tokens are embedded into high-dimensional vectors. Each word becomes a point in a continuous space where similar meanings cluster together.' },
  { label: 'Step 2', body: 'Positional encodings are added to preserve sequence order. Without them, the model would treat the input as a bag of words.' },
  { label: 'Step 3', body: 'Self-attention computes pairwise relationships between all tokens. Each token attends to every other token, weighted by relevance.' },
]

const colours = ['var(--accent-violet)', 'var(--accent-crimson)', 'var(--accent-forest)']

export default function DemoScrollySlide() {
  return (
    <ScrollySlide
      steps={steps}
      visual={(activeStep) => (
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: activeStep === 2 ? '50%' : 0,
            border: '1px dashed var(--ink-3)',
            background: colours[activeStep] ?? colours[0],
            transition: 'all 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-on-dark-1)',
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
          }}
        >
          {activeStep + 1}
        </div>
      )}
    />
  )
}
