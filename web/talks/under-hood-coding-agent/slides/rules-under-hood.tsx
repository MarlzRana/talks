import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UserBlock, ReadBlock, WriteBlock } from '../components/context-window'
import styles from './skills-under-hood.module.css'

export const fullbleed = true
export const substeps = 5

// Rule file content
const JAVA_MD = `# Java Conventions

- Use Spring Boot patterns for service classes
- Follow Google Java Style Guide
- Prefer constructor injection over field injection
- Use Optional<T> instead of null returns
- All public methods must have Javadoc`

const JAVA_TEST_MD = `---
globs: **/*Test.java
---

# Java Testing Rules

- Use JUnit 5 (@Test, @BeforeEach, @DisplayName)
- Mock dependencies with Mockito (@Mock, @InjectMocks)
- One logical assertion per test method
- Use @DisplayName with descriptive sentences
- Arrange / Act / Assert structure in every test
- Test edge cases: null inputs, empty collections, boundaries`

const JAVA_TEST_BODY = `# Java Testing Rules

- Use JUnit 5 (@Test, @BeforeEach, @DisplayName)
- Mock dependencies with Mockito (@Mock, @InjectMocks)
- One logical assertion per test method
- Use @DisplayName with descriptive sentences
- Arrange / Act / Assert structure in every test
- Test edge cases: null inputs, empty collections, boundaries`

const CUSTOMER_SERVICE_CONTENT = `public class CustomerService {
    private final CustomerRepository repository;
    private final NotificationService notifications;

    public CustomerService(CustomerRepository repository,
                          NotificationService notifications) {
        this.repository = repository;
        this.notifications = notifications;
    }

    public Optional<Customer> findById(Long id) {
        return repository.findById(id);
    }

    public Customer create(CreateCustomerRequest request) {
        Customer customer = new Customer(request.name(), request.email());
        Customer saved = repository.save(customer);
        notifications.sendWelcome(saved);
        return saved;
    }
}`

const TEST_CONTENT = `@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock private CustomerRepository repository;
    @Mock private NotificationService notifications;
    @InjectMocks private CustomerService service;

    @Test
    @DisplayName("findById returns customer when exists")
    void findById_returnsCustomer() {
        // Arrange
        Customer expected = new Customer("Alice", "alice@test.com");
        when(repository.findById(1L)).thenReturn(Optional.of(expected));

        // Act
        Optional<Customer> result = service.findById(1L);

        // Assert
        assertThat(result).contains(expected);
    }

    @Test
    @DisplayName("create saves and sends welcome notification")
    void create_savesAndNotifies() {
        // Arrange
        var request = new CreateCustomerRequest("Bob", "bob@test.com");
        var saved = new Customer("Bob", "bob@test.com");
        when(repository.save(any())).thenReturn(saved);

        // Act
        Customer result = service.create(request);

        // Assert
        assertThat(result.name()).isEqualTo("Bob");
        verify(notifications).sendWelcome(saved);
    }
}`

interface FileEntry {
  name: string
  content: string
  language: string
}

const FILES: FileEntry[] = [
  { name: 'java.md', content: JAVA_MD, language: 'markdown' },
  { name: 'java-test.md', content: JAVA_TEST_MD, language: 'markdown' },
]

function HighlightedFile({ code }: { code: string }) {
  return <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, color: 'var(--ink-on-dark-1)', whiteSpace: 'pre-wrap' }}>{code}</pre>
}

export default function RulesUnderHoodSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [openFile, setOpenFile] = useState<FileEntry | null>(null)

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleBar}>
        <span className={styles.eyebrow}>Progressive Disclosure</span>
        <h1 className={styles.slideTitle}>Rules</h1>
      </div>

      {/* Left: Finder window showing rules */}
      <div className={styles.finderArea}>
        <div className={styles.finderWindow}>
          <div className={styles.finderTitleBar}>
            <span className={`${styles.finderDot} ${styles.finderDotRed}`} />
            <span className={`${styles.finderDot} ${styles.finderDotYellow}`} />
            <span className={`${styles.finderDot} ${styles.finderDotGreen}`} />
            <span className={styles.finderPath}>.claude/rules/</span>
          </div>
          <div className={styles.finderBody}>
            <div
              className={styles.finderItem}
              onClick={() => setOpenFile(FILES[0]!)}
            >
              <span className={styles.finderIcon}>📄</span> java.md
            </div>
            <div
              className={styles.finderItem}
              onClick={() => setOpenFile(FILES[1]!)}
            >
              <span className={styles.finderIcon}>📄</span> java-test.md
            </div>
          </div>
        </div>
      </div>

      {/* Right: Agent Runtime */}
      <div className={styles.runtimeArea}>
        <div className={styles.runtimeHeader}>AGENT RUNTIME</div>
        <div className={styles.runtimeBlocks}>
          <UserBlock visible={activeSubstep >= 1}>
            Write unit tests for the Customer Service
          </UserBlock>

          <ReadBlock
            filename="CustomerService.java"
            visible={activeSubstep >= 2}
            content={CUSTOMER_SERVICE_CONTENT}
            language="java"
            systemReminder={{
              label: 'java-test.md injected (glob match: **/*Test.java)',
              content: JAVA_TEST_BODY,
            }}
            showSystemReminder={activeSubstep >= 3}
          />

          <WriteBlock
            filename="CustomerServiceTest.java"
            visible={activeSubstep >= 4}
            content={TEST_CONTENT}
            language="java"
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
                <HighlightedFile code={openFile.content} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const notes = `This slide demonstrates how rules work under the hood.
Left: The .claude/rules/ directory (interactive — click to view files).
Right: Agent runtime showing a glob-triggered rule injection.

Key point: java.md is always loaded (no glob), but java-test.md has
a glob of **/*Test.java — it only gets injected when the agent
reads or writes a file matching that pattern.

Flow:
1. User asks to write tests
2. Agent reads CustomerService.java
3. System injects java-test.md (glob matched *Test.java write target)
4. Agent writes test following the injected rules`
