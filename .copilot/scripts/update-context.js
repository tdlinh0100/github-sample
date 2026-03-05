#!/usr/bin/env node

import { discoverProject } from './discover.js';
import { generateDocs } from './generate-docs.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function updateContext() {
  console.log(chalk.cyan('🔄 Updating Copilot context...\n'));

  try {
    // 1. Run discovery
    await discoverProject();

    // 2. Generate docs
    await generateDocs();

    // 3. Log update
    const logPath = path.join(__dirname, '../logs/updates.log');
    const logEntry = `${new Date().toISOString()} - Context updated\n`;
    fs.appendFileSync(logPath, logEntry);

    console.log(chalk.green('\n✅ Context update complete!\n'));
  } catch (error) {
    console.error(chalk.red('❌ Update failed:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateContext();
}

export { updateContext };
