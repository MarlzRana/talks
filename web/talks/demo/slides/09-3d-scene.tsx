import { lazy, Suspense } from 'react'
import FullscreenSlide from '@/components/slides/FullscreenSlide'

const SampleScene3D = lazy(() => import('../components/SampleScene3D'))

export default function Demo3DSlide() {
  return (
    <FullscreenSlide caption="Drag to orbit — lazy-loaded React Three Fiber">
      <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>Loading 3D scene…</div>}>
        <SampleScene3D />
      </Suspense>
    </FullscreenSlide>
  )
}
