import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { codeToHtml } from 'shiki'
import CodeSlide from '../CodeSlide'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn(),
}))

const mockedCodeToHtml = vi.mocked(codeToHtml)

beforeEach(() => {
  mockedCodeToHtml.mockReset()
})

describe('CodeSlide', () => {
  it('shows loading state initially before codeToHtml resolves', () => {
    // Never resolve the promise so we stay in loading state
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    render(<CodeSlide language="ts" code="const x = 1" />)
    expect(screen.getByText('Loading\u2026')).toBeInTheDocument()
  })

  it('renders highlighted HTML after codeToHtml resolves', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>const x = 1</code></pre>')
    render(<CodeSlide language="ts" code="const x = 1" />)

    await waitFor(() => {
      expect(screen.queryByText('Loading\u2026')).not.toBeInTheDocument()
    })

    // The highlighted HTML is set via dangerouslySetInnerHTML
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('passes correct lang and theme to codeToHtml', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    render(<CodeSlide language="python" code="print('hi')" theme="nord" />)
    expect(mockedCodeToHtml).toHaveBeenCalledWith('print(\'hi\')', {
      lang: 'python',
      theme: 'nord',
    })
  })

  it("default theme is 'github-dark'", () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    render(<CodeSlide language="ts" code="const a = 1" />)
    expect(mockedCodeToHtml).toHaveBeenCalledWith('const a = 1', {
      lang: 'ts',
      theme: 'github-dark',
    })
  })

  it('renders title when provided', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    render(<CodeSlide language="ts" code="code" title="Code Example" />)
    expect(screen.getByText('Code Example')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    render(<CodeSlide language="ts" code="code" description="A description" />)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('renders filename when provided', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')
    render(<CodeSlide language="ts" code="code" filename="index.ts" />)

    await waitFor(() => {
      expect(screen.getByText('index.ts')).toBeInTheDocument()
    })
  })

  it('omits optional elements when not provided', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    const { container } = render(<CodeSlide language="ts" code="code" />)
    // No h2 for title
    expect(container.querySelectorAll('h2')).toHaveLength(0)
    // No p for description
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  it('re-calls codeToHtml when code changes', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))
    const { rerender } = render(<CodeSlide language="ts" code="const a = 1" />)
    expect(mockedCodeToHtml).toHaveBeenCalledTimes(1)

    rerender(<CodeSlide language="ts" code="const b = 2" />)
    expect(mockedCodeToHtml).toHaveBeenCalledTimes(2)
    expect(mockedCodeToHtml).toHaveBeenLastCalledWith('const b = 2', {
      lang: 'ts',
      theme: 'github-dark',
    })
  })

  it('does not update state after unmount', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    let resolvePromise: (value: string) => void
    mockedCodeToHtml.mockReturnValue(
      new Promise<string>((resolve) => {
        resolvePromise = resolve
      }),
    )

    const { unmount } = render(<CodeSlide language="ts" code="code" />)
    unmount()

    // Resolve after unmount -- the mounted flag should prevent setState
    await act(async () => {
      resolvePromise!('<pre><code>code</code></pre>')
    })

    // No React warning about updating unmounted component
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
