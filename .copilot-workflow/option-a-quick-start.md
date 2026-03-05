# Option A: Quick Start (1-2 giờ)

**Recommended cho:** Bắt đầu nhanh, test concept, dự án nhỏ/vừa

## 🎯 Mục Tiêu

- Setup trong 1-2 giờ
- Sử dụng tools có sẵn
- Tận dụng GitHub Copilot native features
- Minimal maintenance

## 🛠️ Tools Sử Dụng

1. **GitHub Copilot** (built-in features)
   - Copilot Memory (tự động)
   - Repository Indexing (tự động)
   - Custom Instructions

2. **PRPM** (optional)
   - Cross-platform prompt registry
   - 7,500+ packages có sẵn

3. **Repopack** (optional)
   - Generate codebase snapshot

## 📋 Implementation Steps

### Step 1: Setup GitHub Copilot Instructions (30 phút)

**1.1. Tạo file `.github/copilot-instructions.md`**

```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

**1.2. Nội dung file:**

```markdown
# Project Context for GitHub Copilot

## Project Overview
[Tên dự án] - [Mô tả ngắn gọn về dự án]

## Tech Stack
- **Frontend**: [e.g., Next.js 15, React 19, TypeScript 5]
- **Backend**: [e.g., FastAPI, Python 3.12]
- **Database**: [e.g., PostgreSQL, Redis]
- **Infrastructure**: [e.g., Vercel, Cloud Run]

## Architecture
- **Deployment**: [e.g., Hybrid - Vercel (frontend) + Cloud Run (backend)]
- **File Organization**: [e.g., Feature-based]
- **Code Style**: [e.g., Many small files (200-400 lines, 800 max)]
- **Patterns**: [e.g., Immutable patterns enforced]

## Coding Standards

### Naming Conventions
- Variables/Functions: camelCase
- Components/Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case.ts or PascalCase.tsx (components)

### Code Quality
- **Immutability**: ALWAYS create new objects, NEVER mutate
- **File Size**: 200-400 lines typical, 800 max
- **Test Coverage**: 80%+ required
- **Error Handling**: Always use try-catch for async operations

### Testing
- Test files colocated with source
- Unit tests: Individual functions/components
- Integration tests: API endpoints, database operations
- E2E tests: Critical user flows

## Project Structure

### Entry Points
- Frontend: `src/app/page.tsx`
- Backend: `src/main.py` or `src/api/index.ts`
- Tests: `**/*.test.ts` or `**/*.spec.ts`

### Key Directories
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/api/` - API routes/endpoints
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/services/` - Business logic services
- `src/repositories/` - Data access layer

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
- [ ] TypeScript checks pass
- [ ] No linting errors

## Documentation

### Function Documentation (TSDoc)
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

## Important Notes

- **Trust these instructions** - Follow them exactly as written
- **Ask before major changes** - Clarify requirements if unclear
- **Keep context focused** - Only load what's needed for current task
- **Iterate incrementally** - Small changes are better than big rewrites
```

**1.3. Customize cho project của bạn:**
- Thay thế placeholders với thông tin thực tế
- Add/remove sections theo nhu cầu
- Keep it under 1000 lines để tránh context bloat

### Step 2: Setup Path-Specific Instructions (20 phút)

**2.1. Tạo instructions cho API routes:**

```bash
mkdir -p .github/instructions
touch .github/instructions/api.instructions.md
```

**Nội dung:**
```markdown
---
applyTo: "src/api/**/*.ts"
---

# API Development Guidelines

## Request Validation
- Use Zod for all input validation
- Validate at route handler level
- Return 400 for validation errors

## Response Format
- Always use ApiResponse<T> interface
- Include proper HTTP status codes
- Add pagination meta for list endpoints

## Error Handling
- Use try-catch for all async operations
- Log errors with context
- Never expose internal errors to client
- Return user-friendly error messages

## Security
- Rate limit all endpoints
- Validate authentication tokens
- Check authorization for protected routes
- Sanitize all user inputs

## Example
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = apiSchema.parse(body)

    const result = await service.create(validated)

    return Response.json({
      success: true,
      data: result
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: 'Validation failed'
      }, { status: 400 })
    }

    console.error('API error:', error)
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
```
```

**2.2. Tạo instructions cho React components:**

```bash
touch .github/instructions/components.instructions.md
```

**Nội dung:**
```markdown
---
applyTo: "src/components/**/*.tsx"
---

# React Component Guidelines

## Component Structure
- Use functional components with hooks
- Export as default
- Props interface above component
- Hooks at top of component
- Helper functions below component

## Naming
- PascalCase for component names
- camelCase for props
- Prefix event handlers with 'handle'
- Prefix boolean props with 'is' or 'has'

## Props Documentation
```typescript
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode
  /** Click event handler */
  onClick?: () => void
  /** Button variant style */
  variant?: 'primary' | 'secondary'
  /** Disable button interaction */
  disabled?: boolean
}
```

## Example Component
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch])

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
    />
  )
}
```
```

### Step 3: Install PRPM (Optional, 15 phút)

**3.1. Install PRPM:**
```bash
npm install -g prpm
```

**3.2. Browse available packages:**
```bash
# Search for relevant packages
prpm search nextjs
prpm search react
prpm search typescript
```

**3.3. Install collections:**
```bash
# For Next.js projects
prpm install collections/nextjs-pro

