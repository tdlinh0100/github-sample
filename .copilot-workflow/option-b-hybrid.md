# Option B: Hybrid Approach (3-5 giờ)

**Recommended cho:** Production projects, team development, dự án lớn (100+ files)

## 🎯 Mục Tiêu

- Production-ready solution
- Kết hợp tools có sẵn + custom automation
- Scalable cho team
- Balance giữa speed và control

## 🛠️ Tools Stack

1. **GitHub Copilot** (native features)
   - Copilot Memory
   - Repository Indexing
   - Custom Instructions

2. **Repopack** (codebase snapshots)
   - XML/Markdown output
   - Token counting
   - Git-aware

3. **Aider repo-map** (semantic understanding)
   - Intelligent codebase mapping
   - AST-based analysis
   - 100+ languages

4. **ast-grep** (structural search)
   - Pattern-based queries
   - Fast symbol lookup
   - Multi-language

5. **PRPM** (cross-platform rules)
   - 7,500+ packages
   - Community templates

## 📋 Implementation Steps

### Phase 1: Foundation (1 giờ)

#### 1.1. Setup từ Option A

```bash
# Follow Option A first
# Tạo .github/copilot-instructions.md
# Tạo path-specific instructions
# Install PRPM (optional)
```

Xem chi tiết: [Option A - Quick Start](./option-a-quick-start.md)

#### 1.2. Tạo project structure

```bash
mkdir -p .copilot/{docs,scripts,cache,logs}
mkdir -p .copilot/docs/{codemaps,architecture}
```

**Structure:**
```
.copilot/
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── data-flow.md
│   │   └── decisions/
│   ├── codemaps/
│   │   ├── frontend-map.json
│   │   ├── backend-map.json
│   │   └── shared-map.json
│   └── snapshot.xml
├── scripts/
│   ├── discover.js
│   ├── generate-docs.js
│   └── update-context.js
├── cache/
│   └── context-cache.json
├── logs/
│   └── updates.log
└── config.json
```

#### 1.3. Tạo config file

**File: `.copilot/config.json`**
```json
{
  "project": {
    "name": "your-project-name",
    "version": "1.0.0",
    "type": "fullstack"
  },
  "scan": {
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".git",
      ".next",
      "coverage",
      "*.log"
    ],
    "extensions": [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".py",
      ".go",
      ".rs"
    ],
    "maxFileSize": 100000
  },
  "documentation": {
    "outputDir": ".copilot/docs",
    "codemapDir": ".copilot/docs/codemaps",
    "updateOnChange": true,
    "formats": ["json", "markdown"]
  },
  "context": {
    "maxTokens": 100000,
    "layers": {
      "project": 10000,
      "feature": 30000,
      "task": 60000
    }
  },
  "tools": {
    "repopack": {
      "enabled": true,
      "format": "xml"
    },
    "astGrep": {
      "enabled": true
    },
    "aider": {
      "enabled": false
    }
  }
}
```

### Phase 2: Automation Scripts (2 giờ)

#### 2.1. Install dependencies

