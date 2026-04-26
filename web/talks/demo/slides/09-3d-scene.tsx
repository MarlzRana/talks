import { lazy, Suspense } from 'react'
import type { PaperVariant } from '@/types'

const SampleScene3D = lazy(() => import('../components/SampleScene3D'))

export default function Demo3DSlide() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-on-dark-2)' }}>Loading 3D scene…</div>}>
        <SampleScene3D />
      </Suspense>
    </div>
  )
}

export const fullbleed = true
export const paper: PaperVariant = 'paper-blueprint'
