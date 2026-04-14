import FullscreenSlide from '@/components/slides/FullscreenSlide'

export default function DemoFullscreenSlide() {
  return (
    <FullscreenSlide caption="Full-bleed visual — edge to edge">
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 30% 50%, #7F77DD 0%, #1a1040 50%, var(--color-bg) 100%)',
        }}
      />
    </FullscreenSlide>
  )
}
