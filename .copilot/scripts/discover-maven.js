#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Compile regex patterns once (performance optimization)
const GROUP_ID_REGEX = /<groupId>(.*?)<\/groupId>/;
const ARTIFACT_ID_REGEX = /<artifactId>(.*?)<\/artifactId>/;
const VERSION_REGEX = /<version>(.*?)<\/version>/;
const MODULES_REGEX = /<modules>([\s\S]*?)<\/modules>/;
const MODULE_REGEX = /<module>(.*?)<\/module>/g;
const DEPENDENCIES_REGEX = /<dependencies>([\s\S]*?)<\/dependencies>/;
const DEPENDENCY_REGEX = /<dependency>/g;

// Utility: Ensure directory exists
function ensureDirectoryExists(dirPath) {
  return fs.mkdir(dirPath, { recursive: true }).catch(() => {});
}

// Utility: Safe JSON read
async function readJsonFile(filePath, errorMessage) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(chalk.red(errorMessage), error.message);
    throw error;
  }
}

// Utility: Safe JSON write
async function writeJsonFile(filePath, data) {
  try {
    await ensureDirectoryExists(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(chalk.red(`Failed to write ${filePath}:`), error.message);
    throw error;
  }
}

/**
 * Parse pom.xml to extract module information
 */
async function parsePomXml(pomPath) {
  try {
    const content = await fs.readFile(pomPath, 'utf-8');

    // Extract groupId (using pre-compiled regex)
    const groupIdMatch = content.match(GROUP_ID_REGEX);
    const groupId = groupIdMatch ? groupIdMatch[1] : null;

    // Extract artifactId (using pre-compiled regex)
    const artifactIdMatch = content.match(ARTIFACT_ID_REGEX);
    const artifactId = artifactIdMatch ? artifactIdMatch[1] : null;

    // Extract version (using pre-compiled regex)
    const versionMatch = content.match(VERSION_REGEX);
    const version = versionMatch ? versionMatch[1] : null;

    // Extract modules (using pre-compiled regex)
    const modulesMatch = content.match(MODULES_REGEX);
    const modules = [];
    if (modulesMatch) {
      const moduleMatches = modulesMatch[1].matchAll(MODULE_REGEX);
      for (const match of moduleMatches) {
        modules.push(match[1]);
      }
    }

    // Extract dependencies count (using pre-compiled regex)
    const dependenciesMatch = content.match(DEPENDENCIES_REGEX);
    const dependenciesCount = dependenciesMatch
      ? (dependenciesMatch[1].match(DEPENDENCY_REGEX) || []).length
      : 0;

    return {
      groupId,
      artifactId,
      version,
      modules,
      dependenciesCount,
      path: path.relative(PROJECT_ROOT, pomPath)
    };
  } catch (error) {
    console.warn(chalk.yellow(`Failed to parse ${pomPath}: ${error.message}`));
    return null;
  }
}

/**
 * Discover Maven project structure
 */
async function discoverMavenProject() {
  const spinner = ora('Discovering Maven project structure...').start();

  try {
    // Find all pom.xml files
    const pomFiles = await glob('**/pom.xml', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/node_modules/**', '**/.copilot/**']
    });

    spinner.text = `Found ${pomFiles.length} pom.xml files`;

    // Parse all POMs in parallel (performance optimization)
    const modules = [];
    const pomInfos = await Promise.all(
      pomFiles.map(pomFile => {
        const pomPath = path.join(PROJECT_ROOT, pomFile);
        return parsePomXml(pomPath);
      })
    );

    for (const pomInfo of pomInfos) {
      if (pomInfo) {
        modules.push(pomInfo);
      }
    }

    // Identify parent POM
    const parentPom = modules.find(m => m.modules && m.modules.length > 0);

    // Categorize modules
    const modulesByType = {
      parent: parentPom ? [parentPom] : [],
      core: modules.filter(m => m.artifactId?.includes('core')),
      api: modules.filter(m => m.artifactId?.includes('api')),
      service: modules.filter(m => m.artifactId?.includes('service')),
      web: modules.filter(m => m.artifactId?.includes('web')),
      common: modules.filter(m => m.artifactId?.includes('common')),
      other: modules.filter(m =>
        !m.modules?.length &&
        !m.artifactId?.includes('core') &&
        !m.artifactId?.includes('api') &&
        !m.artifactId?.includes('service') &&
        !m.artifactId?.includes('web') &&
        !m.artifactId?.includes('common')
      )
    };

    // Find Java source files
    const javaFiles = await glob('**/src/**/*.java', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/.copilot/**']
    });

    // Categorize Java files
    const javaFilesByType = {
      main: javaFiles.filter(f => f.includes('/src/main/java/')),
      test: javaFiles.filter(f => f.includes('/src/test/java/')),
      controller: javaFiles.filter(f => f.includes('Controller.java')),
      service: javaFiles.filter(f => f.includes('Service.java')),
      repository: javaFiles.filter(f => f.includes('Repository.java')),
      entity: javaFiles.filter(f => f.includes('Entity.java') || f.includes('/entity/')),
      dto: javaFiles.filter(f => f.includes('DTO.java') || f.includes('Dto.java') || f.includes('/dto/')),
      config: javaFiles.filter(f => f.includes('Config.java') || f.includes('/config/'))
    };

    // Find resource files
    const resourceFiles = await glob('**/src/main/resources/**/*', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/.copilot/**'],
      nodir: true
    });

    const discovery = {
      timestamp: new Date().toISOString(),
      projectType: 'maven-multimodule',
      totalModules: modules.length,
      totalJavaFiles: javaFiles.length,
      totalResourceFiles: resourceFiles.length,
      modules: modulesByType,
      javaFiles: javaFilesByType,
      parentPom: parentPom ? {
        groupId: parentPom.groupId,
        artifactId: parentPom.artifactId,
        version: parentPom.version,
        modules: parentPom.modules
      } : null,
      statistics: {
        mainSourceFiles: javaFilesByType.main.length,
        testFiles: javaFilesByType.test.length,
        controllers: javaFilesByType.controller.length,
        services: javaFilesByType.service.length,
        repositories: javaFilesByType.repository.length,
        entities: javaFilesByType.entity.length,
        dtos: javaFilesByType.dto.length,
        configs: javaFilesByType.config.length
      }
    };

    // Save discovery results
    const outputPath = path.join(__dirname, '../docs/maven-discovery.json');
    await writeJsonFile(outputPath, discovery);

    spinner.succeed(chalk.green('Maven discovery complete!'));

    console.log(chalk.cyan('\n📊 Maven Project Summary:'));
    console.log(`  Total modules: ${modules.length}`);
    console.log(`  Total Java files: ${javaFiles.length}`);
    console.log(`  Main source files: ${javaFilesByType.main.length}`);
    console.log(`  Test files: ${javaFilesByType.test.length}`);
    console.log(`  Controllers: ${javaFilesByType.controller.length}`);
    console.log(`  Services: ${javaFilesByType.service.length}`);
    console.log(`  Repositories: ${javaFilesByType.repository.length}`);
    console.log(`  Entities: ${javaFilesByType.entity.length}`);

    if (parentPom) {
      console.log(chalk.cyan('\n📦 Parent POM:'));
      console.log(`  GroupId: ${parentPom.groupId}`);
      console.log(`  ArtifactId: ${parentPom.artifactId}`);
      console.log(`  Version: ${parentPom.version}`);
      console.log(`  Modules: ${parentPom.modules.join(', ')}`);
    }

    return discovery;

  } catch (error) {
    spinner.fail(chalk.red('Maven discovery failed'));
    console.error(error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  discoverMavenProject();
}

export { discoverMavenProject };
