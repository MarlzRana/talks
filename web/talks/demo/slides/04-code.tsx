import CodeSlide from '@/components/slides/CodeSlide'

const code = `def attention(Q, K, V, d_k):
    """Scaled dot-product attention."""
    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)
    weights = F.softmax(scores, dim=-1)
    return weights @ V


class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x):
        Q = self.W_q(x).view(*x.shape[:-1], self.n_heads, self.d_k).transpose(-3, -2)
        K = self.W_k(x).view(*x.shape[:-1], self.n_heads, self.d_k).transpose(-3, -2)
        V = self.W_v(x).view(*x.shape[:-1], self.n_heads, self.d_k).transpose(-3, -2)
        out = attention(Q, K, V, self.d_k)
        out = out.transpose(-3, -2).contiguous().view(*x.shape)
        return self.W_o(out)`

export default function DemoCodeSlide() {
  return <CodeSlide title="Code highlighting" language="python" filename="attention.py" code={code} />
}

export const notes = `Walk through the attention mechanism. Highlight that Shiki provides VS Code-quality syntax highlighting at runtime.`
