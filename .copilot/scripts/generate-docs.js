#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

async function generateDocs() {
  console.log(chalk.cyan('🚀 Generating documentation...\n'));

  // 1. Generate snapshot with Repopack
  if (config.tools.repopack.enabled) {
    const spinner = ora('Generating codebase snapshot...').start();
    try {
      execSync('npx repopack --output .copilot/docs/snapshot.xml --style xml', {
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '../..')
      });
      spinner.succeed('Snapshot generated');
    } catch (error) {
      spinner.warn('Repopack failed, skipping snapshot (install with: npm install -g repopack)');
    }
  }

  // 2. Generate architecture overview
  const spinner2 = ora('Generating architecture docs...').start();

  const discoveryPath = path.join(__dirname, '../docs/discovery.json');
  if (!fs.existsSync(discoveryPath)) {
    spinner2.fail('Discovery file not found. Run npm run discover first.');
    process.exit(1);
  }

  const discovery = JSON.parse(fs.readFileSync(discoveryPath, 'utf-8'));

  const archDoc = `# Architecture Overview

**Generated:** ${new Date().toISOString()}

## Project Information
- **Name:** ${discovery.projectMetadata.name}
- **Version:** ${discovery.projectMetadata.version}
- **Description:** ${discovery.projectMetadata.description}

## Tech Stack

### Frontend
${discovery.techStack.frontend.length > 0 ? discovery.techStack.frontend.map(t => `- ${t}`).join('\n') : '- N/A'}

### Backend
${discovery.techStack.backend.length > 0 ? discovery.techStack.backend.map(t => `- ${t}`).join('\n') : '- N/A'}

### Database
${discovery.techStack.database.length > 0 ? discovery.techStack.database.map(t => `- ${t}`).join('\n') : '- N/A'}

### Testing
${discovery.techStack.testing.length > 0 ? discovery.techStack.testing.map(t => `- ${t}`).join('\n') : '- N/A'}

## Project Structure

### File Distribution
- **Frontend:** ${discovery.categorized.frontend.length} files
- **Backend:** ${discovery.categorized.backend.length} files
- **Shared:** ${discovery.categorized.shared.length} files
- **Tests:** ${discovery.categorized.tests.length} files
- **Config:** ${discovery.categorized.config.length} files
- **Total:** ${discovery.totalFiles} files

### Entry Points

#### Frontend
${discovery.entryPoints.frontend.length > 0 ? discovery.entryPoints.frontend.map(e => `- \`${e}\``).join('\n') : '- N/A'}

#### Backend
${discovery.entryPoints.backend.length > 0 ? discovery.entryPoints.backend.map(e => `- \`${e}\``).join('\n') : '- N/A'}

## Key Directories

Based on file analysis:
- Frontend components: \`src/components/\`
- API routes: \`src/api/\`
- Utilities: \`src/utils/\`
- Types: \`src/types/\`
- Tests: Colocated with source files

## Development Workflow

1. **Local Development**
   - Run development server
   - Tests run with test command

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

## Last Updated
${discovery.timestamp}
`;

  fs.writeFileSync(path.join(__dirname, '../docs/architecture/overview.md'), archDoc);
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
    path.join(__dirname, '../docs/codemaps/frontend-map.json'),
    JSON.stringify(codemaps.frontend, null, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, '../docs/codemaps/backend-map.json'),
    JSON.stringify(codemaps.backend, null, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, '../docs/codemaps/shared-map.json'),
    JSON.stringify(codemaps.shared, null, 2)
  );

  spinner3.succeed('Codemaps generated');

  console.log(chalk.green('\n✅ Documentation generation complete!\n'));
  console.log(chalk.cyan('Generated files:'));
  console.log('  - .copilot/docs/snapshot.xml (if repopack available)');
  console.log('  - .copilot/docs/architecture/overview.md');
  console.log('  - .copilot/docs/codemaps/*.json');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocs();
}

export { generateDocs };
