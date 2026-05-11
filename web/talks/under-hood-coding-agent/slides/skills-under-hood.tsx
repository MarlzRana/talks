import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import { UserBlock, ThinkingBlockContext, XmlBlock, WriteBlock, SkillBlock, ReadBlock } from '../components/context-window'
import styles from './skills-under-hood.module.css'

export const fullbleed = true
export const substeps = 8

// Fictional skill content
const SKILL_MD = `## When creating slides:

1. Check \`references/\` for relevant patterns:
   - \`handle-images.md\` — image optimization & lazy loading
   - \`handle-3d-graphics.md\` — React Three Fiber setup & drei helpers

2. Use \`scripts/render-3d-video.py\` for pre-rendering 3D fallbacks

3. Always use CSS Modules and motion/react for animations`

const HANDLE_3D = `# 3D Graphics Reference

## Setup
- Use React.lazy() + Suspense for code-splitting Three.js
- Import from @react-three/fiber and @react-three/drei

## Patterns
- OrbitControls for interactivity
- useFrame() for animation loops
- PresentationControls for drag rotation`

const HANDLE_IMAGES = `# Image Handling Reference

## Optimization
- Use WebP format with fallback to PNG
- Lazy load with loading="lazy"
- Provide width/height to prevent layout shift

## Slide Patterns
- FullscreenSlide for hero images
- SplitSlide.Visual for side-by-side`

const RENDER_SCRIPT = `#!/usr/bin/env python3
"""Pre-render 3D scene to video fallback."""
import subprocess

def render_fallback(scene_path, output_path, duration=5):
    subprocess.run([
        "npx", "react-three-offscreen",
        scene_path, output_path,
        f"--duration={duration}", "--fps=30"
    ])

if __name__ == "__main__":
    render_fallback("src/Scene.tsx", "public/fallback.mp4")`

const SKILL_INDEX = `| Name | Description | Path |
|------|-------------|------|
| slide-design | Create and style slides... | .claude/skills/slide-design/SKILL.md |`

const WRITE_CONTENT = `import { lazy, Suspense } from 'react'
const Cube = lazy(() => import('../components/RotatingCube'))

export default function ThreeDCubeSlide() {
  return (
    <FullscreenSlide>
      <Suspense fallback={<div>Loading...</div>}>
        <Cube />
      </Suspense>
    </FullscreenSlide>
  )
}`

interface FileEntry {
  name: string
  content: string
  language: string
}

const FILES: FileEntry[] = [
  { name: 'SKILL.md', content: SKILL_MD, language: 'markdown' },
  { name: 'references/handle-images.md', content: HANDLE_IMAGES, language: 'markdown' },
  { name: 'references/handle-3d-graphics.md', content: HANDLE_3D, language: 'markdown' },
  { name: 'scripts/render-3d-video.py', content: RENDER_SCRIPT, language: 'python' },
]

// Syntax-highlighted file viewer
function HighlightedFile({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    let mounted = true
    codeToHtml(code, { lang: language, theme: 'github-dark' }).then((result) => {
      if (mounted) setHtml(result)
    })
    return () => { mounted = false }
  }, [code, language])

  if (!html) return <pre>{code}</pre>
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default function SkillsUnderHoodSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [openFile, setOpenFile] = useState<FileEntry | null>(null)

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleBar}>
        <span className={styles.eyebrow}>Progressive Disclosure</span>
        <h1 className={styles.slideTitle}>Skills</h1>
      </div>

      {/* Left: Finder window */}
      <div className={styles.finderArea}>
        <div className={styles.finderWindow}>
          <div className={styles.finderTitleBar}>
            <span className={`${styles.finderDot} ${styles.finderDotRed}`} />
            <span className={`${styles.finderDot} ${styles.finderDotYellow}`} />
            <span className={`${styles.finderDot} ${styles.finderDotGreen}`} />
            <span className={styles.finderPath}>skills/slide-design/</span>
          </div>
          <div className={styles.finderBody}>
            <div
              className={styles.finderItem}
              onClick={() => setOpenFile(FILES[0]!)}
            >
              <span className={styles.finderIcon}>📄</span> SKILL.md
            </div>
            <div className={`${styles.finderItem} ${styles.finderFolder}`}>
              <span className={styles.finderIcon}>📁</span> references/
            </div>
            <div
              className={styles.finderItem}
              style={{ paddingLeft: 30 }}
              onClick={() => setOpenFile(FILES[1]!)}
            >
              <span className={styles.finderIcon}>📄</span> handle-images.md
            </div>
            <div
              className={styles.finderItem}
              style={{ paddingLeft: 30 }}
              onClick={() => setOpenFile(FILES[2]!)}
            >
              <span className={styles.finderIcon}>📄</span> handle-3d-graphics.md
            </div>
            <div className={`${styles.finderItem} ${styles.finderFolder}`}>
              <span className={styles.finderIcon}>📁</span> scripts/
            </div>
            <div
              className={styles.finderItem}
              style={{ paddingLeft: 30 }}
              onClick={() => setOpenFile(FILES[3]!)}
            >
              <span className={styles.finderIcon}>🐍</span> render-3d-video.py
            </div>
          </div>
        </div>
      </div>

      {/* Right: Agent Runtime */}
      <div className={styles.runtimeArea}>
        <div className={styles.runtimeHeader}>AGENT RUNTIME</div>
        <div className={styles.runtimeBlocks}>
          <XmlBlock tag="system-reminder" visible={activeSubstep >= 1} accent="cyan">
            {SKILL_INDEX}
          </XmlBlock>

          <UserBlock visible={activeSubstep >= 2}>
            I want to create a new slide that shows a 3D revolving cube
          </UserBlock>

          <ThinkingBlockContext visible={activeSubstep >= 3}>
            This matches the slide-design skill. Let me load it for detailed guidance.
          </ThinkingBlockContext>

          <SkillBlock
            skillName="slide-design"
            visible={activeSubstep >= 4}
            content={activeSubstep >= 5 ? SKILL_MD : undefined}
          />

          <ReadBlock
            filename="references/handle-3d-graphics.md"
            visible={activeSubstep >= 6}
            content={HANDLE_3D}
          />

          <WriteBlock
            visible={activeSubstep >= 7}
            filename="slides/3d-cube.tsx"
            content={WRITE_CONTENT}
            language="tsx"
          />
        </div>
      </div>

      {/* File overlay */}
      <AnimatePresence>
        {openFile && (
          <motion.div
            className={styles.fileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpenFile(null)}
          >
            <motion.div
              className={styles.fileViewer}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.fileViewerTitle}>
                <button className={styles.fileViewerClose} onClick={() => setOpenFile(null)} />
                <span className={styles.fileViewerName}>{openFile.name}</span>
              </div>
              <div className={styles.fileViewerContent}>
                <HighlightedFile code={openFile.content} language={openFile.language} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const notes = `This slide demonstrates how skills work under the hood.
Left: The skill directory structure (interactive — click to view files).
Right: Agent runtime showing progressive disclosure in action.

Flow:
1. System prompt only has the skill INDEX (name + description + path)
2. User asks to create a 3D slide
3. Agent recognizes the skill matches
4. Full skill content is loaded JIT
5. Agent reads reference files and writes code

Key point: Only the index is loaded upfront. The full skill + references
are loaded on-demand — this IS progressive disclosure.`
