import SplitSlide from '@/components/slides/SplitSlide'
import SampleChart from '../components/SampleChart'

export default function DemoChartSlide() {
  return (
    <SplitSlide title="D3 data visualisation" ratio="40/60">
      <SplitSlide.Text>
        <p>D3 computes scales and layouts. React renders the SVG elements. Motion animates entry.</p>
        <p>The bars animate in with a staggered scale transition — no DOM manipulation, pure declarative rendering.</p>
      </SplitSlide.Text>
      <SplitSlide.Visual>
        <SampleChart />
      </SplitSlide.Visual>
    </SplitSlide>
  )
}
