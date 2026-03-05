#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import helper functions for testing
const PROJECT_ROOT = path.resolve(__dirname, '../..');

function categorizeFile(relativePath) {
  if (relativePath.includes('test') || relativePath.includes('spec') || relativePath.includes('__tests__')) {
    return 'tests';
  } else if (relativePath.includes('components') || relativePath.includes('pages') || relativePath.includes('app')) {
    return 'frontend';
  } else if (relativePath.includes('api') || relativePath.includes('server') || relativePath.includes('services')) {
    return 'backend';
  } else if (relativePath.includes('utils') || relativePath.includes('lib') || relativePath.includes('types') || relativePath.includes('helpers')) {
    return 'shared';
  } else if (relativePath.includes('config') || relativePath.endsWith('.config.js') || relativePath.endsWith('.config.ts')) {
    return 'config';
  } else {
    return 'shared';
  }
}

function detectTechStack(deps) {
  const techStack = {
    frontend: [],
    backend: [],
    database: [],
    testing: []
  };

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

  return techStack;
}

function validateConfig(config) {
  const errors = [];

  if (!config.scan || !config.scan.extensions || !Array.isArray(config.scan.extensions)) {
    errors.push('config.scan.extensions must be an array');
  }

  if (!config.scan || !config.scan.ignore || !Array.isArray(config.scan.ignore)) {
    errors.push('config.scan.ignore must be an array');
  }

  if (!config.documentation || !config.documentation.outputDir) {
    errors.push('config.documentation.outputDir is required');
  }

  if (!config.project || !config.project.name) {
    errors.push('config.project.name is required');
  }

  return errors;
}

describe('File Categorization', () => {
  test('should categorize test files correctly', () => {
    assert.strictEqual(categorizeFile('src/components/Button.test.js'), 'tests');
    assert.strictEqual(categorizeFile('src/utils/helper.spec.ts'), 'tests');
    assert.strictEqual(categorizeFile('src/__tests__/integration.js'), 'tests');
  });

  test('should categorize frontend files correctly', () => {
    assert.strictEqual(categorizeFile('src/components/Button.tsx'), 'frontend');
    assert.strictEqual(categorizeFile('src/pages/index.js'), 'frontend');
    assert.strictEqual(categorizeFile('src/app/layout.tsx'), 'frontend');
  });

  test('should categorize backend files correctly', () => {
    assert.strictEqual(categorizeFile('src/api/users.ts'), 'backend');
    assert.strictEqual(categorizeFile('src/server/index.js'), 'backend');
    assert.strictEqual(categorizeFile('src/services/auth.ts'), 'backend');
  });

  test('should categorize shared files correctly', () => {
    assert.strictEqual(categorizeFile('src/utils/format.ts'), 'shared');
    assert.strictEqual(categorizeFile('src/lib/database.js'), 'shared');
    assert.strictEqual(categorizeFile('src/types/user.ts'), 'shared');
    assert.strictEqual(categorizeFile('src/helpers/validation.js'), 'shared');
  });

  test('should categorize config files correctly', () => {
    assert.strictEqual(categorizeFile('next.config.js'), 'config');
    assert.strictEqual(categorizeFile('vite.config.ts'), 'config');
    assert.strictEqual(categorizeFile('src/config/database.js'), 'config');
  });
});

describe('Tech Stack Detection', () => {
  test('should detect React stack', () => {
    const deps = { 'react': '^18.0.0', 'typescript': '^5.0.0' };
    const stack = detectTechStack(deps);

    assert.ok(stack.frontend.includes('React'));
    assert.ok(stack.frontend.includes('TypeScript'));
  });

  test('should detect Next.js stack', () => {
    const deps = { 'next': '^14.0.0', 'react': '^18.0.0', 'tailwindcss': '^3.0.0' };
    const stack = detectTechStack(deps);

    assert.ok(stack.frontend.includes('Next.js'));
    assert.ok(stack.frontend.includes('React'));
    assert.ok(stack.frontend.includes('Tailwind CSS'));
  });

  test('should detect backend frameworks', () => {
    const deps = { 'express': '^4.18.0', 'fastify': '^4.0.0' };
    const stack = detectTechStack(deps);

    assert.ok(stack.backend.includes('Express'));
    assert.ok(stack.backend.includes('Fastify'));
  });

  test('should detect database tools', () => {
    const deps = { 'prisma': '^5.0.0', 'pg': '^8.11.0', 'redis': '^4.6.0' };
    const stack = detectTechStack(deps);

    assert.ok(stack.database.includes('Prisma'));
    assert.ok(stack.database.includes('PostgreSQL'));
    assert.ok(stack.database.includes('Redis'));
  });

  test('should detect testing frameworks', () => {
    const deps = { 'jest': '^29.0.0', 'playwright': '^1.40.0', '@testing-library/react': '^14.0.0' };
    const stack = detectTechStack(deps);

    assert.ok(stack.testing.includes('Jest'));
    assert.ok(stack.testing.includes('Playwright'));
    assert.ok(stack.testing.includes('React Testing Library'));
  });
});

describe('Config Validation', () => {
  test('should validate correct config', () => {
    const config = {
      project: { name: 'test-project' },
      scan: {
        extensions: ['.js', '.ts'],
        ignore: ['node_modules']
      },
      documentation: {
        outputDir: '.copilot/docs'
      }
    };

    const errors = validateConfig(config);
    assert.strictEqual(errors.length, 0);
  });

  test('should detect missing scan.extensions', () => {
    const config = {
      project: { name: 'test-project' },
      scan: { ignore: ['node_modules'] },
      documentation: { outputDir: '.copilot/docs' }
    };

    const errors = validateConfig(config);
    assert.ok(errors.some(e => e.includes('extensions')));
  });

  test('should detect missing scan.ignore', () => {
    const config = {
      project: { name: 'test-project' },
      scan: { extensions: ['.js'] },
      documentation: { outputDir: '.copilot/docs' }
    };

    const errors = validateConfig(config);
    assert.ok(errors.some(e => e.includes('ignore')));
  });

  test('should detect missing documentation.outputDir', () => {
    const config = {
      project: { name: 'test-project' },
      scan: { extensions: ['.js'], ignore: ['node_modules'] },
      documentation: {}
    };

    const errors = validateConfig(config);
    assert.ok(errors.some(e => e.includes('outputDir')));
  });

  test('should detect missing project.name', () => {
    const config = {
      project: {},
      scan: { extensions: ['.js'], ignore: ['node_modules'] },
      documentation: { outputDir: '.copilot/docs' }
    };

    const errors = validateConfig(config);
    assert.ok(errors.some(e => e.includes('project.name')));
  });
});

describe('Config File Integration', () => {
  test('should read and validate actual config.json', () => {
    const configPath = path.join(__dirname, '../config.json');
    assert.ok(fs.existsSync(configPath), 'config.json should exist');

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const errors = validateConfig(config);

    assert.strictEqual(errors.length, 0, `Config validation failed: ${errors.join(', ')}`);
  });
});
