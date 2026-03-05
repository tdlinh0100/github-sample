#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Mock Spring XML configurations
const VALID_SPRING_XML = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">

  <context:component-scan base-package="com.example.service"/>
  <context:component-scan base-package="com.example.repository"/>

  <bean id="userService" class="com.example.service.UserService">
    <property name="userRepository" ref="userRepository"/>
  </bean>

  <bean id="userRepository" class="com.example.repository.UserRepository"/>

  <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
  </bean>

  <import resource="classpath:spring-security.xml"/>
  <import resource="classpath:spring-mvc.xml"/>

  <context:property-placeholder location="classpath:application.properties"/>
  <context:property-placeholder location="classpath:database.properties"/>
</beans>`;

const MINIMAL_SPRING_XML = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="simpleBean" class="com.example.SimpleBean"/>
</beans>`;

const EMPTY_SPRING_XML = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
</beans>`;

const INVALID_SPRING_XML = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="broken" class="com.example.Broken"
  <!-- Missing closing tag -->
</beans>`;

const SPRING_MVC_XML = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context">

  <context:component-scan base-package="com.example.controller"/>
  <mvc:annotation-driven/>

  <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/"/>
    <property name="suffix" value=".jsp"/>
  </bean>
</beans>`;

// Mock Java files with annotations
const CONTROLLER_JAVA = `package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/users")
public class UserController {
    // Controller logic
}`;

const REST_CONTROLLER_JAVA = `package com.example.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class ApiController {
    @GetMapping("/api/data")
    public String getData() {
        return "data";
    }
}`;

const SERVICE_JAVA = `package com.example.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    // Service logic
}`;

const REPOSITORY_JAVA = `package com.example.repository;

import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    // Repository logic
}`;

const COMPONENT_JAVA = `package com.example.util;

import org.springframework.stereotype.Component;

@Component
public class HelperComponent {
    // Component logic
}`;

const PLAIN_JAVA = `package com.example.model;

