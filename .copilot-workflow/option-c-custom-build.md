# Option C: Custom Build (1-2 tuần)

**Recommended cho:** Dự án có requirements đặc biệt, muốn full control, contribute back to community

## 🎯 Mục Tiêu

- Build hệ thống hoàn toàn custom
- Full control mọi aspect
- Tối ưu cho use case cụ thể
- Có thể open source sau này

## ⚠️ Cảnh Báo

**Chỉ chọn option này nếu:**
- Option A và B không đáp ứng được
- Có thời gian development (1-2 tuần)
- Có kinh nghiệm với AST parsing, embeddings
- Muốn học sâu về codebase analysis
- Plan contribute back to community

**Không nên chọn nếu:**
- Cần solution nhanh
- Chưa thử Option A/B
- Không có thời gian maintain
- Chỉ cần basic features

## 🛠️ Architecture (Từ Planner Agent)

Đây là implementation plan chi tiết từ planner agent. Xem full plan tại research summary.

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    COPILOT PROMPT WORKFLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   DISCOVERY  │───▶│   INDEXING   │───▶│  RETRIEVAL   │      │
│  │    PHASE     │    │    PHASE     │    │    PHASE     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │              │
│         └────────────────────┴────────────────────┘              │
│                              │                                   │
│                              ▼                                   │
│                    ┌──────────────────┐                         │
│                    │  EXECUTION PHASE │                         │
│                    └──────────────────┘                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
.copilot/
├── config.json                    # Configuration
├── discovery/
│   ├── project-metadata.json
│   ├── tech-stack.json
│   ├── directory-map.json
│   └── entry-points.json
├── index/
│   ├── codemaps/
│   │   ├── frontend-map.json
│   │   ├── backend-map.json
│   │   └── shared-map.json
│   ├── patterns/
│   │   ├── component-patterns.json
│   │   ├── hook-patterns.json
│   │   ├── api-patterns.json
│   │   └── data-patterns.json
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── data-flow.md
│   │   └── integration-points.md
│   └── symbols/
│       ├── symbol-registry.json
│       └── cross-references.json
├── prompts/
│   ├── project-level/
│   │   ├── 00-base-context.md
│   │   ├── 01-conventions.md
│   │   └── 02-patterns.md
│   ├── feature-level/
│   │   ├── auth/
│   │   ├── api/
│   │   └── ui/
│   └── task-level/
│       └── templates/
├── scripts/
│   ├── discover.js
│   ├── generate-docs.js
│   ├── update-context.js
│   └── utils/
│       ├── ast-parser.js
│       ├── dep-graph.js
│       └── context-selector.js
├── cache/
│   └── context-snapshots/
└── logs/
    ├── discovery.log
    └── indexing.log
