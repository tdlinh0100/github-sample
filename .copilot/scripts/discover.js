#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { discoverMavenProject } from './discover-maven.js';
import { discoverSpringXmlProject } from './discover-spring-xml.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FIX 1: Define PROJECT_ROOT constant to replace process.cwd()
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Logger implementation with structured logging
class Logger {
  constructor(logFilePath) {
    this.logFilePath = logFilePath;
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this._ensureLogDir();
  }

  _ensureLogDir() {
    const dir = path.dirname(this.logFilePath);
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
    }
  }

  _write(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    try {
      if (fsSync.existsSync(this.logFilePath)) {
        const stats = fsSync.statSync(this.logFilePath);
        if (stats.size >= this.maxLogSize) {
          this._rotate();
        }
      }

      fsSync.appendFileSync(this.logFilePath, logLine);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  _rotate() {
    try {
      const backupPath = this.logFilePath.replace('.log', `.${Date.now()}.log`);
      fsSync.renameSync(this.logFilePath, backupPath);

      const logDir = path.dirname(this.logFilePath);
      const logName = path.basename(this.logFilePath, '.log');
      const rotatedLogs = fsSync.readdirSync(logDir)
        .filter(f => f.startsWith(logName) && f !== path.basename(this.logFilePath))
        .sort()
        .reverse();

      rotatedLogs.slice(5).forEach(log => {
        fsSync.unlinkSync(path.join(logDir, log));
      });
    } catch (error) {
      console.error('Failed to rotate log:', error.message);
    }
  }

  info(message, meta) {
    this._write('info', message, meta);
  }

  warn(message, meta) {
    this._write('warn', message, meta);
  }

  error(message, meta) {
    this._write('error', message, meta);
  }

  debug(message, meta) {
    this._write('debug', message, meta);
  }
}

const logger = new Logger(path.join(__dirname, '../logs/discover.log'));

let config;

/**
 * Validates the configuration object
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  if (!config) {
    throw new Error('Configuration is missing');
  }

  if (!config.scan) {
    throw new Error('Configuration missing required field: scan');
  }

  if (!Array.isArray(config.scan.extensions)) {
    throw new Error('Configuration field scan.extensions must be an array');
  }

  if (config.scan.extensions.length === 0) {
    throw new Error('Configuration field scan.extensions cannot be empty');
  }

  if (!Array.isArray(config.scan.ignore)) {
    throw new Error('Configuration field scan.ignore must be an array');
  }

  if (typeof config.scan.maxFileSize !== 'number' || config.scan.maxFileSize <= 0) {
    throw new Error('Configuration field scan.maxFileSize must be a positive number');
  }
}

/**
 * Loads and validates configuration
 * @returns {Promise<Object>} Validated configuration object
 */
async function loadConfig() {
  const configPath = path.join(__dirname, '../config.json');
  const loadedConfig = await readJsonFile(configPath);
  validateConfig(loadedConfig);
  return loadedConfig;
}

// FIX 2: Helper function to ensure directory exists before writing
async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Safely reads and parses a JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON object
 */
async function readJsonFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    logger.error(`Error reading ${filePath}`, { error: error.message });
    console.error(chalk.red(`Error reading ${filePath}: ${error.message}`));
    throw error;
  }
}

/**
 * Safely writes JSON data to a file
 * @param {string} filePath - Path to write to
 * @param {Object} data - Data to write
 */
