import ContentSlide from '@/components/slides/ContentSlide'
import katex from 'katex'
import 'katex/dist/katex.min.css'

function MathBlock({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false })
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

function MathInline({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { displayMode: false, throwOnError: false })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export default function DemoMathSlide() {
  return (
    <ContentSlide title="Math rendering">
      <p>
        Display-mode equations are centred on their own line, rendered by KaTeX:
      </p>
      <MathBlock tex={String.raw`\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V`} />
      <p style={{ marginTop: 'var(--spacing-lg)' }}>
        Inline math works too: the softmax temperature is <MathInline tex={String.raw`\frac{1}{\sqrt{d_k}}`} /> where{' '}
        <MathInline tex="d_k" /> is the key dimension.
      </p>
      <MathBlock tex={String.raw`\mathcal{L} = -\sum_{i=1}^{N} y_i \log \hat{y}_i`} />
    </ContentSlide>
  )
}