# For React + TypeScript
prpm install collections/react-typescript

# For specific frameworks
prpm install rules/tailwind-best-practices
prpm install rules/typescript-strict
```

**3.4. Verify installation:**
```bash
# Check installed rules
ls -la .cursor/rules/
# or
ls -la .github/copilot/
```

### Step 4: Generate Codebase Snapshot (Optional, 15 phút)

**4.1. Install Repopack:**
```bash
npx repopack
# or
npm install -g repopack
```

**4.2. Generate snapshot:**
```bash
# Generate XML format (best for Claude/Copilot)
repomix --output .copilot/snapshot.xml --style xml

# Generate Markdown format
repomix --output .copilot/snapshot.md --style markdown
```

**4.3. Add to .gitignore:**
```bash
echo ".copilot/snapshot.*" >> .gitignore
```

**4.4. Create update script:**

```bash
mkdir -p scripts
cat > scripts/update-snapshot.sh << 'EOF'
#!/bin/bash
echo "Updating codebase snapshot..."
repomix --output .copilot/snapshot.xml --style xml
echo "Snapshot updated: .copilot/snapshot.xml"
EOF

chmod +x scripts/update-snapshot.sh
```

**4.5. Add to package.json:**
```json
{
  "scripts": {
    "copilot:snapshot": "bash scripts/update-snapshot.sh"
  }
}
```

### Step 5: Test với GitHub Copilot (20 phút)

**5.1. Open VS Code với Copilot enabled**

**5.2. Test context loading:**
```typescript
// In a new file, type:
// "Create a new API endpoint for user authentication"
// Copilot should suggest code following your patterns
```

**5.3. Test với @workspace:**
```
In Copilot Chat:
@workspace How is authentication implemented in this project?
@workspace Show me all API endpoints
@workspace Find the user repository pattern
```

**5.4. Test path-specific instructions:**
```typescript
// In src/api/test.ts
// Type: "Create POST endpoint"
// Should follow API guidelines from api.instructions.md
```

**5.5. Verify Copilot Memory:**
```
In Copilot Chat:
What tech stack does this project use?
What are the coding standards?
What patterns should I follow for API responses?
```

## ✅ Verification Checklist

- [ ] `.github/copilot-instructions.md` created and customized
- [ ] Path-specific instructions created (api, components)
- [ ] PRPM installed and rules loaded (optional)
- [ ] Repopack snapshot generated (optional)
- [ ] Tested with Copilot Chat using @workspace
- [ ] Verified Copilot follows your patterns
- [ ] Copilot Memory working (remembers context)

## 📊 Expected Results

### Before:
- Copilot suggests generic code
- Doesn't follow project patterns
- Needs repeated context
- Inconsistent style

### After:
- Copilot follows your patterns
- Respects coding standards
- Remembers project context
- Consistent suggestions

## 🔧 Troubleshooting

### Copilot không đọc instructions:
1. Check file path: `.github/copilot-instructions.md`
2. Restart VS Code
3. Clear Copilot cache: `Cmd+Shift+P` → "Copilot: Clear Cache"

### Suggestions vẫn không đúng pattern:
1. Make instructions more explicit
2. Add more examples
3. Use "Trust these instructions" phrase
4. Close unrelated files

### Context window đầy:
1. Close unnecessary files
2. Use @workspace instead of opening many files
3. Reference symbols by name
4. Start new chat thread

## 🚀 Next Steps

### If Option A works well:
- Continue using as-is
- Update instructions as project evolves
- Share with team

### If need more features:
- Upgrade to [Option B - Hybrid Approach](./option-b-hybrid.md)
- Add automation scripts
- Implement semantic search

### If need full control:
- Consider [Option C - Custom Build](./option-c-custom-build.md)
- Build custom tooling
- Full customization

## 📚 Resources

- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [PRPM Registry](https://prpm.ai)
- [Repopack Documentation](https://github.com/yamadashy/repopack)
- [Cursor Directory](https://cursor.directory)

## 💡 Tips

1. **Start simple** - Don't over-engineer instructions
2. **Iterate** - Update based on Copilot behavior
3. **Be specific** - Vague instructions = vague suggestions
4. **Use examples** - Show don't tell
5. **Keep focused** - One concern per instruction file
6. **Test regularly** - Verify Copilot follows patterns
7. **Share with team** - Consistent experience for everyone

## ⏱️ Time Investment

- Initial setup: 1-2 giờ
- Maintenance: 15-30 phút/tuần (update instructions)
- ROI: Immediate (better suggestions from day 1)
