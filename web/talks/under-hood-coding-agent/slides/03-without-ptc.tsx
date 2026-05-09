import { motion } from 'motion/react';
import { Wireframe } from '@/components/paper';
import {
  AgentFlowLayout,
  FlowStep,
  FlowConnector,
  ThinkingBlock,
  CommentaryBlock,
  ContextBar,
  BottomCards,
  BashBlock,
  UserBlock,
  ThinkingBlockContext,
  ModelBlock,
  styles,
} from '../components';
import localStyles from './03-without-ptc.module.css';

export const fullbleed = true;
export const substeps = 9;

interface Transaction {
  merchant: string;
  amount: string;
  isStarbucks: boolean;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { merchant: 'Tesco', amount: '£32.10', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£4.50', isStarbucks: true },
  { merchant: 'Amazon', amount: '£15.99', isStarbucks: false },
  { merchant: 'TfL', amount: '£2.80', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£3.80', isStarbucks: true },
  { merchant: 'Starbucks', amount: '£3.95', isStarbucks: true },
  { merchant: 'Sainsburys', amount: '£23.60', isStarbucks: false },
  { merchant: 'Shell', amount: '£54.20', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£5.20', isStarbucks: true },
  { merchant: 'Waitrose', amount: '£41.30', isStarbucks: false },
  { merchant: 'Deliveroo', amount: '£28.45', isStarbucks: false },
  { merchant: 'John Lewis', amount: '£89.00', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£4.15', isStarbucks: true },
];

const PROBLEMS = [
  { title: 'Context Pollution', desc: '150 raw transactions in context' },
  { title: 'Unreliable Math', desc: 'Model may miscalculate' },
  { title: 'High Token Cost', desc: 'Tens of thousands of tokens consumed' },
];

export default function WithoutPtcSlide({
  activeSubstep = 0,
}: {
  activeSubstep?: number;
}) {
  return (
    <AgentFlowLayout
      eyebrow="Traditional Flow"
      title="Without Programmatic Tool Calling"
      accent="crimson"
      bottom={
        <BottomCards
          accent="crimson"
          visible={activeSubstep >= 8}
          cards={PROBLEMS}
        />
      }
    >
      <AgentFlowLayout.Runtime>
        {/* Substep 0: User question */}
        <FlowStep label="USER">
          <div className={styles.messageBubble}>
            "How much did I spend at Starbucks over the past month?"
          </div>
        </FlowStep>

        {/* Substep 1: Model predict */}
        <FlowConnector visible={activeSubstep >= 1} />
        <FlowStep label="MODEL PREDICT" visible={activeSubstep >= 1}>
          <ThinkingBlock visible={activeSubstep >= 1}>
            Thinking: I need to get the user's transactions from last month.
          </ThinkingBlock>
        </FlowStep>

        {/* Substep 2: Tool call */}
        <FlowConnector visible={activeSubstep >= 2} />
        <FlowStep
          label="Model asks agent runner to call get_transactions"
          visible={activeSubstep >= 2}
        >
          <div className={styles.codeBlock}>
            <code>get_transactions(period="last_month")</code>
          </div>
        </FlowStep>

        {/* Substep 3: Tool result */}
        <FlowConnector visible={activeSubstep >= 3} />
        <FlowStep
          label="Agent Runner Executes Get_Transactions"
          visible={activeSubstep >= 3}
        >
          <div className={styles.resultCompact}>150 transactions returned</div>
        </FlowStep>

        {/* Substep 4-6: Model predict with progressive thinking */}
        <FlowConnector visible={activeSubstep >= 4} />
        <FlowStep label="MODEL PREDICT" visible={activeSubstep >= 4}>
          <ThinkingBlock visible={activeSubstep >= 4}>
            Thinking: OK I have all 150 transactions. Let me find the Starbucks
            ones...
          </ThinkingBlock>
          <ThinkingBlock visible={activeSubstep >= 5}>
            Found them. Now let me add them up... 4.50 + 3.80 + 5.20 + 3.95 +
            4.15...
          </ThinkingBlock>
          <CommentaryBlock visible={activeSubstep >= 6}>
            Models are not good at scanning, filtering and math
          </CommentaryBlock>
        </FlowStep>

        {/* Substep 7: Model response (wrong) */}
        <FlowConnector visible={activeSubstep >= 7} />
        <FlowStep label="MODEL RESPONSE" visible={activeSubstep >= 7}>
          <div className={styles.messageBubble}>
            "You spent £46.80 on Starbucks over the last month"
          </div>
        </FlowStep>
      </AgentFlowLayout.Runtime>

      <AgentFlowLayout.Context>
        <Wireframe
          accent={activeSubstep >= 3 ? 'crimson' : undefined}
          className={styles.contextWindow}
        >
          {/* User query */}
          <UserBlock>
            How much did I spend at Starbucks over the past month?
          </UserBlock>

          {/* Thinking 1 */}
          <ThinkingBlockContext visible={activeSubstep >= 1}>
            I need to get the user's transactions from last month.
          </ThinkingBlockContext>

          {/* Tool call + response */}
          <BashBlock
            command='get_transactions(period="last_month")'
            visible={activeSubstep >= 2}
            response={
              activeSubstep >= 3 ? (
                <div className={localStyles.transactionFlood}>
                  {SAMPLE_TRANSACTIONS.map((txn, i) => (
                    <div
                      key={i}
                      className={`${localStyles.txnRow} ${
                        activeSubstep >= 4 && txn.isStarbucks
                          ? localStyles.txnHighlight
                          : ''
                      }`}
                    >
                      <span>{txn.merchant}</span>
                      <span>{txn.amount}</span>
                    </div>
                  ))}
                  <div className={localStyles.txnEllipsis}>
                    ... 137 more rows
                  </div>
                </div>
              ) : undefined
            }
          />

          {/* Thinking 2 - scanning */}
          <ThinkingBlockContext visible={activeSubstep >= 4}>
            OK I have all 150 transactions. Let me find the Starbucks ones...
          </ThinkingBlockContext>

          {/* Thinking 2 continued - summing */}
          <ThinkingBlockContext visible={activeSubstep >= 5}>
            Found them. Now let me add them up... 4.50 + 3.80 + 5.20 + 3.95 +
            4.15...
          </ThinkingBlockContext>

          {/* Wrong assistant response */}
          <ModelBlock visible={activeSubstep >= 7}>
            You spent £46.80 on Starbucks over the last month
          </ModelBlock>

          {/* Context usage bar */}
          <ContextBar
            fill={
              activeSubstep >= 3 ? '85%' : activeSubstep >= 1 ? '10%' : '5%'
            }
            active={activeSubstep >= 3}
          />
        </Wireframe>

        {/* Token cost */}
        <motion.div
          className={styles.tokenCost}
          animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <Wireframe accent="crimson" className={styles.tokenCostInner}>
            <span className={styles.tokenLabel}>TOKEN COST</span>
            <span className={styles.tokenValue}>10K+</span>
          </Wireframe>
        </motion.div>
      </AgentFlowLayout.Context>
    </AgentFlowLayout>
  );
}

export const notes = `This slide shows the traditional approach without PTC. All 150 transactions flood into the context window, consuming tens of thousands of tokens. The model must manually scan and sum — error-prone and expensive. It gets the answer wrong.`;
