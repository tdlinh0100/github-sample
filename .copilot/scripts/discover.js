#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

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

      if (relativePath.includes('test') || relativePath.includes('spec') || relativePath.includes('__tests__')) {
        categorized.tests.push(relativePath);
      } else if (relativePath.includes('components') || relativePath.includes('pages') || relativePath.includes('app')) {
        categorized.frontend.push(relativePath);
      } else if (relativePath.includes('api') || relativePath.includes('server') || relativePath.includes('services')) {
        categorized.backend.push(relativePath);
      } else if (relativePath.includes('utils') || relativePath.includes('lib') || relativePath.includes('types') || relativePath.includes('helpers')) {
        categorized.shared.push(relativePath);
      } else if (relativePath.includes('config') || relativePath.endsWith('.config.js') || relativePath.endsWith('.config.ts')) {
        categorized.config.push(relativePath);
      } else {
        // Default to shared if can't categorize
        categorized.shared.push(relativePath);
      }
    });

    // 3. Detect tech stack
    let packageJson = { dependencies: {}, devDependencies: {} };
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    }

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
    if (deps['@angular/core']) techStack.frontend.push('Angular');
    if (deps['svelte']) techStack.frontend.push('Svelte');
    if (deps['typescript']) techStack.frontend.push('TypeScript');
    if (deps['tailwindcss']) techStack.frontend.push('Tailwind CSS');

    // Detect backend
    if (deps['express']) techStack.backend.push('Express');
    if (deps['fastify']) techStack.backend.push('Fastify');
    if (deps['@nestjs/core']) techStack.backend.push('NestJS');
    if (deps['koa']) techStack.backend.push('Koa');

    // Detect database
    if (deps['pg'] || deps['postgres']) techStack.database.push('PostgreSQL');
    if (deps['mysql2']) techStack.database.push('MySQL');
    if (deps['mongodb']) techStack.database.push('MongoDB');
    if (deps['redis']) techStack.database.push('Redis');
    if (deps['prisma']) techStack.database.push('Prisma');
    if (deps['typeorm']) techStack.database.push('TypeORM');

    // Detect testing
    if (deps['jest']) techStack.testing.push('Jest');
    if (deps['vitest']) techStack.testing.push('Vitest');
    if (deps['playwright']) techStack.testing.push('Playwright');
    if (deps['cypress']) techStack.testing.push('Cypress');
    if (deps['@testing-library/react']) techStack.testing.push('React Testing Library');

    // 4. Find entry points
    const entryPoints = {
      frontend: [],
      backend: [],
      tests: []
    };

    // Common entry point patterns
    const entryPatterns = [
      'src/index.{ts,tsx,js,jsx}',
      'src/main.{ts,tsx,js,jsx,py}',
      'src/app/page.{ts,tsx,js,jsx}',
      'src/app/layout.{ts,tsx,js,jsx}',
      'pages/_app.{ts,tsx,js,jsx}',
      'pages/index.{ts,tsx,js,jsx}',
      'index.{ts,tsx,js,jsx}',
      'main.{ts,tsx,js,jsx,py}'
    ];

    for (const pattern of entryPatterns) {
      const matches = await glob(pattern, {
        cwd: process.cwd(),
        ignore: config.scan.ignore
      });
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
        name: packageJson.name || 'unknown',
        version: packageJson.version || '0.0.0',
        description: packageJson.description || 'No description'
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
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverProject();
}

export { discoverProject };
