import FullscreenSlide from '@/components/slides/FullscreenSlide'
import type { PaperVariant } from '@/types'

export default function DemoFullscreenSlide() {
  return (
    <FullscreenSlide caption="Paper-dark variant — dot grid on near-black">
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
          }}
        >
          Full-bleed dark surface
        </div>
      </div>
    </FullscreenSlide>
  )
}

export const paper: PaperVariant = 'paper-dark'
