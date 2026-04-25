import { lazy, Suspense } from 'react'
import FullscreenSlide from '@/components/slides/FullscreenSlide'
import type { PaperVariant } from '@/types'

const SampleScene3D = lazy(() => import('../components/SampleScene3D'))

export default function Demo3DSlide() {
  return (
    <FullscreenSlide caption="Drag to orbit — blueprint paper variant">
      <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-on-dark-2)' }}>Loading 3D scene…</div>}>
        <SampleScene3D />
      </Suspense>
    </FullscreenSlide>
  )
}

export const paper: PaperVariant = 'paper-blueprint'
