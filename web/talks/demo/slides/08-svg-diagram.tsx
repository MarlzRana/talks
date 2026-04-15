import FullscreenSlide from '@/components/slides/FullscreenSlide'
import SampleDiagram from '../components/SampleDiagram'

export default function DemoDiagramSlide() {
  return (
    <FullscreenSlide caption="Click the diagram to zoom in/out">
      <SampleDiagram />
    </FullscreenSlide>
  )
}