```

## 📋 Implementation Phases

### Phase 1: Foundation Setup (2-3 ngày)

#### 1.1. Directory Structure
```bash
mkdir -p .copilot/{discovery,index/{codemaps,patterns,architecture,symbols},prompts/{project-level,feature-level,task-level/templates},scripts/utils,cache/context-snapshots,logs}
```

#### 1.2. Configuration File

**File: `.copilot/config.json`**
```json
{
  "scan": {
    "ignore": ["node_modules", "dist", "build", ".git"],
    "extensions": [".js", ".ts", ".jsx", ".tsx", ".py", ".go"],
    "maxFileSize": 100000
  },
  "documentation": {
    "outputDir": ".copilot/docs",
    "codemapDir": ".copilot/docs/CODEMAPS",
    "updateOnChange": true
  },
  "prompts": {
    "templateDir": ".copilot/prompts"
  },
  "context": {
    "maxTokens": 128000,
    "layers": {
      "project": 10000,
      "feature": 30000,
      "task": 70000,
      "responseBuffer": 18000
    }
  }
}
```

#### 1.3. Package Dependencies

**File: `.copilot/package.json`**
```json
{
  "name": "copilot-workflow-custom",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "discover": "node scripts/discover.js",
    "index": "node scripts/generate-docs.js",
    "update": "node scripts/update-context.js",
    "cli": "node scripts/cli.js",
    "test": "jest"
  },
  "dependencies": {
    "@babel/parser": "^7.24.0",
    "@babel/traverse": "^7.24.0",
    "glob": "^10.3.10",
    "gray-matter": "^4.0.3",
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.1",
    "chokidar": "^3.6.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### Phase 2: Discovery & Analysis (3-4 ngày)

#### 2.1. Codebase Scanner

**File: `.copilot/scripts/discover.js`**

Implement scanner để:
- Traverse directory tree
- Identify file types và modules
- Extract imports/exports
- Detect framework patterns
- Build dependency graph

**Key Features:**
```javascript
class CodebaseScanner {
  async scan() {
    // 1. Find all files
    const files = await this.findFiles();

    // 2. Parse each file
    const parsed = await this.parseFiles(files);

    // 3. Extract metadata
    const metadata = this.extractMetadata(parsed);

    // 4. Build dependency graph
    const depGraph = this.buildDependencyGraph(parsed);

    return { files, metadata, depGraph };
  }
}
```

#### 2.2. AST Parser Utilities

**File: `.copilot/scripts/utils/ast-parser.js`**

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

class ASTParser {
  parse(code, filePath) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    const exports = [];
    const imports = [];
    const functions = [];
    const classes = [];

    traverse(ast, {
      ExportNamedDeclaration(path) {
        // Extract exports
      },
      ImportDeclaration(path) {
        // Extract imports
      },
      FunctionDeclaration(path) {
        // Extract functions
      },
      ClassDeclaration(path) {
        // Extract classes
      }
    });

    return { exports, imports, functions, classes };
  }
}
```

#### 2.3. Dependency Graph Builder

**File: `.copilot/scripts/utils/dep-graph.js`**

```javascript
class DependencyGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(file, metadata) {
    this.nodes.set(file, metadata);
  }

  addEdge(from, to, type) {
    if (!this.edges.has(from)) {
      this.edges.set(from, []);
    }
    this.edges.get(from).push({ to, type });
  }

  getDependents(file) {
    // Find all files that depend on this file
  }

  getDependencies(file) {
    // Find all files this file depends on
  }

  detectCircular() {
    // Detect circular dependencies
  }
}
```

### Phase 3: Documentation Generation (3-4 ngày)

#### 3.1. Architecture Doc Generator

**File: `.copilot/scripts/generators/architecture.js`**

Generate `ARCHITECTURE.md` với:
- Project overview
- Tech stack detection
- Folder structure summary
- Key modules và responsibilities
- Data flow patterns

#### 3.2. Codemap Generator

**File: `.copilot/scripts/generators/codemap.js`**

Generate per-module CODEMAP:
```json
{
  "file": "src/hooks/useDebounce.ts",
  "type": "hook",
  "exports": [
    {
      "name": "useDebounce",
      "type": "function",
      "signature": "<T>(value: T, delay: number) => T",
      "description": "Debounces a value with specified delay",
      "usageCount": 12
    }
  ],
  "imports": [
    {"from": "react", "symbols": ["useState", "useEffect"]}
  ],
  "dependencies": [],
  "dependents": [
    "src/components/SearchBar.tsx",
    "src/components/FilterPanel.tsx"
  ],
  "patterns": ["custom-hook", "generic-type"],
  "complexity": "low"
}
```

#### 3.3. Pattern Extractor

**File: `.copilot/scripts/generators/patterns.js`**

Extract common patterns:
- API response formats
- Repository patterns
- Custom hook patterns
- Component patterns

```json
{
  "patterns": [
    {
      "id": "api-response-format",
      "category": "api",
      "name": "Standard API Response",
      "template": {
        "success": "boolean",
        "data": "T | undefined",
        "error": "string | undefined"
      },
      "examples": [
        "src/api/users.ts:45",
        "src/api/products.ts:78"
      ]
    }
  ]
}
```

### Phase 4: Prompt Templates (2-3 ngày)

#### 4.1. Project-Level Prompts

**File: `.copilot/prompts/project-level/00-base-context.md`**

```markdown
# Project: [Name]

## Tech Stack
- Frontend: Next.js 15, React 19, TypeScript
- Backend: FastAPI, Python 3.12
- Database: PostgreSQL, Redis

## Architecture
- Hybrid deployment
- Feature-based organization
- Immutable patterns

## Key Conventions
- camelCase for variables
- PascalCase for components
- 80%+ test coverage

## Entry Points
- Frontend: src/app/page.tsx
- Backend: src/main.py
```

#### 4.2. Feature-Level Prompts

**File: `.copilot/prompts/feature-level/auth/context.md`**

```markdown
# Authentication Feature

## Scope
- User login/logout
- JWT token management
- Session handling

## Key Files
- src/api/auth.ts
- src/services/AuthService.ts
- src/hooks/useAuth.ts

## Data Flow
User → useAuth → AuthService → API → Backend

## Patterns Used
- Repository pattern
- Custom hook
- JWT authentication
```

#### 4.3. Task-Level Templates

**File: `.copilot/prompts/task-level/templates/feature-implementation.md`**

```markdown
# Task: Implement [Feature Name]