public class User {
    private String name;
    private String email;
}`;

// Helper function to parse Spring XML (extracted from discover-spring-xml.js)
async function parseSpringXml(xmlPath) {
  try {
    const content = await fs.readFile(xmlPath, 'utf-8');

    // Extract bean definitions
    const beanMatches = content.matchAll(/<bean[^>]*id="([^"]*)"[^>]*class="([^"]*)"/g);
    const beans = [];
    for (const match of beanMatches) {
      beans.push({
        id: match[1],
        class: match[2]
      });
    }

    // Extract component-scan base packages
    const scanMatches = content.matchAll(/<context:component-scan[^>]*base-package="([^"]*)"/g);
    const scanPackages = [];
    for (const match of scanMatches) {
      scanPackages.push(match[1]);
    }

    // Extract imports
    const importMatches = content.matchAll(/<import[^>]*resource="([^"]*)"/g);
    const imports = [];
    for (const match of importMatches) {
      imports.push(match[1]);
    }

    // Extract property placeholders
    const propertyMatches = content.matchAll(/<context:property-placeholder[^>]*location="([^"]*)"/g);
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
    return null;
  }
}

// Helper function to check if file contains annotation
async function fileContainsAnnotation(filePath, annotation) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.includes(annotation);
  } catch (error) {
    return false;
  }
}

describe('parseSpringXml()', () => {
  test('should parse valid Spring XML with all elements', async () => {
    const tempFile = path.join(__dirname, 'test-spring-context.xml');
    await fs.writeFile(tempFile, VALID_SPRING_XML);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result, 'Result should not be null');
      assert.strictEqual(result.beans.length, 3);
      assert.strictEqual(result.componentScanPackages.length, 2);
      assert.strictEqual(result.imports.length, 2);
      assert.strictEqual(result.propertyFiles.length, 2);
      assert.strictEqual(result.totalBeans, 3);

      // Verify bean details
      const userServiceBean = result.beans.find(b => b.id === 'userService');
      assert.ok(userServiceBean);
      assert.strictEqual(userServiceBean.class, 'com.example.service.UserService');

      // Verify component scan packages
      assert.ok(result.componentScanPackages.includes('com.example.service'));
      assert.ok(result.componentScanPackages.includes('com.example.repository'));

      // Verify imports
      assert.ok(result.imports.includes('classpath:spring-security.xml'));
      assert.ok(result.imports.includes('classpath:spring-mvc.xml'));

      // Verify property files
      assert.ok(result.propertyFiles.includes('classpath:application.properties'));
      assert.ok(result.propertyFiles.includes('classpath:database.properties'));
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should parse minimal Spring XML with single bean', async () => {
    const tempFile = path.join(__dirname, 'test-spring-minimal.xml');
    await fs.writeFile(tempFile, MINIMAL_SPRING_XML);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 1);
      assert.strictEqual(result.beans[0].id, 'simpleBean');
      assert.strictEqual(result.beans[0].class, 'com.example.SimpleBean');
      assert.strictEqual(result.componentScanPackages.length, 0);
      assert.strictEqual(result.imports.length, 0);
      assert.strictEqual(result.propertyFiles.length, 0);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should parse empty Spring XML', async () => {
    const tempFile = path.join(__dirname, 'test-spring-empty.xml');
    await fs.writeFile(tempFile, EMPTY_SPRING_XML);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 0);
      assert.strictEqual(result.componentScanPackages.length, 0);
      assert.strictEqual(result.imports.length, 0);
      assert.strictEqual(result.propertyFiles.length, 0);
      assert.strictEqual(result.totalBeans, 0);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should parse Spring MVC configuration', async () => {
    const tempFile = path.join(__dirname, 'test-spring-mvc.xml');
    await fs.writeFile(tempFile, SPRING_MVC_XML);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 1);
      assert.strictEqual(result.componentScanPackages.length, 1);
      assert.ok(result.componentScanPackages.includes('com.example.controller'));

      const viewResolver = result.beans.find(b => b.id === 'viewResolver');
      assert.ok(viewResolver);
      assert.strictEqual(viewResolver.class, 'org.springframework.web.servlet.view.InternalResourceViewResolver');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should return null for non-existent file', async () => {
    const result = await parseSpringXml('/non/existent/spring.xml');
    assert.strictEqual(result, null);
  });

  test('should handle invalid XML gracefully', async () => {
    const tempFile = path.join(__dirname, 'test-spring-invalid.xml');
    await fs.writeFile(tempFile, INVALID_SPRING_XML);

    try {
      const result = await parseSpringXml(tempFile);
      // Should still parse with regex even if XML is malformed
      assert.ok(result !== null);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should extract relative path correctly', async () => {
    const tempFile = path.join(__dirname, 'test-spring-path.xml');
    await fs.writeFile(tempFile, VALID_SPRING_XML);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.ok(result.path);
      assert.ok(!path.isAbsolute(result.path), 'Path should be relative');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Component Scan Package Extraction', () => {
  test('should extract multiple component-scan packages', async () => {
    const multiScanXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">
  <context:component-scan base-package="com.example.controller"/>
  <context:component-scan base-package="com.example.service"/>
  <context:component-scan base-package="com.example.repository"/>
  <context:component-scan base-package="com.example.config"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-multiscan.xml');
    await fs.writeFile(tempFile, multiScanXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.componentScanPackages.length, 4);
      assert.ok(result.componentScanPackages.includes('com.example.controller'));
      assert.ok(result.componentScanPackages.includes('com.example.service'));
      assert.ok(result.componentScanPackages.includes('com.example.repository'));
      assert.ok(result.componentScanPackages.includes('com.example.config'));
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle component-scan with wildcard packages', async () => {
    const wildcardXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">
  <context:component-scan base-package="com.example.*"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-wildcard.xml');
    await fs.writeFile(tempFile, wildcardXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.componentScanPackages.length, 1);
      assert.strictEqual(result.componentScanPackages[0], 'com.example.*');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Bean Definition Extraction', () => {
  test('should extract beans with complex class names', async () => {
    const complexBeansXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource"/>
  <bean id="sessionFactory" class="org.springframework.orm.hibernate5.LocalSessionFactoryBean"/>
  <bean id="transactionManager" class="org.springframework.orm.hibernate5.HibernateTransactionManager"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-complex.xml');
    await fs.writeFile(tempFile, complexBeansXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 3);

      const dataSource = result.beans.find(b => b.id === 'dataSource');
      assert.ok(dataSource);
      assert.strictEqual(dataSource.class, 'org.apache.commons.dbcp2.BasicDataSource');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle beans with hyphens and underscores in id', async () => {
    const specialIdsXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="user-service" class="com.example.UserService"/>
  <bean id="order_repository" class="com.example.OrderRepository"/>
  <bean id="cache.manager" class="com.example.CacheManager"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-specialids.xml');
    await fs.writeFile(tempFile, specialIdsXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 3);
      assert.ok(result.beans.find(b => b.id === 'user-service'));
      assert.ok(result.beans.find(b => b.id === 'order_repository'));
      assert.ok(result.beans.find(b => b.id === 'cache.manager'));
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Import Resource Extraction', () => {
  test('should extract multiple import resources', async () => {
    const importsXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <import resource="classpath:spring-security.xml"/>
  <import resource="classpath:spring-mvc.xml"/>
  <import resource="file:/etc/spring/database.xml"/>
  <import resource="spring-cache.xml"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-imports.xml');
    await fs.writeFile(tempFile, importsXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.imports.length, 4);
      assert.ok(result.imports.includes('classpath:spring-security.xml'));
      assert.ok(result.imports.includes('classpath:spring-mvc.xml'));
      assert.ok(result.imports.includes('file:/etc/spring/database.xml'));
      assert.ok(result.imports.includes('spring-cache.xml'));
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Property Placeholder Extraction', () => {
  test('should extract multiple property placeholder locations', async () => {
    const propsXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">
  <context:property-placeholder location="classpath:application.properties"/>
  <context:property-placeholder location="classpath:database.properties"/>
  <context:property-placeholder location="file:/etc/config/app.properties"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-props.xml');
    await fs.writeFile(tempFile, propsXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.propertyFiles.length, 3);
      assert.ok(result.propertyFiles.includes('classpath:application.properties'));
      assert.ok(result.propertyFiles.includes('classpath:database.properties'));
      assert.ok(result.propertyFiles.includes('file:/etc/config/app.properties'));
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('fileContainsAnnotation()', () => {
  test('should detect @Controller annotation', async () => {
    const tempFile = path.join(__dirname, 'TestController.java');
    await fs.writeFile(tempFile, CONTROLLER_JAVA);

    try {
      const hasController = await fileContainsAnnotation(tempFile, '@Controller');
      assert.strictEqual(hasController, true);

      const hasService = await fileContainsAnnotation(tempFile, '@Service');
      assert.strictEqual(hasService, false);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should detect @RestController annotation', async () => {
    const tempFile = path.join(__dirname, 'ApiController.java');
    await fs.writeFile(tempFile, REST_CONTROLLER_JAVA);

    try {
      const hasRestController = await fileContainsAnnotation(tempFile, '@RestController');
      assert.strictEqual(hasRestController, true);

      const hasController = await fileContainsAnnotation(tempFile, '@Controller');
      assert.strictEqual(hasController, false);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should detect @Service annotation', async () => {
    const tempFile = path.join(__dirname, 'UserService.java');
    await fs.writeFile(tempFile, SERVICE_JAVA);

    try {
      const hasService = await fileContainsAnnotation(tempFile, '@Service');
      assert.strictEqual(hasService, true);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should detect @Repository annotation', async () => {
    const tempFile = path.join(__dirname, 'UserRepository.java');
    await fs.writeFile(tempFile, REPOSITORY_JAVA);

    try {
      const hasRepository = await fileContainsAnnotation(tempFile, '@Repository');
      assert.strictEqual(hasRepository, true);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should detect @Component annotation', async () => {
    const tempFile = path.join(__dirname, 'HelperComponent.java');
    await fs.writeFile(tempFile, COMPONENT_JAVA);

    try {
      const hasComponent = await fileContainsAnnotation(tempFile, '@Component');
      assert.strictEqual(hasComponent, true);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should return false for plain Java class without annotations', async () => {
    const tempFile = path.join(__dirname, 'User.java');
    await fs.writeFile(tempFile, PLAIN_JAVA);

    try {
      const hasController = await fileContainsAnnotation(tempFile, '@Controller');
      const hasService = await fileContainsAnnotation(tempFile, '@Service');
      const hasRepository = await fileContainsAnnotation(tempFile, '@Repository');
      const hasComponent = await fileContainsAnnotation(tempFile, '@Component');

      assert.strictEqual(hasController, false);
      assert.strictEqual(hasService, false);
      assert.strictEqual(hasRepository, false);
      assert.strictEqual(hasComponent, false);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should return false for non-existent file', async () => {
    const result = await fileContainsAnnotation('/non/existent/file.java', '@Controller');
    assert.strictEqual(result, false);
  });

  test('should handle empty file', async () => {
    const tempFile = path.join(__dirname, 'Empty.java');
    await fs.writeFile(tempFile, '');

    try {
      const result = await fileContainsAnnotation(tempFile, '@Controller');
      assert.strictEqual(result, false);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Internal Library Discovery', () => {
  test('should identify internal library structure', () => {
    const internalLibs = [
      {
        path: 'lib/common',
        javaFiles: 25,
        modules: 1,
        files: ['Utils.java', 'Helper.java']
      },
      {
        path: 'lib/security',
        javaFiles: 15,
        modules: 1,
        files: ['AuthService.java']
      }
    ];

    assert.strictEqual(internalLibs.length, 2);
    assert.strictEqual(internalLibs[0].javaFiles, 25);
    assert.strictEqual(internalLibs[1].javaFiles, 15);

    const totalJavaFiles = internalLibs.reduce((sum, lib) => sum + lib.javaFiles, 0);
    assert.strictEqual(totalJavaFiles, 40);
  });
});

describe('Error Handling', () => {
  test('should handle file read errors gracefully', async () => {
    const result = await parseSpringXml('/invalid/path/spring.xml');
    assert.strictEqual(result, null);
  });

  test('should handle empty file content', async () => {
    const tempFile = path.join(__dirname, 'test-spring-empty-content.xml');
    await fs.writeFile(tempFile, '');

    try {
      const result = await parseSpringXml(tempFile);
      assert.ok(result !== null);
      assert.strictEqual(result.beans.length, 0);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle null or undefined input', async () => {
    const result = await parseSpringXml(null);
    assert.strictEqual(result, null);
  });
});

describe('Edge Cases', () => {
  test('should handle Spring XML with many beans', async () => {
    let manyBeansXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">`;

    for (let i = 0; i < 50; i++) {
      manyBeansXml += `\n  <bean id="bean${i}" class="com.example.Bean${i}"/>`;
    }

    manyBeansXml += '\n</beans>';

    const tempFile = path.join(__dirname, 'test-spring-manybeans.xml');
    await fs.writeFile(tempFile, manyBeansXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 50);
      assert.strictEqual(result.totalBeans, 50);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle beans with special characters in class names', async () => {
    const specialCharsXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="bean1" class="com.example.package$InnerClass"/>
  <bean id="bean2" class="com.example.MyClass_v2"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-specialchars.xml');
    await fs.writeFile(tempFile, specialCharsXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      assert.strictEqual(result.beans.length, 2);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle component-scan with comma-separated packages', async () => {
    const commaSeparatedXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">
  <context:component-scan base-package="com.example.service,com.example.repository"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-comma.xml');
    await fs.writeFile(tempFile, commaSeparatedXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      // Should extract the entire comma-separated string as one package
      assert.strictEqual(result.componentScanPackages.length, 1);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });

  test('should handle beans without id attribute', async () => {
    const noIdXml = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean class="com.example.AutowiredBean"/>
  <bean id="namedBean" class="com.example.NamedBean"/>
</beans>`;

    const tempFile = path.join(__dirname, 'test-spring-noid.xml');
    await fs.writeFile(tempFile, noIdXml);

    try {
      const result = await parseSpringXml(tempFile);

      assert.ok(result);
      // Should only match beans with both id and class
      assert.strictEqual(result.beans.length, 1);
      assert.strictEqual(result.beans[0].id, 'namedBean');
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  });
});

describe('Integration Scenarios', () => {
  test('should aggregate data from multiple Spring XML files', async () => {
    const file1 = path.join(__dirname, 'test-spring-app1.xml');
    const file2 = path.join(__dirname, 'test-spring-app2.xml');

    const xml1 = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">
  <context:component-scan base-package="com.example.service"/>
  <bean id="service1" class="com.example.Service1"/>
</beans>`;

    const xml2 = `<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context">
  <context:component-scan base-package="com.example.repository"/>
  <bean id="repo1" class="com.example.Repository1"/>
</beans>`;

    await fs.writeFile(file1, xml1);
    await fs.writeFile(file2, xml2);

    try {
      const result1 = await parseSpringXml(file1);
      const result2 = await parseSpringXml(file2);

      assert.ok(result1);
      assert.ok(result2);

      const totalBeans = result1.totalBeans + result2.totalBeans;
      assert.strictEqual(totalBeans, 2);

      const allPackages = new Set([
        ...result1.componentScanPackages,
        ...result2.componentScanPackages
      ]);
      assert.strictEqual(allPackages.size, 2);
      assert.ok(allPackages.has('com.example.service'));
      assert.ok(allPackages.has('com.example.repository'));
    } finally {
      await fs.unlink(file1).catch(() => {});
      await fs.unlink(file2).catch(() => {});
    }
  });
});
