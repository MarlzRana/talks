import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import styles from './finder-overlay.module.css'

interface FileEntry {
  name: string
  content: string
  language?: string
}

interface FinderOverlayProps {
  files: FileEntry[]
  directoryPath: string
}

function HighlightedFile({ code, language = 'markdown' }: { code: string; language?: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    let mounted = true
    codeToHtml(code, { lang: language, theme: 'github-dark' }).then((result) => {
      if (mounted) setHtml(result)
    })
    return () => { mounted = false }
  }, [code, language])

  if (!html) return <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{code}</pre>
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export function FinderOverlay({ files, directoryPath }: FinderOverlayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openFiles, setOpenFiles] = useState<string[]>([])

  const close = () => { setIsOpen(false); setOpenFiles([]) }

  return (
    <>
      {/* Finder icon trigger */}
      <motion.button
        className={styles.finderIcon}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/assets/mac_finder.svg" alt="Finder" width={28} height={28} />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.finderBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <div className={styles.finderStack} onClick={(e) => e.stopPropagation()}>
              {/* Directory listing */}
              <motion.div
                className={styles.finderWindow}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.finderTitleBar}>
                  <button className={styles.finderCloseBtn} onClick={close}>
                    <span>&times;</span>
                  </button>
                  <span className={styles.finderPath}>{directoryPath}</span>
                </div>
                <div className={styles.finderFileList}>
                  {files.length === 0 ? (
                    <span className={styles.finderEmpty}>(empty)</span>
                  ) : (
                    files.map((file) => (
                      <button
                        key={file.name}
                        className={styles.finderFileRow}
                        onClick={() => setOpenFiles((prev) => prev.includes(file.name) ? prev : [...prev, file.name])}
                      >
                        <img className={styles.finderFileIcon} src="/assets/markdown.svg" alt="md" width={16} height={16} />
                        <span>{file.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Open file viewers */}
              <AnimatePresence>
                {openFiles.map((fileName) => {
                  const file = files.find((f) => f.name === fileName)
                  if (!file) return null
                  return (
                    <motion.div
                      key={fileName}
                      className={styles.fileViewerWindow}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.finderTitleBar}>
                        <button className={styles.finderCloseBtn} onClick={() => setOpenFiles((prev) => prev.filter((f) => f !== fileName))}>
                          <span>&times;</span>
                        </button>
                        <span className={styles.finderPath}>{fileName}</span>
                      </div>
                      <div className={styles.fileViewerContent}>
                        <HighlightedFile code={file.content} language={file.language} />
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
