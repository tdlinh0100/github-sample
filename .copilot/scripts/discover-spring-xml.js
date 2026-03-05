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
const BEAN_REGEX = /<bean[^>]*id="([^"]*)"[^>]*class="([^"]*)"/g;
const COMPONENT_SCAN_REGEX = /<context:component-scan[^>]*base-package="([^"]*)"/g;
const IMPORT_REGEX = /<import[^>]*resource="([^"]*)"/g;
const PROPERTY_PLACEHOLDER_REGEX = /<context:property-placeholder[^>]*location="([^"]*)"/g;

// Utility: Ensure directory exists
function ensureDirectoryExists(dirPath) {
  return fs.mkdir(dirPath, { recursive: true }).catch(() => {});
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
 * Parse Spring XML config to extract bean definitions
 */
async function parseSpringXml(xmlPath) {
  try {
    const content = await fs.readFile(xmlPath, 'utf-8');

    // Extract bean definitions (using pre-compiled regex)
    const beanMatches = content.matchAll(BEAN_REGEX);
    const beans = [];
    for (const match of beanMatches) {
      beans.push({
        id: match[1],
        class: match[2]
      });
    }

    // Extract component-scan base packages (using pre-compiled regex)
    const scanMatches = content.matchAll(COMPONENT_SCAN_REGEX);
    const scanPackages = [];
    for (const match of scanMatches) {
      scanPackages.push(match[1]);
    }

    // Extract imports (using pre-compiled regex)
    const importMatches = content.matchAll(IMPORT_REGEX);
    const imports = [];
    for (const match of importMatches) {
      imports.push(match[1]);
    }

    // Extract property placeholders (using pre-compiled regex)
    const propertyMatches = content.matchAll(PROPERTY_PLACEHOLDER_REGEX);
    const propertyFiles = [];
    for (const match of propertyMatches) {
      propertyFiles.push(match[1]);
    }

    return {
      path: path.relative(PROJECT_ROOT, xmlPath),
      beans: beans,
      componentScanPackages: scanPackages,
      imports: imports,
      propertyFiles: propertyFiles,
      totalBeans: beans.length
    };
  } catch (error) {
    console.warn(chalk.yellow(`Failed to parse ${xmlPath}: ${error.message}`));
    return null;
  }
}

/**
 * Discover internal libraries
 */
async function discoverInternalLibs(libPaths) {
  const internalLibs = [];

  for (const libPath of libPaths) {
    const fullPath = path.join(PROJECT_ROOT, libPath);

    try {
      await fs.access(fullPath);

      // Find all Java files in lib
      const javaFiles = await glob('**/*.java', {
        cwd: fullPath,
        ignore: ['**/target/**', '**/test/**']
      });

      // Find all POMs in lib
      const pomFiles = await glob('**/pom.xml', {
        cwd: fullPath,
        ignore: ['**/target/**']
      });

      if (javaFiles.length > 0 || pomFiles.length > 0) {
        internalLibs.push({
          path: libPath,
          javaFiles: javaFiles.length,
          modules: pomFiles.length,
          files: javaFiles
        });
      }
    } catch (error) {
      // Path doesn't exist, skip
    }
  }

  return internalLibs;
}

/**
 * Check if file contains annotation
 */
async function fileContainsAnnotation(filePath, annotation) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.includes(annotation);
  } catch (error) {
    return false;
  }
}

/**
 * Check multiple annotations in a single file read (performance optimization)
 */
async function checkAnnotations(filePath, annotations) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return annotations.map(annotation => content.includes(annotation));
  } catch (error) {
    return annotations.map(() => false);
  }
}

/**
 * Discover Spring XML project structure
 */