## Context Loaded
- Project: [metadata]
- Feature: [feature context]
- Related patterns: [patterns]

## Requirements
[User requirements]

## Implementation Plan
1. [Step 1]
2. [Step 2]

## Files to Modify
- [file1]: [reason]

## Tests Required
- Unit tests: [list]
- Integration tests: [list]

## Patterns to Follow
- [pattern1]: [usage]
```

### Phase 5: Context Management (2-3 ngày)

#### 5.1. Context Selector

**File: `.copilot/scripts/utils/context-selector.js`**

```javascript
class ContextSelector {
  constructor(config) {
    this.config = config;
    this.budget = config.context.maxTokens;
  }

  selectContext(task, targetFile) {
    const context = {
      layers: [],
      estimatedTokens: 0
    };

    // Layer 1: Project context (always)
    context.layers.push(this.getProjectContext());

    // Layer 2: Feature context (based on task)
    context.layers.push(this.getFeatureContext(task));

    // Layer 3: Task context (specific files)
    context.layers.push(this.getTaskContext(targetFile));

    // Verify budget
    if (context.estimatedTokens > this.budget) {
      context = this.compressContext(context);
    }

    return context;
  }

  compressContext(context) {
    // Summarize or remove less important parts
  }
}
```

#### 5.2. Incremental Update

**File: `.copilot/scripts/update-context.js`**

```javascript
const chokidar = require('chokidar');

class IncrementalUpdater {
  watch() {
    const watcher = chokidar.watch('src/**/*', {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher
      .on('change', path => this.handleChange(path))
      .on('add', path => this.handleAdd(path))
      .on('unlink', path => this.handleDelete(path));
  }

  async handleChange(filePath) {
    // Update only affected modules
    const affected = this.findAffectedModules(filePath);
    await this.regenerateDocs(affected);
  }
}
```

#### 5.3. Git Hooks Integration

**File: `.copilot/scripts/setup-hooks.sh`**

```bash
#!/bin/bash

# Pre-commit: Update docs for staged files
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
cd .copilot && npm run update --silent
git add .copilot/index/
EOF

# Post-merge: Regenerate all docs
cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash
cd .copilot && npm run index --silent
EOF

chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-merge
```

### Phase 6: CLI Tool (1-2 ngày)

#### 6.1. Main CLI

**File: `.copilot/scripts/cli.js`**

```javascript
const { Command } = require('commander');
const program = new Command();

program
  .name('copilot-context')
  .description('Copilot context management CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize system')
  .action(async () => {
    await discover();
    await index();
  });

program
  .command('scan')
  .description('Full codebase scan')
  .action(async () => {
    await discover();
  });

program
  .command('update [file]')
  .description('Update context for specific file')
  .action(async (file) => {
    await updateContext(file);
  });

program
  .command('prompt <type>')
  .description('Generate prompt template')
  .action(async (type) => {
    await generatePrompt(type);
  });

program
  .command('stats')
  .description('Show context statistics')
  .action(async () => {
    await showStats();
  });

program.parse();
```

### Phase 7: Testing (2-3 ngày)

#### 7.1. Unit Tests

**File: `.copilot/scripts/__tests__/discover.test.js`**

```javascript
const { CodebaseScanner } = require('../discover');

describe('CodebaseScanner', () => {
  test('should find all source files', async () => {
    const scanner = new CodebaseScanner();
    const files = await scanner.findFiles();
    expect(files.length).toBeGreaterThan(0);
  });

  test('should respect ignore patterns', async () => {
    const scanner = new CodebaseScanner();
    const files = await scanner.findFiles();
    expect(files.every(f => !f.includes('node_modules'))).toBe(true);
  });
});
```

#### 7.2. Integration Tests

**File: `.copilot/scripts/__tests__/integration.test.js`**

```javascript
describe('Full Workflow', () => {
  test('should complete discovery → indexing → retrieval', async () => {
    // Run discovery
    const discovery = await discover();
    expect(discovery.totalFiles).toBeGreaterThan(0);

    // Generate docs
    await generateDocs();
    expect(fs.existsSync('.copilot/index/architecture/overview.md')).toBe(true);

    // Select context
    const context = selectContext('api', 'src/api/users.ts');
    expect(context.layers.length).toBe(3);
  });
});
```

## 📊 Implementation Timeline

### Week 1: Core Infrastructure
- Day 1-2: Setup + Discovery phase
- Day 3-4: AST parsing + Dependency graph
- Day 5: Testing discovery

### Week 2: Documentation & Indexing
- Day 1-2: Doc generators
- Day 3-4: Pattern extraction
- Day 5: Testing indexing

### Week 3: Context Management & CLI
- Day 1-2: Context selector
- Day 3: Incremental updates
- Day 4: CLI tool
- Day 5: Integration testing

### Week 4: Polish & Documentation
- Day 1-2: Bug fixes
- Day 3: User documentation
- Day 4-5: Team testing

## ✅ Success Criteria

- [ ] Scanner analyzes codebase accurately
- [ ] ARCHITECTURE.md generated correctly
- [ ] CODEMAPS for all major modules
- [ ] 4 prompt templates working
- [ ] CLI tool functional
- [ ] Git hooks auto-update docs
- [ ] Context selector reduces tokens 40%+
- [ ] Copilot responses improve quality
- [ ] 80%+ test coverage

## 🔧 Technical Challenges

### Challenge 1: AST Parsing Failures
**Problem:** Syntax errors break parser
**Solution:** Graceful fallback, skip problematic files, log warnings

### Challenge 2: Large Context Windows
**Problem:** Generated docs too long
**Solution:** Summarization, chunking, context compression

### Challenge 3: Outdated Documentation
**Problem:** Docs stale when code changes fast
**Solution:** Git hooks, file watchers, incremental updates

### Challenge 4: Performance Issues
**Problem:** Slow on large codebases
**Solution:** Caching, parallel processing, incremental scans

## 💡 Advanced Features (Optional)

### Semantic Search với Embeddings

```javascript
const { ChromaClient } = require('chromadb');

class SemanticSearch {
  async indexCodebase() {
    const client = new ChromaClient();
    const collection = await client.createCollection('codebase');

    // Generate embeddings for each file
    for (const file of files) {
      const embedding = await this.generateEmbedding(file.content);
      await collection.add({
        ids: [file.path],
        embeddings: [embedding],
        metadatas: [file.metadata]
      });
    }
  }

  async search(query) {
    const queryEmbedding = await this.generateEmbedding(query);
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5
    });
    return results;
  }
}
```

### GraphRAG Integration

```javascript
const { GraphRAG } = require('graphrag');

