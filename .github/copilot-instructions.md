# Project Context for GitHub Copilot

## Project Overview

**github_test** - A fullstack project with automated GitHub Copilot workflow integration.

This project includes a sophisticated context management system in `.copilot/` that automatically discovers project structure, generates documentation, and maintains up-to-date context for AI assistants.

## Tech Stack

- **Language**: JavaScript/TypeScript, Python, Go, Rust, Java, PHP (multi-language support)
- **Tools**: Node.js, Babel Parser, AST analysis
- **Automation**: Nodemon for file watching, Repopack for snapshots
- **Context Management**: Custom discovery and documentation generation scripts

## Architecture

- **Deployment**: Local development with automated context updates
- **File Organization**: Feature-based with automated discovery
- **Code Style**: Many small files (200-400 lines, 800 max)
- **Patterns**: Immutable patterns enforced
- **Context Layers**:
  - Project level: 10,000 tokens
  - Feature level: 30,000 tokens
  - Task level: 60,000 tokens

## Coding Standards

### Naming Conventions
- Variables/Functions: camelCase
- Components/Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case.js or PascalCase.tsx (components)

### Code Quality
- **Immutability**: ALWAYS create new objects, NEVER mutate
  ```javascript
  // WRONG: Mutation
  function updateUser(user, name) {
    user.name = name  // MUTATION!
    return user
  }

  // CORRECT: Immutability
  function updateUser(user, name) {
    return {
      ...user,
      name
    }
  }
  ```
- **File Size**: 200-400 lines typical, 800 max
- **Test Coverage**: 80%+ required
- **Error Handling**: Always use try-catch for async operations
- **No console.log**: Remove before committing
- **No hardcoded values**: Use environment variables or constants

### Testing Requirements

All code must include:
- **Unit tests**: Individual functions/components
- **Integration tests**: API endpoints, database operations
- **E2E tests**: Critical user flows (Playwright)

Test-Driven Development (TDD) workflow:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

Test files colocated with source:
- `**/*.test.ts` or `**/*.test.js`
- `**/*.spec.ts` or `**/*.spec.js`

## Project Structure

### Root Directory
```
/home/linh/app/github_test/
├── .copilot/              # Context management system
│   ├── scripts/           # Discovery and documentation scripts
│   ├── docs/              # Generated documentation
│   ├── cache/             # Context cache
│   └── config.json        # Configuration
├── .copilot-workflow/     # Workflow templates and guides
├── .github/               # GitHub configuration
└── .claude/               # Claude-specific rules
```

### Key Directories
- `.copilot/scripts/` - Automation scripts for context management
  - `discover.js` - Project structure discovery
  - `generate-docs.js` - Documentation generation
  - `update-context.js` - Context updates
- `.copilot/docs/` - Generated documentation
  - `architecture/` - Architecture diagrams
  - `codemaps/` - Code structure maps
- `.copilot-workflow/` - Workflow templates
  - `option-a-quick-start.md` - Quick start guide
  - `option-b-hybrid.md` - Hybrid approach
  - `option-c-custom-build.md` - Custom build guide

### Entry Points
- Context scripts: `.copilot/scripts/*.js`
- Configuration: `.copilot/config.json`

## Common Patterns

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### Repository Pattern
```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### Custom Hooks Pattern
```typescript
// Always start with 'use' prefix
// Return object with clear property names
// Handle cleanup in useEffect
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Error Handling Pattern
```javascript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Input Validation Pattern
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

## Context Loading Strategy

### Before Starting Any Task:
1. **Read this file** for project overview
2. **Use `@workspace`** to find relevant files semantically
3. **Load only necessary context** - close unrelated files
4. **Reference symbols by name** instead of loading entire files

### For Feature Development:
1. Check existing patterns in similar features
2. Load relevant module files only
3. Check tests for usage examples
4. Follow established patterns

### For Bug Fixes:
1. Locate the bug using `@workspace` search
2. Load the problematic file + direct dependencies
3. Check related tests
4. Verify fix doesn't break other features

### For Refactoring:
1. Understand current structure first
2. Check all usages before changing
3. Update tests alongside code
4. Verify no breaking changes

### Context Management System:
- The `.copilot/` directory contains automated context management
- Run `npm run discover` to scan project structure
- Run `npm run generate` to create documentation
- Run `npm run update` to refresh context
- Run `npm run snapshot` to generate codebase snapshot

## Security Guidelines

### Always Check:
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized HTML)
- [ ] CSRF protection enabled
- [ ] Authentication/authorization verified
- [ ] Rate limiting on endpoints
- [ ] Error messages don't leak sensitive data

### Secret Management
```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables
const apiKey = process.env.API_KEY
if (!apiKey) {
  throw new Error('API_KEY not configured')
}
```

### Security Response Protocol
If security issue found:
1. STOP immediately
2. Fix CRITICAL issues before continuing
3. Rotate any exposed secrets
4. Review entire codebase for similar issues

## Git Workflow

### Commit Message Format
```
<type>: <description>