**File: `.copilot/package.json`**
```json
{
  "name": "copilot-workflow",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "discover": "node scripts/discover.js",
    "generate": "node scripts/generate-docs.js",
    "update": "node scripts/update-context.js",
    "snapshot": "repomix --output docs/snapshot.xml --style xml",
    "watch": "nodemon --watch ../src --exec 'npm run update'"
  },
  "dependencies": {
    "@babel/parser": "^7.24.0",
    "@babel/traverse": "^7.24.0",
    "glob": "^10.3.10",
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

```bash
cd .copilot
npm install
cd ..
```

#### 2.2. Discovery Script

**File: `.copilot/scripts/discover.js`**
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const chalk = require('chalk');
const ora = require('ora');

const config = require('../config.json');

async function discoverProject() {
  const spinner = ora('Discovering project structure...').start();

  try {
    // 1. Find all source files
    const patterns = config.scan.extensions.map(ext => `**/*${ext}`);
    const files = await glob(patterns, {
      ignore: config.scan.ignore,
      cwd: path.resolve(__dirname, '../..'),
      absolute: true
    });

    spinner.text = `Found ${files.length} files`;

    // 2. Categorize files
    const categorized = {
      frontend: [],
      backend: [],
      shared: [],
      tests: [],
      config: []
    };

    files.forEach(file => {
      const relativePath = path.relative(process.cwd(), file);

      if (relativePath.includes('test') || relativePath.includes('spec')) {
        categorized.tests.push(relativePath);
      } else if (relativePath.includes('components') || relativePath.includes('pages') || relativePath.includes('app')) {
        categorized.frontend.push(relativePath);
      } else if (relativePath.includes('api') || relativePath.includes('server') || relativePath.includes('services')) {
        categorized.backend.push(relativePath);
      } else if (relativePath.includes('utils') || relativePath.includes('lib') || relativePath.includes('types')) {
        categorized.shared.push(relativePath);
      } else if (relativePath.includes('config') || relativePath.endsWith('.config.js') || relativePath.endsWith('.config.ts')) {
        categorized.config.push(relativePath);
      }
    });

    // 3. Detect tech stack
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const techStack = {
      frontend: [],
      backend: [],
      database: [],
      testing: []
    };

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Detect frontend
    if (deps['next']) techStack.frontend.push('Next.js');
    if (deps['react']) techStack.frontend.push('React');
    if (deps['vue']) techStack.frontend.push('Vue');
    if (deps['typescript']) techStack.frontend.push('TypeScript');

    // Detect backend
    if (deps['express']) techStack.backend.push('Express');
    if (deps['fastify']) techStack.backend.push('Fastify');
    if (deps['@nestjs/core']) techStack.backend.push('NestJS');

    // Detect database
    if (deps['pg'] || deps['postgres']) techStack.database.push('PostgreSQL');
    if (deps['mysql2']) techStack.database.push('MySQL');
    if (deps['mongodb']) techStack.database.push('MongoDB');
    if (deps['redis']) techStack.database.push('Redis');

    // Detect testing
    if (deps['jest']) techStack.testing.push('Jest');
    if (deps['vitest']) techStack.testing.push('Vitest');
    if (deps['playwright']) techStack.testing.push('Playwright');

    // 4. Find entry points
    const entryPoints = {
      frontend: [],
      backend: [],
      tests: []
    };

    // Common entry point patterns
    const entryPatterns = [
      'src/index.{ts,tsx,js,jsx}',
      'src/main.{ts,tsx,js,jsx}',
      'src/app/page.{ts,tsx,js,jsx}',
      'src/app/layout.{ts,tsx,js,jsx}',
      'pages/_app.{ts,tsx,js,jsx}',
      'pages/index.{ts,tsx,js,jsx}'
    ];

    for (const pattern of entryPatterns) {
      const matches = await glob(pattern, { cwd: process.cwd() });
      matches.forEach(match => {
        if (match.includes('app') || match.includes('pages')) {
          entryPoints.frontend.push(match);
        } else {
          entryPoints.backend.push(match);
        }
      });
    }

    // 5. Save discovery results
    const discovery = {
      timestamp: new Date().toISOString(),
      totalFiles: files.length,
      categorized,
      techStack,
      entryPoints,
      projectMetadata: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description
      }
    };

    const outputPath = path.join(__dirname, '../docs/discovery.json');
    fs.writeFileSync(outputPath, JSON.stringify(discovery, null, 2));

    spinner.succeed(chalk.green('Discovery complete!'));

    console.log(chalk.cyan('\n📊 Project Summary:'));
    console.log(`  Total files: ${files.length}`);
    console.log(`  Frontend: ${categorized.frontend.length}`);
    console.log(`  Backend: ${categorized.backend.length}`);
    console.log(`  Shared: ${categorized.shared.length}`);
    console.log(`  Tests: ${categorized.tests.length}`);
    console.log(`\n  Tech Stack:`);
    Object.entries(techStack).forEach(([key, values]) => {
      if (values.length > 0) {
        console.log(`    ${key}: ${values.join(', ')}`);
      }
    });

    return discovery;

  } catch (error) {
    spinner.fail(chalk.red('Discovery failed'));
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  discoverProject();
}

module.exports = { discoverProject };
```

#### 2.3. Generate Documentation Script

**File: `.copilot/scripts/generate-docs.js`**
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

const config = require('../config.json');

async function generateDocs() {
  console.log(chalk.cyan('🚀 Generating documentation...\n'));

  // 1. Generate snapshot with Repopack
  if (config.tools.repopack.enabled) {
    const spinner = ora('Generating codebase snapshot...').start();
    try {
      execSync('repomix --output .copilot/docs/snapshot.xml --style xml', {
        stdio: 'pipe'
      });
      spinner.succeed('Snapshot generated');
    } catch (error) {
      spinner.warn('Repopack not found, skipping snapshot');
    }
  }

  // 2. Generate architecture overview
  const spinner2 = ora('Generating architecture docs...').start();

  const discovery = JSON.parse(
    fs.readFileSync('.copilot/docs/discovery.json', 'utf-8')
  );

  const archDoc = `# Architecture Overview

**Generated:** ${new Date().toISOString()}

## Project Information
- **Name:** ${discovery.projectMetadata.name}
- **Version:** ${discovery.projectMetadata.version}
- **Description:** ${discovery.projectMetadata.description || 'N/A'}

## Tech Stack

### Frontend
${discovery.techStack.frontend.map(t => `- ${t}`).join('\n') || '- N/A'}

### Backend
${discovery.techStack.backend.map(t => `- ${t}`).join('\n') || '- N/A'}

### Database
${discovery.techStack.database.map(t => `- ${t}`).join('\n') || '- N/A'}

### Testing
${discovery.techStack.testing.map(t => `- ${t}`).join('\n') || '- N/A'}

## Project Structure

### File Distribution
- **Frontend:** ${discovery.categorized.frontend.length} files
- **Backend:** ${discovery.categorized.backend.length} files
- **Shared:** ${discovery.categorized.shared.length} files
- **Tests:** ${discovery.categorized.tests.length} files
- **Config:** ${discovery.categorized.config.length} files

### Entry Points

#### Frontend
${discovery.entryPoints.frontend.map(e => `- \`${e}\``).join('\n') || '- N/A'}

#### Backend
${discovery.entryPoints.backend.map(e => `- \`${e}\``).join('\n') || '- N/A'}

## Key Directories

Based on file analysis:
- Frontend components: \`src/components/\`
- API routes: \`src/api/\`
- Utilities: \`src/utils/\`
- Types: \`src/types/\`
- Tests: Colocated with source files

## Development Workflow

1. **Local Development**
   - Run \`npm run dev\` for development server
   - Tests run with \`npm test\`

2. **Code Organization**
   - Feature-based structure
   - Colocated tests
   - Shared utilities in \`src/utils/\`

3. **Testing Strategy**
   - Unit tests: ${discovery.categorized.tests.length} test files
   - Coverage target: 80%+

## Context Loading Strategy

### Layer 1: Project Context (Always Load)
- This architecture overview
- Tech stack information
- Key patterns and conventions

### Layer 2: Feature Context (Load on Demand)
- Specific module documentation
- Related patterns
- API contracts

### Layer 3: Task Context (Specific to Task)
- Target files
- Direct dependencies
- Related tests
`;

  fs.writeFileSync('.copilot/docs/architecture/overview.md', archDoc);
  spinner2.succeed('Architecture docs generated');

  // 3. Generate codemaps
  const spinner3 = ora('Generating codemaps...').start();

  const codemaps = {
    frontend: {
      files: discovery.categorized.frontend,
      count: discovery.categorized.frontend.length,
      entryPoints: discovery.entryPoints.frontend
    },
    backend: {
      files: discovery.categorized.backend,
      count: discovery.categorized.backend.length,
      entryPoints: discovery.entryPoints.backend
    },
    shared: {
      files: discovery.categorized.shared,
      count: discovery.categorized.shared.length
    }
  };

  fs.writeFileSync(
    '.copilot/docs/codemaps/frontend-map.json',
    JSON.stringify(codemaps.frontend, null, 2)
  );
  fs.writeFileSync(
    '.copilot/docs/codemaps/backend-map.json',
    JSON.stringify(codemaps.backend, null, 2)
  );
  fs.writeFileSync(
    '.copilot/docs/codemaps/shared-map.json',
    JSON.stringify(codemaps.shared, null, 2)
  );

  spinner3.succeed('Codemaps generated');

  console.log(chalk.green('\n✅ Documentation generation complete!\n'));
  console.log(chalk.cyan('Generated files:'));
  console.log('  - .copilot/docs/snapshot.xml');
  console.log('  - .copilot/docs/architecture/overview.md');
  console.log('  - .copilot/docs/codemaps/*.json');
}

// Run if called directly
if (require.main === module) {
  generateDocs();
}

module.exports = { generateDocs };
```

#### 2.4. Update Context Script

**File: `.copilot/scripts/update-context.js`**
```javascript
#!/usr/bin/env node

const { discoverProject } = require('./discover');
const { generateDocs } = require('./generate-docs');
const chalk = require('chalk');

async function updateContext() {
  console.log(chalk.cyan('🔄 Updating Copilot context...\n'));

  try {
    // 1. Run discovery
    await discoverProject();

    // 2. Generate docs
    await generateDocs();

    // 3. Log update
    const fs = require('fs');
    const logEntry = `${new Date().toISOString()} - Context updated\n`;
    fs.appendFileSync('.copilot/logs/updates.log', logEntry);

    console.log(chalk.green('\n✅ Context update complete!\n'));
  } catch (error) {
    console.error(chalk.red('❌ Update failed:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateContext();
}

module.exports = { updateContext };
```

### Phase 3: Git Integration (30 phút)

#### 3.1. Setup Git Hooks

**File: `.copilot/scripts/setup-hooks.sh`**
```bash
#!/bin/bash

echo "Setting up Git hooks..."

# Create hooks directory if not exists
mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Update context for staged files

echo "Updating Copilot context..."
cd .copilot && npm run update --silent
cd ..

# Add updated docs to commit
git add .copilot/docs/
EOF

chmod +x .git/hooks/pre-commit

# Post-merge hook
cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash
# Regenerate context after merge

echo "Regenerating Copilot context after merge..."
cd .copilot && npm run update --silent
cd ..
EOF

chmod +x .git/hooks/post-merge

echo "✅ Git hooks installed successfully!"
```

```bash
bash .copilot/scripts/setup-hooks.sh
```

#### 3.2. Add to .gitignore

```bash
cat >> .gitignore << 'EOF'

# Copilot workflow
.copilot/cache/
.copilot/logs/
.copilot/docs/snapshot.xml
.copilot/node_modules/
EOF
```

### Phase 4: Advanced Features (1-2 giờ, Optional)

#### 4.1. Install ast-grep

```bash
npm install -g @ast-grep/cli
```

#### 4.2. Create ast-grep rules

**File: `.copilot/ast-grep-rules.yml`**
```yaml
rules:
  - id: find-api-endpoints
    language: typescript
    pattern: |
      export async function $METHOD(request: Request) {
        $$$
      }

  - id: find-react-components
    language: tsx
    pattern: |
      export default function $COMPONENT($$$) {
        $$$
      }

  - id: find-custom-hooks
    language: typescript
    pattern: |
      export function use$HOOK($$$) {
        $$$
      }
```

#### 4.3. Symbol Search Script

**File: `.copilot/scripts/search-symbols.js`**
```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

function searchSymbols(query) {
  console.log(chalk.cyan(`🔍 Searching for: ${query}\n`));

  try {
    // Use ast-grep for structural search
    const result = execSync(
      `ast-grep --pattern '${query}' --json`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );

    const matches = JSON.parse(result);

    console.log(chalk.green(`Found ${matches.length} matches:\n`));

    matches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.file}:${match.line}`);
      console.log(`   ${match.text.trim()}\n`);
    });

  } catch (error) {
    console.log(chalk.yellow('No matches found'));
  }
}

// CLI
const query = process.argv[2];
if (!query) {
  console.log('Usage: node search-symbols.js "<pattern>"');
  process.exit(1);
}

searchSymbols(query);
```

#### 4.4. Context Selector

**File: `.copilot/scripts/select-context.js`**
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function selectContext(taskType, targetFile) {
  console.log(chalk.cyan(`📦 Selecting context for: ${taskType}\n`));

  const config = require('../config.json');
  const discovery = JSON.parse(
    fs.readFileSync('.copilot/docs/discovery.json', 'utf-8')
  );

  const context = {
    layers: [],
    estimatedTokens: 0
  };

  // Layer 1: Always load project context
  context.layers.push({
    name: 'project',
    files: [
      '.github/copilot-instructions.md',
      '.copilot/docs/architecture/overview.md'
    ],
    tokens: config.context.layers.project
  });
  context.estimatedTokens += config.context.layers.project;

  // Layer 2: Feature context based on task type
  if (taskType === 'api') {
    context.layers.push({
      name: 'feature',
      files: [
        '.github/instructions/api.instructions.md',
        '.copilot/docs/codemaps/backend-map.json'
      ],
      tokens: config.context.layers.feature
    });
    context.estimatedTokens += config.context.layers.feature;
  } else if (taskType === 'component') {
    context.layers.push({
      name: 'feature',
      files: [
        '.github/instructions/components.instructions.md',
        '.copilot/docs/codemaps/frontend-map.json'
      ],
      tokens: config.context.layers.feature
    });
    context.estimatedTokens += config.context.layers.feature;
  }

  // Layer 3: Task-specific context
  if (targetFile) {
    context.layers.push({
      name: 'task',
      files: [targetFile],
      tokens: config.context.layers.task
    });
    context.estimatedTokens += config.context.layers.task;
  }

  console.log(chalk.green('Selected context:\n'));
  context.layers.forEach(layer => {
    console.log(`  ${layer.name}:`);
    layer.files.forEach(file => console.log(`    - ${file}`));
  });
  console.log(`\n  Estimated tokens: ${context.estimatedTokens}`);

  return context;
}

// CLI
const taskType = process.argv[2];
const targetFile = process.argv[3];

if (!taskType) {
  console.log('Usage: node select-context.js <task-type> [target-file]');
  console.log('Task types: api, component, test, refactor');
  process.exit(1);
}

selectContext(taskType, targetFile);
```

### Phase 5: Integration & Testing (30 phút)

#### 5.1. Run initial setup

```bash
# Install dependencies
cd .copilot
npm install
cd ..

# Run discovery
cd .copilot
npm run discover
cd ..

# Generate docs
cd .copilot
npm run generate
cd ..

# Setup git hooks
bash .copilot/scripts/setup-hooks.sh
```

#### 5.2. Add npm scripts to root

**Add to root `package.json`:**
```json
{
  "scripts": {
    "copilot:init": "cd .copilot && npm run discover && npm run generate",
    "copilot:update": "cd .copilot && npm run update",
    "copilot:watch": "cd .copilot && npm run watch",
    "copilot:search": "node .copilot/scripts/search-symbols.js",
    "copilot:context": "node .copilot/scripts/select-context.js"
  }
}
```

#### 5.3. Test workflow

```bash
# Test discovery
npm run copilot:init

# Check generated files
ls -la .copilot/docs/
cat .copilot/docs/architecture/overview.md

# Test search
npm run copilot:search "export function use"

# Test context selection
npm run copilot:context api src/api/users.ts
```

#### 5.4. Test với Copilot

**In VS Code Copilot Chat:**
```
@workspace What is the architecture of this project?
@workspace Show me all API endpoints
@workspace Find custom hooks
```

**Reference generated docs:**
```
In Copilot Chat:
#file:.copilot/docs/architecture/overview.md
Based on this architecture, create a new API endpoint for...
```

## ✅ Verification Checklist

- [ ] All scripts executable and working
- [ ] Discovery generates correct file categorization
- [ ] Documentation generated successfully
- [ ] Git hooks installed and triggering
- [ ] ast-grep searches working (optional)
- [ ] Context selector provides relevant files
- [ ] Copilot reads generated documentation
- [ ] Team can run `npm run copilot:init` successfully

## 📊 Expected Results

### Automated Documentation:
- Architecture overview auto-generated
- Codemaps for frontend/backend/shared
- Codebase snapshot (XML format)
- Symbol registry (with ast-grep)

### Smart Context Loading:
- Layered context (project → feature → task)
- Token budget management
- Relevant file selection

### Team Collaboration:
- Consistent context across team
- Git hooks keep docs updated
- Easy onboarding (run one command)

## 🔧 Troubleshooting

### Scripts fail to run:
```bash
# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
cd .copilot
rm -rf node_modules package-lock.json
npm install
```

### Discovery finds no files:
- Check `config.json` ignore patterns
- Verify file extensions in config
- Run from project root

### Git hooks not triggering:
```bash
# Check hooks are executable
ls -la .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-merge
```

### Copilot not reading docs:
- Reference explicitly with `#file:` syntax
- Check file paths are correct
- Restart VS Code

## 🚀 Next Steps

### Maintenance:
- Run `npm run copilot:update` after major changes
- Review generated docs weekly
- Update config.json as project evolves

### Enhancements:
- Add more ast-grep rules for your patterns
- Create custom context selectors
- Implement semantic search (ChromaDB)
- Add CI/CD integration

### Scale to Team:
- Document workflow in team wiki
- Add to onboarding checklist
- Create video walkthrough
- Gather feedback and iterate

## 💡 Advanced Tips

1. **Watch Mode for Active Development:**
   ```bash
   npm run copilot:watch
   # Auto-updates on file changes
   ```

2. **Custom Context for Specific Tasks:**
   ```bash
   npm run copilot:context refactor src/utils/auth.ts
   # Shows exactly what to load
   ```

3. **Search Before Coding:**
   ```bash
   npm run copilot:search "interface.*Repository"
   # Find all repository interfaces
   ```

4. **Periodic Full Regeneration:**
   ```bash
   # Weekly or after major refactors
   npm run copilot:init
   ```

5. **CI/CD Integration:**
   ```yaml
   # .github/workflows/update-context.yml
   name: Update Copilot Context
   on:
     push:
       branches: [main]
   jobs:
     update:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - run: npm run copilot:init
         - uses: stefanzweifel/git-auto-commit-action@v4
           with:
             commit_message: "docs: update copilot context"
   ```

## 📚 Resources

- [Repopack Documentation](https://github.com/yamadashy/repopack)
- [ast-grep Guide](https://ast-grep.github.io)
- [Aider Documentation](https://aider.chat)
- [GitHub Copilot API](https://docs.github.com/en/copilot)

## ⏱️ Time Investment

- Initial setup: 3-5 giờ
- Maintenance: 30 phút/tuần (mostly automated)
- ROI: High (scales with team size)
- Payback: ~2 tuần (time saved from better context)
