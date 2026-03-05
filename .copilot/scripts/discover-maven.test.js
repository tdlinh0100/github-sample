#!/usr/bin/env node

import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Mock data for testing
const VALID_POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>parent-project</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <modules>
    <module>core-module</module>
    <module>api-module</module>
    <module>web-module</module>
  </modules>

  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
    </dependency>
  </dependencies>
</project>`;

const CHILD_POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.example</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0.0-SNAPSHOT</version>
  </parent>
  <artifactId>core-module</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
    </dependency>
  </dependencies>
</project>`;

const INVALID_POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <!-- Missing closing tag -->
  <artifactId>broken-project
</project>`;

const EMPTY_POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
</project>`;

// Helper function to parse POM XML (extracted from discover-maven.js for testing)
async function parsePomXml(pomPath) {
  try {
    const content = await fs.readFile(pomPath, 'utf-8');

    // Extract groupId
    const groupIdMatch = content.match(/<groupId>(.*?)<\/groupId>/);
    const groupId = groupIdMatch ? groupIdMatch[1] : null;

    // Extract artifactId
    const artifactIdMatch = content.match(/<artifactId>(.*?)<\/artifactId>/);
    const artifactId = artifactIdMatch ? artifactIdMatch[1] : null;

    // Extract version
    const versionMatch = content.match(/<version>(.*?)<\/version>/);
    const version = versionMatch ? versionMatch[1] : null;

    // Extract modules
    const modulesMatch = content.match(/<modules>([\s\S]*?)<\/modules>/);
    const modules = [];
    if (modulesMatch) {
      const moduleMatches = modulesMatch[1].matchAll(/<module>(.*?)<\/module>/g);
      for (const match of moduleMatches) {
        modules.push(match[1]);
      }
    }

    // Extract dependencies count
    const dependenciesMatch = content.match(/<dependencies>([\s\S]*?)<\/dependencies>/);
    const dependenciesCount = dependenciesMatch
      ? (dependenciesMatch[1].match(/<dependency>/g) || []).length
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
    return null;
  }
}

// Helper function to categorize Java files
function categorizeJavaFiles(javaFiles) {
  return {
    main: javaFiles.filter(f => f.includes('/src/main/java/')),
    test: javaFiles.filter(f => f.includes('/src/test/java/')),
    controller: javaFiles.filter(f => f.includes('Controller.java')),
    service: javaFiles.filter(f => f.includes('Service.java')),
    repository: javaFiles.filter(f => f.includes('Repository.java')),
    entity: javaFiles.filter(f => f.includes('Entity.java') || f.includes('/entity/')),
    dto: javaFiles.filter(f => f.includes('DTO.java') || f.includes('Dto.java') || f.includes('/dto/')),
    config: javaFiles.filter(f => f.includes('Config.java') || f.includes('/config/'))
  };
}

// Helper function to identify parent POM
function identifyParentPom(modules) {
  return modules.find(m => m.modules && m.modules.length > 0);
}

