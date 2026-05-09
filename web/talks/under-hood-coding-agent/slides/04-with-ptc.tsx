import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { codeToHtml } from 'shiki';
import { Wireframe } from '@/components/paper';
import { FinderOverlay, ContextBar, WriteBlock, BashBlock, UserBlock, ThinkingBlockContext, ModelBlock } from '../components';
import styles from './04-with-ptc.module.css';

export const fullbleed = true;
export const substeps = 9;

const CODE = `from mcp.bank import get_transactions
txns = get_transactions("last_month")
txns_starbucks = [t for t in txns if t.merchant == "Starbucks"]
total = {sum(t.amount for t in txns_starbucks)}
print("Total: £" + total)`;

const CODE_LINES = [
  'from mcp.bank import get_transactions',
  'txns = get_transactions("last_month")',
  'txns_starbucks = [t for t in txns if t.merchant == "Starbucks"]',
  'total = {sum(t.amount for t in txns_starbucks)}',
  'print("Total: £" + total)',
];

export default function WithPtcSlide({
  activeSubstep = 0,
}: {
  activeSubstep?: number;
}) {
  const [codeHtml, setCodeHtml] = useState('');

  useEffect(() => {
    let mounted = true;
    codeToHtml(CODE, { lang: 'python', theme: 'github-dark' }).then(
      (result) => {
        if (mounted) setCodeHtml(result);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <Wireframe className={styles.outer} accent="forest">
      <div className={styles.container}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>PTC Flow</span>
          <h2 className={styles.title}>With Programmatic Tool Calling</h2>
        </div>

        {/* Two-column layout */}
        <div className={styles.columns}>
          {/* Left: Flow diagram */}
          <div className={styles.flowColumn}>
            <span className={styles.columnHeader}>AGENT RUNTIME</span>
            {/* Step 1: User question */}
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>USER</span>
              <div className={styles.messageBubble}>
                "How much did I spend at Starbucks over the past month?"
              </div>
            </div>

            {/* Substep 1: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL PREDICT</span>
              {activeSubstep >= 1 && (
                <motion.div
                  className={styles.thinkingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  Thinking: The get_transactions tool only has a time filter,
                  but I also need to filter by merchant. Let me write some code
                  to filter again by merchant.
                </motion.div>
              )}
            </motion.div>

            {/* Substep 2: Write + response */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>
                Model Asks Agent Runner to Write Below Code
              </span>
              <div className={styles.codeBlock}>
                <code>
                  Write("/tmp/get_txns_starbucks_transactions_last_month.py",
                  ...)
                </code>
              </div>
              <div className={styles.codeBlock}>
                {codeHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
                ) : (
                  CODE_LINES.map((line, i) => (
                    <div key={i} className={styles.codeLine}>
                      {line}
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Write tool response */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <span className={styles.stepLabel}>
                Agent Runner Executes Write
              </span>
              <div
                className={styles.resultCompact}
                style={{ opacity: 0.5, fontStyle: 'italic' }}
              >
                Success
              </div>
            </motion.div>

            {/* Substep 3: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL PREDICT</span>
              {activeSubstep >= 3 && (
                <motion.div
                  className={styles.thinkingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  Thinking: Code written, let me now execute it!
                </motion.div>
              )}
            </motion.div>

            {/* Substep 4: Bash tool call + result */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>
                Model Asks Agent Runner to Execute Code
              </span>
              <div className={styles.codeBlock}>
                <code>
                  Bash("python3
                  /tmp/get_txns_starbucks_transactions_last_month.py")
                </code>
              </div>
            </motion.div>
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>
                Agent Runner Executes Bash Command
              </span>
              {activeSubstep >= 5 && (
                <motion.div
                  className={styles.executesOutside}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.35 }}
                >
                  BASH TOOL EXECUTES CODE
                  <br />
                  STDOUT IS PIPED TO TOOL RESPONSE
                </motion.div>
              )}
              <div className={styles.resultCompact}>Total: £47.50</div>
            </motion.div>

            {/* Substep 6: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL PREDICT</span>
              {activeSubstep >= 6 && (
                <motion.div
                  className={styles.thinkingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  Thinking: Nice that worked! Let me tell the user.
                </motion.div>
              )}
            </motion.div>

            {/* Substep 7: Model response */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL RESPONSE</span>
              <div className={styles.messageBubble}>
                "You spent £47.50 on Starbucks over the last month"
              </div>
            </motion.div>
          </div>

          {/* Right: Context window */}
          <div className={styles.contextColumn}>
            <span className={styles.columnHeader}>Δ Context Window</span>
            <Wireframe
              accent={activeSubstep >= 7 ? 'forest' : undefined}
              className={styles.contextWindow}
            >
              {/* 1. User query */}
              <UserBlock>
                How much did I spend at Starbucks over the past month?
              </UserBlock>

              {/* Thinking 1 */}
              <ThinkingBlockContext visible={activeSubstep >= 1}>
                The get_transactions tool only has a time filter, but I also need to filter by merchant. Let me write some code to filter again by merchant.
              </ThinkingBlockContext>

              {/* 2. Write tool call */}
              <WriteBlock
                filename="get_txns_starbucks_transactions_last_month.py"
                content={CODE}
                language="python"
                tooltip="/tmp/get_txns_starbucks_transactions_last_month.py"
                visible={activeSubstep >= 2}
                response="SUCCESS"
              />

              {/* Thinking 2 */}
              <ThinkingBlockContext visible={activeSubstep >= 3}>
                Code written, let me now execute it!
              </ThinkingBlockContext>

              {/* 4-5. Bash tool call + response */}
              <BashBlock
                command="python3 /tmp/get_txns_starbucks_transactions_last_month.py"
                visible={activeSubstep >= 4}
                response={activeSubstep >= 5 ? 'Total: £47.50' : undefined}
              />

              {/* Thinking 3 */}
              <ThinkingBlockContext visible={activeSubstep >= 6}>
                Nice that worked! Let me tell the user.
              </ThinkingBlockContext>

              {/* 6. Model response */}
              <ModelBlock visible={activeSubstep >= 7}>
                You spent £47.50 on Starbucks over the last month
              </ModelBlock>


              {/* Context usage bar */}
              <ContextBar
                fill={activeSubstep >= 7 ? '8%' : '5%'}
                active={activeSubstep >= 7}
                accent="var(--accent-forest)"
              />
            </Wireframe>

            {/* Token cost */}
            <motion.div
              className={styles.tokenCost}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <Wireframe accent="forest" className={styles.tokenCostInner}>
                <span className={styles.tokenLabel}>TOKEN COST</span>
                <span className={styles.tokenValue}>&lt;1K</span>
              </Wireframe>
            </motion.div>
          </div>
        </div>

        {/* Bottom: Benefits row */}
        <motion.div
          className={styles.benefitsRow}
          animate={{
            opacity: activeSubstep >= 8 ? 1 : 0,
            y: activeSubstep >= 8 ? 0 : 20,
          }}
          transition={{ duration: 0.35 }}
        >
          <Wireframe accent="forest" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>No Context Pollution</span>
            <span className={styles.benefitDesc}>
              Raw data never enters context
            </span>
          </Wireframe>
          <Wireframe accent="forest" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>
              Guaranteed Accurate Math
            </span>
            <span className={styles.benefitDesc}>
              Code computes, not the model
            </span>
          </Wireframe>
          <Wireframe accent="forest" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Massive Token Savings</span>
            <span className={styles.benefitDesc}>
              Hundreds vs tens of thousands
            </span>
          </Wireframe>
        </motion.div>
        {/* Finder overlay */}
        <FinderOverlay
          files={activeSubstep >= 2 ? [{ name: 'get_txns_starbucks_transactions_last_month.py', content: CODE, language: 'python' }] : []}
          directoryPath="/tmp/"
        />
      </div>
    </Wireframe>
  );
}

export const notes = `With PTC, Claude writes and executes code outside the context window. Only the compact result — "£47.50 across 12 transactions" — enters context. This preserves context, guarantees accurate arithmetic, and saves the vast majority of tokens.`;
