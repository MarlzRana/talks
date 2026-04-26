import SplitSlide from '@/components/slides/SplitSlide'
import { motion, AnimatePresence } from 'motion/react'

export const substeps = 4

const layers = [
  { label: 'Input', colour: 'var(--accent-violet)', description: 'Raw tokens enter the model as integer IDs, each mapping to a learned embedding vector.' },
  { label: 'Embed', colour: 'var(--accent-ochre)', description: 'Embeddings project tokens into a continuous vector space where semantic similarity is captured by distance.' },
  { label: 'Attend', colour: 'var(--accent-crimson)', description: 'Self-attention lets every token weigh how relevant every other token is, producing context-aware representations.' },
  { label: 'Output', colour: 'var(--accent-forest)', description: 'A linear head maps the final hidden states to vocabulary logits, producing the next-token probability distribution.' },
]

export default function SubstepsDemo({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const current = layers[activeSubstep] ?? layers[0]

  return (
    <SplitSlide title="Substeps demo" ratio="40/60">
      <SplitSlide.Text>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubstep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <p style={{ color: current.colour, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Layer {activeSubstep + 1} — {current.label}
            </p>
            <p style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>{current.description}</p>
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
              ↑↓ to navigate substeps ({activeSubstep + 1}/{layers.length})
            </p>
          </motion.div>
        </AnimatePresence>
      </SplitSlide.Text>
      <SplitSlide.Visual>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              animate={{
                opacity: i <= activeSubstep ? 1 : 0.15,
                scale: i === activeSubstep ? 1.05 : 1,
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                width: 180,
                padding: '14px 0',
                borderRadius: 8,
                background: layer.colour,
                color: 'var(--ink-on-dark-1)',
                textAlign: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: i === activeSubstep ? '2px solid var(--ink-1)' : '2px solid transparent',
              }}
            >
              {layer.label}
            </motion.div>
          ))}
        </div>
      </SplitSlide.Visual>
    </SplitSlide>
  )
}

export const notes = 'Demo of the substeps framework. Use Up/Down arrows to navigate between sub-steps within a single slide.'