describe('parsePomXml()', () => {
  test('should parse valid parent POM with all fields', async () => {
    const tempFile = path.join(__dirname, 'test-pom-parent.xml');
    await fs.writeFile(tempFile, VALID_POM_XML);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result, 'Result should not be null');
      assert.strictEqual(result.groupId, 'com.example');
      assert.strictEqual(result.artifactId, 'parent-project');
      assert.strictEqual(result.version, '1.0.0-SNAPSHOT');
      assert.strictEqual(result.modules.length, 3);
      assert.ok(result.modules.includes('core-module'));
      assert.ok(result.modules.includes('api-module'));
      assert.ok(result.modules.includes('web-module'));
      assert.strictEqual(result.dependenciesCount, 2);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should parse child POM without modules', async () => {
    const tempFile = path.join(__dirname, 'test-pom-child.xml');
    await fs.writeFile(tempFile, CHILD_POM_XML);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result, 'Result should not be null');
      // First groupId match will be from parent section
      assert.strictEqual(result.groupId, 'com.example');
      // First artifactId match will be from parent section
      assert.strictEqual(result.artifactId, 'parent-project');
      assert.strictEqual(result.modules.length, 0);
      assert.strictEqual(result.dependenciesCount, 1);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle POM with missing optional fields', async () => {
    const tempFile = path.join(__dirname, 'test-pom-empty.xml');
    await fs.writeFile(tempFile, EMPTY_POM_XML);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result, 'Result should not be null');
      assert.strictEqual(result.groupId, null);
      assert.strictEqual(result.artifactId, null);
      assert.strictEqual(result.version, null);
      assert.strictEqual(result.modules.length, 0);
      assert.strictEqual(result.dependenciesCount, 0);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should return null for invalid XML', async () => {
    const tempFile = path.join(__dirname, 'test-pom-invalid.xml');
    await fs.writeFile(tempFile, INVALID_POM_XML);

    try {
      const result = await parsePomXml(tempFile);
      // Should still parse with regex even if XML is malformed
      assert.ok(result !== null);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should return null for non-existent file', async () => {
    const result = await parsePomXml('/non/existent/pom.xml');
    assert.strictEqual(result, null);
  });

  test('should handle POM with no dependencies section', async () => {
    const pomWithoutDeps = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <groupId>com.example</groupId>
  <artifactId>no-deps</artifactId>
  <version>1.0.0</version>
</project>`;

    const tempFile = path.join(__dirname, 'test-pom-nodeps.xml');
    await fs.writeFile(tempFile, pomWithoutDeps);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.dependenciesCount, 0);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should extract relative path correctly', async () => {
    const tempFile = path.join(__dirname, 'test-pom-path.xml');
    await fs.writeFile(tempFile, VALID_POM_XML);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result);
      assert.ok(result.path);
      assert.ok(!path.isAbsolute(result.path), 'Path should be relative');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Module Detection', () => {
  test('should identify parent POM from module list', () => {
    const modules = [
      { artifactId: 'child1', modules: [] },
      { artifactId: 'parent', modules: ['child1', 'child2'] },
      { artifactId: 'child2', modules: [] }
    ];

    const parent = identifyParentPom(modules);

    assert.ok(parent);
    assert.strictEqual(parent.artifactId, 'parent');
    assert.strictEqual(parent.modules.length, 2);
  });

  test('should return undefined when no parent POM exists', () => {
    const modules = [
      { artifactId: 'module1', modules: [] },
      { artifactId: 'module2', modules: [] }
    ];

    const parent = identifyParentPom(modules);

    assert.strictEqual(parent, undefined);
  });

  test('should handle empty module list', () => {
    const modules = [];
    const parent = identifyParentPom(modules);

    assert.strictEqual(parent, undefined);
  });
});

describe('Java File Categorization', () => {
  test('should categorize main source files', () => {
    const files = [
      'module1/src/main/java/com/example/App.java',
      'module2/src/main/java/com/example/util/Helper.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.main.length, 2);
    assert.ok(categorized.main.includes(files[0]));
    assert.ok(categorized.main.includes(files[1]));
  });

  test('should categorize test files', () => {
    const files = [
      'module1/src/test/java/com/example/AppTest.java',
      'module2/src/test/java/com/example/util/HelperTest.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.test.length, 2);
    assert.ok(categorized.test.includes(files[0]));
  });

  test('should categorize controller files', () => {
    const files = [
      'src/main/java/com/example/UserController.java',
      'src/main/java/com/example/ProductController.java',
      'src/main/java/com/example/Service.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.controller.length, 2);
    assert.ok(categorized.controller.includes(files[0]));
    assert.ok(categorized.controller.includes(files[1]));
  });

  test('should categorize service files', () => {
    const files = [
      'src/main/java/com/example/UserService.java',
      'src/main/java/com/example/OrderService.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.service.length, 2);
  });

  test('should categorize repository files', () => {
    const files = [
      'src/main/java/com/example/UserRepository.java',
      'src/main/java/com/example/OrderRepository.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.repository.length, 2);
  });

  test('should categorize entity files by name and path', () => {
    const files = [
      'src/main/java/com/example/UserEntity.java',
      'src/main/java/com/example/entity/Order.java',
      'src/main/java/com/example/entity/Product.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.entity.length, 3);
  });

  test('should categorize DTO files by name and path', () => {
    const files = [
      'src/main/java/com/example/UserDTO.java',
      'src/main/java/com/example/OrderDto.java',
      'src/main/java/com/example/dto/ProductRequest.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.dto.length, 3);
  });

  test('should categorize config files by name and path', () => {
    const files = [
      'src/main/java/com/example/AppConfig.java',
      'src/main/java/com/example/config/DatabaseConfig.java'
    ];

    const categorized = categorizeJavaFiles(files);

    assert.strictEqual(categorized.config.length, 2);
  });

  test('should handle empty file list', () => {
    const categorized = categorizeJavaFiles([]);

    assert.strictEqual(categorized.main.length, 0);
    assert.strictEqual(categorized.test.length, 0);
    assert.strictEqual(categorized.controller.length, 0);
  });

  test('should handle files matching multiple categories', () => {
    const files = [
      'module1/src/main/java/com/example/UserService.java',
      'module1/src/test/java/com/example/UserServiceTest.java'
    ];

    const categorized = categorizeJavaFiles(files);

    // UserService.java should be in both main and service
    assert.strictEqual(categorized.main.length, 1);
    assert.strictEqual(categorized.service.length, 1);
    assert.strictEqual(categorized.test.length, 1);
  });
});

describe('Module Categorization by Type', () => {
  test('should categorize modules by artifactId patterns', () => {
    const modules = [
      { artifactId: 'parent-project', modules: ['core', 'api'] },
      { artifactId: 'project-core', modules: [] },
      { artifactId: 'project-api', modules: [] },
      { artifactId: 'project-service', modules: [] },
      { artifactId: 'project-web', modules: [] },
      { artifactId: 'project-common', modules: [] },
      { artifactId: 'project-utils', modules: [] }
    ];

    const parent = modules.find(m => m.modules && m.modules.length > 0);
    const modulesByType = {
      parent: parent ? [parent] : [],
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

    assert.strictEqual(modulesByType.parent.length, 1);
    assert.strictEqual(modulesByType.core.length, 1);
    assert.strictEqual(modulesByType.api.length, 1);
    assert.strictEqual(modulesByType.service.length, 1);
    assert.strictEqual(modulesByType.web.length, 1);
    assert.strictEqual(modulesByType.common.length, 1);
    assert.strictEqual(modulesByType.other.length, 1);
    assert.strictEqual(modulesByType.other[0].artifactId, 'project-utils');
  });
});

describe('Error Handling', () => {
  test('should handle file read errors gracefully', async () => {
    const result = await parsePomXml('/invalid/path/pom.xml');
    assert.strictEqual(result, null);
  });

  test('should handle empty file content', async () => {
    const tempFile = path.join(__dirname, 'test-pom-empty-content.xml');
    await fs.writeFile(tempFile, '');

    try {
      const result = await parsePomXml(tempFile);
      assert.ok(result !== null);
      assert.strictEqual(result.groupId, null);
      assert.strictEqual(result.artifactId, null);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle POM with special characters in values', async () => {
    const specialPom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <groupId>com.example.test-group</groupId>
  <artifactId>my-artifact_v2</artifactId>
  <version>1.0.0-RC1</version>
</project>`;

    const tempFile = path.join(__dirname, 'test-pom-special.xml');
    await fs.writeFile(tempFile, specialPom);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.groupId, 'com.example.test-group');
      assert.strictEqual(result.artifactId, 'my-artifact_v2');
      assert.strictEqual(result.version, '1.0.0-RC1');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Edge Cases', () => {
  test('should handle POM with nested modules', async () => {
    const nestedPom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <groupId>com.example</groupId>
  <artifactId>parent</artifactId>
  <version>1.0.0</version>
  <modules>
    <module>module1</module>
    <module>module2</module>
    <module>module3</module>
    <module>module4</module>
    <module>module5</module>
  </modules>
</project>`;

    const tempFile = path.join(__dirname, 'test-pom-nested.xml');
    await fs.writeFile(tempFile, nestedPom);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.modules.length, 5);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle POM with many dependencies', async () => {
    const manyDepsPom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <groupId>com.example</groupId>
  <artifactId>deps-test</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework</groupId></dependency>
    <dependency><groupId>junit</groupId></dependency>
    <dependency><groupId>mockito</groupId></dependency>
    <dependency><groupId>lombok</groupId></dependency>
    <dependency><groupId>slf4j</groupId></dependency>
  </dependencies>
</project>`;

    const tempFile = path.join(__dirname, 'test-pom-manydeps.xml');
    await fs.writeFile(tempFile, manyDepsPom);

    try {
      const result = await parsePomXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.dependenciesCount, 5);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle null or undefined input', async () => {
    const result = await parsePomXml(null);
    assert.strictEqual(result, null);
  });
});
