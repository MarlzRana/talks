import ReactLoopDiagram from '../components/ReactLoopDiagram'
import styles from './react-loop.module.css'

export const fullbleed = true
export const substeps = 11

export default function ReactLoopSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleBox}>
        <span className={styles.mark} data-pos="tl" />
        <span className={styles.mark} data-pos="tr" />
        <span className={styles.mark} data-pos="bl" />
        <span className={styles.mark} data-pos="br" />
        <h1 className={styles.titleText}>The ReAct Loop</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.diagramFull}>
          <ReactLoopDiagram activeSubstep={activeSubstep} />
        </div>
      </div>
    </div>
  )
}

export const notes = `Show the horizontal ReAct loop architecture.
Four components: Model, Agent Runner, Tools, Environment.
Arrows build up showing the numbered flow.
Key insight: we always pass full prior context + new info to the model.`