async function discoverSpringXmlProject() {
  const spinner = ora('Discovering Spring XML project structure...').start();

  try {
    // Load config
    const configPath = path.join(__dirname, '../config.json');
    const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

    // Find all Spring XML files
    const springXmlPatterns = [
      '**/applicationContext*.xml',
      '**/spring-*.xml',
      '**/root-context.xml',
      '**/servlet-context.xml',
      '**/beans.xml',
      '**/context.xml'
    ];

    const xmlFiles = [];
    for (const pattern of springXmlPatterns) {
      const files = await glob(pattern, {
        cwd: PROJECT_ROOT,
        ignore: ['**/target/**', '**/node_modules/**', '**/.copilot/**']
      });
      xmlFiles.push(...files);
    }

    // Remove duplicates
    const uniqueXmlFiles = [...new Set(xmlFiles)];

    spinner.text = `Found ${uniqueXmlFiles.length} Spring XML config files`;

    // Parse all Spring XML files in parallel (performance optimization)
    const springConfigs = [];
    let totalBeans = 0;
    const allComponentScanPackages = new Set();

    const xmlInfos = await Promise.all(
      uniqueXmlFiles.map(xmlFile => {
        const xmlPath = path.join(PROJECT_ROOT, xmlFile);
        return parseSpringXml(xmlPath);
      })
    );

    for (const xmlInfo of xmlInfos) {
      if (xmlInfo) {
        springConfigs.push(xmlInfo);
        totalBeans += xmlInfo.totalBeans;
        xmlInfo.componentScanPackages.forEach(pkg => allComponentScanPackages.add(pkg));
      }
    }

    // Find web.xml files
    const webXmlFiles = await glob('**/WEB-INF/web.xml', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/.copilot/**']
    });

    // Find all Java files
    const javaFiles = await glob('**/src/**/*.java', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/.copilot/**']
    });

    spinner.text = `Analyzing ${javaFiles.length} Java files...`;

    // Categorize Java files by Spring annotations
    const javaFilesByType = {
      controller: [],
      service: [],
      repository: [],
      component: []
    };

    // Check annotations in parallel (in batches to avoid too many open files)
    const BATCH_SIZE = 50;
    for (let i = 0; i < javaFiles.length; i += BATCH_SIZE) {
      const batch = javaFiles.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (file) => {
          const fullPath = path.join(PROJECT_ROOT, file);
          // Single file read for all annotations (performance optimization)
          const [isController, isRestController, isService, isRepository, isComponent] =
            await checkAnnotations(fullPath, ['@Controller', '@RestController', '@Service', '@Repository', '@Component']);
          return {
            file,
            isController: isController || isRestController,
            isService,
            isRepository,
            isComponent
          };
        })
      );

      results.forEach(result => {
        if (result.isController) javaFilesByType.controller.push(result.file);
        if (result.isService) javaFilesByType.service.push(result.file);
        if (result.isRepository) javaFilesByType.repository.push(result.file);
        if (result.isComponent) javaFilesByType.component.push(result.file);
      });
    }

    // Discover internal libraries
    const internalLibPaths = config.internalLibs?.paths || [];
    const internalLibs = await discoverInternalLibs(internalLibPaths);

    // Find all POMs
    const pomFiles = await glob('**/pom.xml', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**', '**/.copilot/**']
    });

    const discovery = {
      timestamp: new Date().toISOString(),
      projectType: 'spring-xml-multimodule',
      framework: 'Spring Framework (XML-based)',
      totalSpringXmlFiles: uniqueXmlFiles.length,
      totalBeans: totalBeans,
      totalJavaFiles: javaFiles.length,
      totalModules: pomFiles.length,
      totalInternalLibs: internalLibs.length,
      springConfigs: springConfigs,
      componentScanPackages: Array.from(allComponentScanPackages),
      webXmlFiles: webXmlFiles,
      javaFilesByType: {
        controllers: javaFilesByType.controller.length,
        services: javaFilesByType.service.length,
        repositories: javaFilesByType.repository.length,
        components: javaFilesByType.component.length
      },
      internalLibs: internalLibs,
      statistics: {
        springXmlConfigs: uniqueXmlFiles.length,
        totalBeanDefinitions: totalBeans,
        componentScanPackages: allComponentScanPackages.size,
        webApplications: webXmlFiles.length,
        controllers: javaFilesByType.controller.length,
        services: javaFilesByType.service.length,
        repositories: javaFilesByType.repository.length,
        internalLibModules: internalLibs.reduce((sum, lib) => sum + lib.modules, 0),
        internalLibJavaFiles: internalLibs.reduce((sum, lib) => sum + lib.javaFiles, 0)
      }
    };

    // Save discovery results
    const outputPath = path.join(__dirname, '../docs/spring-xml-discovery.json');
    await writeJsonFile(outputPath, discovery);

    spinner.succeed(chalk.green('Spring XML discovery complete!'));

    console.log(chalk.cyan('\n📊 Spring XML Project Summary:'));
    console.log(`  Spring XML configs: ${uniqueXmlFiles.length}`);
    console.log(`  Total bean definitions: ${totalBeans}`);
    console.log(`  Component-scan packages: ${allComponentScanPackages.size}`);
    console.log(`  Web applications: ${webXmlFiles.length}`);
    console.log(`  Total Java files: ${javaFiles.length}`);
    console.log(`  Controllers: ${javaFilesByType.controller.length}`);
    console.log(`  Services: ${javaFilesByType.service.length}`);
    console.log(`  Repositories: ${javaFilesByType.repository.length}`);

    if (internalLibs.length > 0) {
      console.log(chalk.cyan('\n📚 Internal Libraries:'));
      internalLibs.forEach(lib => {
        console.log(`  ${lib.path}: ${lib.javaFiles} Java files, ${lib.modules} modules`);
      });
    }

    if (allComponentScanPackages.size > 0) {
      console.log(chalk.cyan('\n🔍 Component Scan Packages:'));
      Array.from(allComponentScanPackages).forEach(pkg => {
        console.log(`  - ${pkg}`);
      });
    }

    return discovery;

  } catch (error) {
    spinner.fail(chalk.red('Spring XML discovery failed'));
    console.error(error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  discoverSpringXmlProject();
}

export { discoverSpringXmlProject };