class CodebaseKnowledgeGraph {
  async buildGraph() {
    // Extract entities (functions, classes, modules)
    // Extract relationships (imports, calls, extends)
    // Build hierarchical communities
    // Enable multi-level reasoning
  }
}
```

## 📚 Resources

- [Babel Parser](https://babeljs.io/docs/babel-parser)
- [Tree-sitter](https://tree-sitter.github.io)
- [ChromaDB](https://www.trychroma.com)
- [GraphRAG](https://github.com/microsoft/graphrag)

## ⚠️ Maintenance Overhead

**Weekly:**
- Review generated docs
- Update patterns
- Fix edge cases

**Monthly:**
- Performance optimization
- Add new features
- Update dependencies

**Quarterly:**
- Major refactoring
- Architecture review
- Community feedback

## 🚀 When to Choose This Option

**Choose Option C if:**
- ✅ Option A/B tested and insufficient
- ✅ Have 1-2 weeks for development
- ✅ Need very specific customization
- ✅ Want to learn deeply
- ✅ Plan to open source

**Don't choose if:**
- ❌ Need quick solution
- ❌ Haven't tried Option A/B
- ❌ Limited development time
- ❌ Basic features sufficient

## 💰 Cost-Benefit Analysis

**Costs:**
- 1-2 weeks development time
- Ongoing maintenance
- Learning curve
- Testing overhead

**Benefits:**
- Full control
- Perfect fit for use case
- Learning experience
- Potential open source contribution
- Competitive advantage

**Break-even:** ~3-6 months (if used daily by team)

## 🎓 Learning Outcomes

By building this, you'll learn:
- AST parsing and code analysis
- Dependency graph algorithms
- Context window optimization
- CLI tool development
- Git hooks integration
- Testing strategies
- Documentation generation

## 🌟 Potential for Open Source

If you build this well:
- Could become popular tool
- Help other developers
- Build reputation
- Get community contributions
- Monetization opportunities

## 📝 Final Recommendation

**Only choose Option C if you answered YES to all:**
1. Tried Option A and B first?
2. Have specific requirements they can't meet?
3. Have 1-2 weeks available?
4. Comfortable with AST parsing?
5. Will maintain long-term?
6. Might open source it?

**If any NO → Go with Option B instead.**

Option B gives you 80% of benefits with 20% of effort.