<optional body>
```

**Types:** feat, fix, refactor, docs, test, chore, perf, ci

### Before Committing:
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Code formatted (Prettier)
- [ ] TypeScript checks pass (if applicable)
- [ ] No linting errors
- [ ] 80%+ test coverage

### Pull Request Workflow:
1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

## Documentation

### Function Documentation (JSDoc/TSDoc)
```typescript
/**
 * Authenticates user credentials and returns JWT token.
 *
 * @param email - User email address
 * @param password - Plain text password
 * @returns JWT token and user data
 * @throws {ValidationError} If email format is invalid
 * @throws {AuthenticationError} If credentials are incorrect
 *
 * @example
 * ```typescript
 * const result = await authenticateUser('user@example.com', 'password123')
 * console.log(result.token)
 * ```
 */
```

### File Documentation
- Add file-level comments explaining purpose
- Document complex algorithms
- Explain non-obvious decisions
- Link to related files/documentation

## Performance Optimization

### Model Selection Strategy
- **Haiku 4.5**: Lightweight tasks, frequent invocation (90% of Sonnet capability, 3x cost savings)
- **Sonnet 4.5**: Main development work, complex coding tasks
- **Opus 4.5**: Complex architectural decisions, maximum reasoning

### Context Window Management
- Avoid last 20% of context window for large-scale refactoring
- Use lower context sensitivity for single-file edits
- Close unrelated files to preserve context space

## Agent Orchestration

### Available Agents (in ~/.claude/agents/):
- **planner**: Implementation planning for complex features
- **architect**: System design and architectural decisions
- **tdd-guide**: Test-driven development enforcement
- **code-reviewer**: Code review after writing code
- **security-reviewer**: Security analysis before commits
- **build-error-resolver**: Fix build errors
- **e2e-runner**: E2E testing with Playwright
- **refactor-cleaner**: Dead code cleanup
- **doc-updater**: Documentation updates

### When to Use Agents:
- Complex feature requests → Use **planner** agent
- Code just written/modified → Use **code-reviewer** agent
- Bug fix or new feature → Use **tdd-guide** agent
- Architectural decision → Use **architect** agent

## Important Notes

- **Trust these instructions** - Follow them exactly as written
- **Ask before major changes** - Clarify requirements if unclear
- **Keep context focused** - Only load what's needed for current task
- **Iterate incrementally** - Small changes are better than big rewrites
- **Use the context system** - Leverage `.copilot/` automation
- **Write tests first** - Follow TDD workflow strictly
- **No mutations** - Always use immutable patterns
- **Security first** - Check security guidelines before committing

## Workflow Integration

This project uses a sophisticated context management system:

1. **Discovery**: Automatically scans project structure
2. **Documentation**: Generates up-to-date docs
3. **Context Updates**: Watches for changes and updates context
4. **Snapshots**: Creates codebase snapshots for AI assistants

Run these commands in `.copilot/` directory:
- `npm run discover` - Scan project structure
- `npm run generate` - Generate documentation
- `npm run update` - Update context
- `npm run snapshot` - Create codebase snapshot
- `npm run watch` - Watch for changes (auto-update)

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] No mutation (immutable patterns used)
- [ ] Tests written and passing (80%+ coverage)
- [ ] Security guidelines followed
- [ ] Documentation updated

## Tips for GitHub Copilot

1. **Start simple** - Don't over-engineer solutions
2. **Iterate** - Build incrementally
3. **Be specific** - Clear requirements = better suggestions
4. **Use examples** - Show patterns from this file
5. **Keep focused** - One concern at a time
6. **Test regularly** - Verify code works as expected
7. **Follow patterns** - Consistency across codebase
8. **Security first** - Never compromise on security
9. **Immutability always** - No mutations allowed
10. **TDD workflow** - Tests before implementation
