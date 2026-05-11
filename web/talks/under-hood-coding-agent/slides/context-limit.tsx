import { motion, AnimatePresence } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './context-limit.module.css'

export const fullbleed = true
export const substeps = 7

interface TokenSpec {
  text: string
  /** annotation appears under the token when its slot is highlighted */
  annotation?: string
  kind?: 'focus' | 'ref' | 'predicted'
}

// English example — "The animal did not cross the road because it was tired"
const ENGLISH: TokenSpec[] = [
  { text: 'The' },
  { text: 'animal', annotation: 'likely referent', kind: 'ref' },
  { text: 'did' },
  { text: 'not' },
  { text: 'cross' },
  { text: 'the' },
  { text: 'road', annotation: 'less likely', kind: 'ref' },
  { text: 'because' },
  { text: 'it', annotation: 'what does this refer to?', kind: 'focus' },
  { text: 'was' },
  { text: 'tired', annotation: 'clue → animal', kind: 'ref' },
]

const CHIPS = [
  'Cost / turn',
  'Latency on each predict',
  'GPU memory',
  'Fairness',
  'Safety & logging',
]

function TokenLine({
  tokens,
  showAnnotations,
  showPrediction = true,
}: {
  tokens: TokenSpec[]
  showAnnotations: boolean
  /** whether predicted tokens have been revealed yet */
  showPrediction?: boolean
}) {
  return (
    <div className={styles.tokenRow}>
      {tokens.map((t, i) => {
        if (t.text === '\n') {
          return <div key={i} style={{ flexBasis: '100%', height: 0 }} />
        }
        // Predicted tokens stay hidden until showPrediction is true
        if (t.kind === 'predicted' && !showPrediction) return null

        const cls =
          t.kind === 'focus' && showAnnotations
            ? styles.tokenFocus
            : t.kind === 'ref' && showAnnotations
              ? styles.tokenRef
              : t.kind === 'predicted'
                ? styles.tokenPredicted
                : ''
        const annCls =
          t.kind === 'focus'
            ? styles.tokenAnnotationFocus
            : t.kind === 'ref'
              ? styles.tokenAnnotationRef
              : t.kind === 'predicted'
                ? styles.tokenAnnotationRef
                : ''
        return (
          <motion.div
            key={i}
            className={styles.tokenCell}
            initial={{ opacity: 0, y: t.kind === 'predicted' ? 0 : 4, scale: t.kind === 'predicted' ? 0.85 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: t.kind === 'predicted' ? 0 : i * 0.025,
              duration: t.kind === 'predicted' ? 0.45 : 0.25,
              ease: 'easeOut',
            }}
          >
            {t.kind === 'predicted' && (
              <span className={styles.predictBadge}>next-token prediction</span>
            )}
            <span className={`${styles.token} ${cls}`}>{t.text}</span>
            <AnimatePresence>
              {showAnnotations && t.annotation && (
                <motion.span
                  key="ann"
                  className={`${styles.tokenAnnotation} ${annCls}`}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {t.annotation}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function ContextLimitSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  // 0  Title + lede only
  // 1  Transformer / attention paragraph
  // 2  English sentence
  // 3  Annotations: `it` + animal / road / tired
  // 4  Scale callout (n × n)
  // 5  Effective vs advertised
  // 6  Economic chips
  const showIntro = activeSubstep >= 1
  const showEnglish = activeSubstep >= 2
  const showEnglishAnn = activeSubstep >= 3
  const showScale = activeSubstep >= 4
  const showEffective = activeSubstep >= 5
  const showChips = activeSubstep >= 6

  return (
    <Wireframe className={styles.outer} accent="violet">
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Context Engineering · 1 / 2</span>
          <h2 className={styles.title}>Why can't we have infinite context?</h2>
          <p className={styles.lede}>
            Models advertise million-token windows. So why is there a limit at all?
            It comes down to how the model actually "reads".
          </p>
        </div>

        <div className={styles.body}>
          {/* Transformer / attention intro */}
          <AnimatePresence>
            {showIntro && (
              <motion.p
                key="intro"
                className={styles.standaloneIntro}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                Modern LLMs are built on the <strong>Transformer</strong> architecture.
                It reads a sequence of tokens and uses <strong>attention</strong> to let
                each token compare itself against every other token in the sequence.
              </motion.p>
            )}
          </AnimatePresence>

          {/* English example */}
          <AnimatePresence>
            {showEnglish && (
              <motion.div
                key="english"
                className={styles.exampleBlock}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.exampleCaption}>
                  Every token compares against every prior token
                </span>
                <TokenLine tokens={ENGLISH} showAnnotations={showEnglishAnn} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lower row: scale + effective */}
          <div className={styles.lowerRow}>
            <motion.div
              className={styles.scaleBox}
              animate={{ opacity: showScale ? 1 : 0.15 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.exampleCaption}>Attention gets expensive as context grows</span>
              <p className={styles.exampleIntro}>
                In a <strong>decoder-only</strong><sup className={styles.footMark}>*</sup> LLM,
                each token can attend to every prior token and itself — so the number
                of token-to-token comparisons grows <strong>quadratically: O(n²)</strong>.
              </p>
              <div className={styles.scaleRow}>
                <span>11 tokens</span>
                <span>≈ 121 attention positions</span>
              </div>
              <div className={styles.scaleRow}>
                <span>10,000 tokens</span>
                <span>≈ 100,000,000</span>
              </div>
              <div className={styles.scaleRow}>
                <span>100,000 tokens</span>
                <span>≈ 10,000,000,000</span>
              </div>
              <span className={styles.scaleQuad}>
                Bigger context isn't free: every extra token multiplies compute,
                strains memory, and adds noise the model has to filter through.
              </span>
              <span className={styles.footnote}>
                <span className={styles.footMark}>*</span> Causal attention only sees
                prior tokens, so the actual count is n(n+1)/2 — still amortized to O(n²).
              </span>
            </motion.div>

            <motion.div
              className={styles.effectiveBlock}
              animate={{ opacity: showEffective ? 1 : 0.15 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.exampleCaption}>Advertised ≠ effective</span>
              <div className={styles.effectiveBars}>
                <div className={styles.effectiveBar}>
                  <span className={styles.effectiveBarLabel}>
                    Advertised — 1,000,000 tokens
                  </span>
                  <div
                    className={`${styles.effectiveFill} ${styles.effectiveFillMuted}`}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className={styles.effectiveBar}>
                  <span className={styles.effectiveBarLabel}>
                    Reliably useful — much less
                  </span>
                  <div className={styles.effectiveFill} style={{ width: '38%' }} />
                </div>
              </div>
              <span className={styles.effectiveCaption}>
                Long-context training is expensive, so models train mostly on shorter
                sequences. They accept long inputs but don't always use them well.
              </span>
            </motion.div>
          </div>

          {/* Economic chips */}
          <motion.div
            className={styles.chipsRow}
            animate={{ opacity: showChips ? 1 : 0.15 }}
            transition={{ duration: 0.35 }}
          >
            {CHIPS.map((c) => (
              <span key={c} className={styles.chip}>
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </Wireframe>
  )
}

export const notes = `Why a coding agent's context window is finite.

1. Start with the natural-language example: "The animal did not cross the road because it was tired." For 'it' to make sense, the model has to look back. Animal is the likely referent, road is less likely, tired is the clue that points to animal.
2. Same thing happens in code: 'return user.email' — which user? The model has to look back at the declaration and at fetchUser(id) which produced the value.
3. That look-back is attention. Every token compares against every prior token. With n tokens you do n × n comparisons.
4. Quadratic: 11 tokens = 121, 10k = 100M, 100k = 10B. Long context isn't "more text" — it's much more compute and memory.
5. Effective vs advertised: training on long sequences is expensive, so most pretraining uses shorter ones. A 1M window doesn't mean the agent reliably uses 1M.
6. Economic ceiling: even when research permits more, products cap context for cost / latency / GPU memory / fairness / safety.

(Caching is the third lever — the stable prefix (system prompt + tool defs + AGENTS.md + skills) is cached server-side, so cache hits skip recomputation. Faster TTFT, cheaper tokens, but the window itself doesn't get bigger.)`
