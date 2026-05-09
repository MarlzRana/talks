import { motion } from 'motion/react';
import { Wireframe } from '@/components/paper';
import { FinderOverlay, ContextBar, WriteBlock, BashBlock, UserBlock, ThinkingBlockContext, ModelBlock } from '../components';
import styles from './04-with-ptc.module.css';

export const fullbleed = true;
export const substeps = 10;

const CODE = `from mcp.bank import get_transactions
txns = get_transactions("last_month")
txns_starbucks = [t for t in txns if t.merchant == "Starbucks"]
total = {sum(t.amount for t in txns_starbucks)}
print("Total: £" + total)`;

export default function WithPtcSlide({
  activeSubstep = 0,
}: {
  activeSubstep?: number;
}) {
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
            <UserBlock>
              "How much did I spend at Starbucks over the past month?"
            </UserBlock>

            {/* Substep 1: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <ThinkingBlockContext label="MODEL PREDICT" visible={activeSubstep >= 1}>
              Thinking: The get_transactions tool only has a time filter, but I also need to filter by merchant. Let me write some code to filter again by merchant.
            </ThinkingBlockContext>

            {/* Substep 2: Write + response */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <WriteBlock
              explainer="Model Asks Agent Runner to Write Below Code"
              filename="get_txns_starbucks_transactions_last_month.py"
              content={CODE}
              language="python"
              tooltip="/tmp/get_txns_starbucks_transactions_last_month.py"
              visible={activeSubstep >= 2}
            />

            {/* Substep 3: Write tool response */}
            <WriteBlock
              explainer="Agent runner writes code to requested location, returns result to model's context"
              visible={activeSubstep >= 3}
              response="SUCCESS"
            />

            {/* Substep 4: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <ThinkingBlockContext label="MODEL PREDICT" visible={activeSubstep >= 4}>
              Thinking: Code written, let me now execute it!
            </ThinkingBlockContext>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Substep 5: Bash tool call */}
            <BashBlock
              explainer="Model Asks Agent Runner to Execute Code"
              command='python3 /tmp/get_txns_starbucks_transactions_last_month.py'
              visible={activeSubstep >= 5}
            />

            {/* Substep 6: Bash tool response */}
            <BashBlock
              explainer="Agent runner executes bash command, pipes stdout to model's context"
              visible={activeSubstep >= 6}
              response="Total: £47.50"
            />

            {/* Substep 7: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <ThinkingBlockContext label="MODEL PREDICT" visible={activeSubstep >= 7}>
              Thinking: Nice that worked! Let me tell the user.
            </ThinkingBlockContext>

            {/* Substep 8: Model response */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 8 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <ModelBlock label="Model Response" visible={activeSubstep >= 8}>
              "You spent £47.50 on Starbucks over the last month"
            </ModelBlock>
          </div>

          {/* Right: Context window */}
          <div className={styles.contextColumn}>
            <span className={styles.columnHeader}>Δ Context Window</span>
            <Wireframe
              accent={activeSubstep >= 8 ? 'forest' : undefined}
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
                response={activeSubstep >= 3 ? 'SUCCESS' : undefined}
              />

              {/* Thinking 2 */}
              <ThinkingBlockContext visible={activeSubstep >= 4}>
                Code written, let me now execute it!
              </ThinkingBlockContext>

              {/* 5-6. Bash tool call + response */}
              <BashBlock
                command="python3 /tmp/get_txns_starbucks_transactions_last_month.py"
                visible={activeSubstep >= 5}
                response={activeSubstep >= 6 ? 'Total: £47.50' : undefined}
              />

              {/* Thinking 3 */}
              <ThinkingBlockContext visible={activeSubstep >= 7}>
                Nice that worked! Let me tell the user.
              </ThinkingBlockContext>

              {/* Model response */}
              <ModelBlock visible={activeSubstep >= 8}>
                You spent £47.50 on Starbucks over the last month
              </ModelBlock>

              {/* Context usage bar */}
              <ContextBar
                fill={activeSubstep >= 8 ? '8%' : '5%'}
                active={activeSubstep >= 8}
                accent="var(--accent-forest)"
              />
            </Wireframe>

            {/* Token cost */}
            <motion.div
              className={styles.tokenCost}
              animate={{ opacity: activeSubstep >= 8 ? 1 : 0 }}
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
            opacity: activeSubstep >= 9 ? 1 : 0,
            y: activeSubstep >= 9 ? 0 : 20,
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
          files={activeSubstep >= 3 ? [{ name: 'get_txns_starbucks_transactions_last_month.py', content: CODE, language: 'python' }] : []}
          directoryPath="/tmp/"
        />
      </div>
    </Wireframe>
  );
}

export const notes = `With PTC, Claude writes and executes code outside the context window. Only the compact result — "£47.50 across 12 transactions" — enters context. This preserves context, guarantees accurate arithmetic, and saves the vast majority of tokens.`;