async function writeJsonFile(filePath, data) {
  try {
    await ensureDirectoryExists(filePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    logger.info(`Successfully wrote file`, { filePath });
  } catch (error) {
    logger.error(`Error writing ${filePath}`, { error: error.message });
    console.error(chalk.red(`Error writing ${filePath}: ${error.message}`));
    throw error;
  }
}

// Improved file categorization with regex patterns
const categoryPatterns = {
  tests: /\.(test|spec)\.(js|ts|jsx|tsx)$|__tests__|__mocks__/,
  frontend: /\/(components|pages|app|views|ui|layouts|hooks)\//,
  backend: /\/(api|server|services|controllers|routes|middleware|models)\//,
  shared: /\/(utils|lib|types|helpers|constants|shared|common)\//,
  config: /\/config\/|\.config\.(js|ts|mjs|cjs)$|^(\.env|\.eslintrc|\.prettierrc|tsconfig\.json|package\.json)/
};

/**
 * Categorizes a file based on its path using regex patterns
 * @param {string} relativePath - Relative path of the file
 * @returns {string} Category name
 */
function categorizeFile(relativePath) {
  // Check in order of specificity
  if (categoryPatterns.tests.test(relativePath)) {
    return 'tests';
  }
  if (categoryPatterns.frontend.test(relativePath)) {
    return 'frontend';
  }
  if (categoryPatterns.backend.test(relativePath)) {
    return 'backend';
  }
  if (categoryPatterns.config.test(relativePath)) {
    return 'config';
  }
  if (categoryPatterns.shared.test(relativePath)) {
    return 'shared';
  }
  return 'shared'; // Default
}

async function discoverProject() {
  // Load and validate config
  if (!config) {
    config = await loadConfig();
  }

  const spinner = ora('Discovering project structure...').start();
  logger.info('Starting project discovery');

  try {
    // Auto-detect Maven and Spring XML projects
    const hasPomXml = fsSync.existsSync(path.join(PROJECT_ROOT, 'pom.xml'));
    const hasSpringXml = await glob('**/applicationContext*.xml', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/node_modules/**', '**/.copilot/**']
    }).then(files => files.length > 0);

    let mavenDiscovery = null;
    let springXmlDiscovery = null;

    if (hasPomXml) {
      spinner.text = 'Detecting Maven project...';
      logger.info('Maven project detected, running Maven discovery');
      try {
        mavenDiscovery = await discoverMavenProject();
      } catch (error) {
        logger.warn('Maven discovery failed', { error: error.message });
        console.log(chalk.yellow('⚠ Maven discovery failed, continuing with standard discovery'));
      }
    }

    if (hasSpringXml) {
      spinner.text = 'Detecting Spring XML project...';
      logger.info('Spring XML project detected, running Spring XML discovery');
      try {
        springXmlDiscovery = await discoverSpringXmlProject();
      } catch (error) {
        logger.warn('Spring XML discovery failed', { error: error.message });
        console.log(chalk.yellow('⚠ Spring XML discovery failed, continuing with standard discovery'));
      }
    }

    spinner.text = 'Discovering project structure...';

    // 1. Find all source files
    const patterns = config.scan.extensions.map(ext => `**/*${ext}`);
    const files = await glob(patterns, {
      ignore: config.scan.ignore,
      cwd: path.resolve(__dirname, '../..'),
      absolute: true
    });

    logger.info(`Found ${files.length} files`);
    spinner.text = `Found ${files.length} files`;

    // 2. Categorize files with batch processing (performance optimization)
    const categorized = {
      frontend: [],
      backend: [],
      shared: [],
      tests: [],
      config: []
    };

    let processedCount = 0;
    const totalFiles = files.length;

    // Batch process file stats in parallel
    const BATCH_SIZE = 100;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (file) => {
          const relativePath = path.relative(PROJECT_ROOT, file);

          // Check file size before processing
          try {
            const stats = await fs.stat(file);
            if (stats.size > config.scan.maxFileSize) {
              logger.warn(`Skipping large file`, {
                file: relativePath,
                size: stats.size,
                maxSize: config.scan.maxFileSize
              });
              console.log(chalk.yellow(`⚠ Skipping ${relativePath}: file size (${stats.size} bytes) exceeds maxFileSize (${config.scan.maxFileSize} bytes)`));
              return null;
            }
            return { relativePath, category: categorizeFile(relativePath) };
          } catch (error) {
            logger.warn(`Could not check file size`, { file: relativePath, error: error.message });
            console.log(chalk.yellow(`⚠ Could not check size for ${relativePath}: ${error.message}`));
            return null;
          }
        })
      );

      // Process batch results
      for (const result of batchResults) {
        if (result) {
          categorized[result.category].push(result.relativePath);
        }
      }

      processedCount += batch.length;
      if (processedCount % 100 === 0) {
        spinner.text = `Processing files... ${processedCount}/${totalFiles}`;
        logger.debug(`Processing progress`, { processed: processedCount, total: totalFiles });
      }
    }

    logger.info('File categorization complete', {
      frontend: categorized.frontend.length,
      backend: categorized.backend.length,
      shared: categorized.shared.length,
      tests: categorized.tests.length,
      config: categorized.config.length
    });

    // 3. Detect tech stack
    let packageJson = { dependencies: {}, devDependencies: {} };
    // FIX 1: Use PROJECT_ROOT instead of process.cwd()
    const packageJsonPath = path.resolve(PROJECT_ROOT, 'package.json');

    try {
      await fs.access(packageJsonPath);
      // FIX 3: Use readJsonFile helper with error handling
      packageJson = await readJsonFile(packageJsonPath);
      logger.info('Package.json loaded', { name: packageJson.name });
    } catch {
      logger.warn('Package.json not found, using defaults');
      // package.json doesn't exist, use defaults
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

    logger.info('Tech stack detected', techStack);

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
        // FIX 1: Use PROJECT_ROOT instead of process.cwd()
        cwd: PROJECT_ROOT,
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

    logger.info('Entry points discovered', {
      frontend: entryPoints.frontend.length,
      backend: entryPoints.backend.length
    });

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
      },
      maven: mavenDiscovery,
      springXml: springXmlDiscovery
    };

    const outputPath = path.join(__dirname, '../docs/discovery.json');
    // FIX 2 & 3: Use writeJsonFile helper with directory creation and error handling
    await writeJsonFile(outputPath, discovery);

    spinner.succeed(chalk.green('Discovery complete!'));
    logger.info('Discovery completed successfully', { outputPath });

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
    logger.error('Discovery failed', { error: error.message, stack: error.stack });
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverProject();
}

export { discoverProject };
