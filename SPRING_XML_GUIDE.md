# 🎯 Hướng Dẫn Cho Spring Framework với XML Config

**Áp dụng cho:**
- Spring Framework (không phải Spring Boot)
- XML-based configuration (applicationContext.xml, spring-*.xml)
- Thư viện nội bộ (internal libraries)
- Maven multi-module

**Cập nhật:** 05/03/2026

---

## 📖 Tài Liệu Liên Quan

- **[QUICKSTART.md](./QUICKSTART.md)** - Hướng dẫn nhanh 5 phút
- **[HUONG_DAN.md](./HUONG_DAN.md)** - Hướng dẫn đầy đủ (workflow, commands)
- **[MAVEN_GUIDE.md](./MAVEN_GUIDE.md)** - Hướng dẫn cho Maven projects
- **[README.md](./README.md)** - Tổng quan hệ thống
- **[CHANGELOG.md](./CHANGELOG.md)** - Lịch sử phiên bản

---

## 📋 Typical Spring XML Project Structure

```
my-spring-project/
├── pom.xml                          # Parent POM
├── module-core/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   └── resources/
│       │       ├── applicationContext.xml
│       │       ├── spring-beans.xml
│       │       └── jdbc.properties
│       └── test/
├── module-service/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   └── resources/
│       │       ├── spring-service.xml
│       │       └── service.properties
│       └── test/
├── module-web/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   ├── resources/
│       │   │   └── spring-mvc.xml
│       │   └── webapp/
│       │       ├── WEB-INF/
│       │       │   ├── web.xml
│       │       │   └── spring/
│       │       │       ├── root-context.xml
│       │       │       └── servlet-context.xml
│       │       └── resources/
│       └── test/
└── internal-libs/                   # Thư viện nội bộ
    ├── lib-common/
    ├── lib-utils/
    └── lib-integration/
```

---

## ⚙️ Config Tối Ưu Cho Spring XML Project

### File: `.copilot/config.json`

```json
{
  "project": {
    "name": "my-spring-project",
    "version": "1.0.0",
    "type": "spring-xml-multimodule"
  },
  "scan": {
    "ignore": [
      "target",
      ".git",
      ".idea",
      ".vscode",
      "*.class",
      "*.jar",
      "*.war",
      "*.ear",
      ".settings",
      ".classpath",
      ".project",
      "node_modules",
      "coverage",
      "*.log",
      ".copilot-workflow"
    ],
    "extensions": [
      ".java",
      ".xml",
      ".properties",
      ".yml",
      ".yaml",
      ".sql",
      ".jsp",
      ".jspx",
      ".tld",
      ".md"
    ],
    "maxFileSize": 300000
  },
  "spring": {
    "xmlBased": true,
    "detectBeans": true,
    "scanConfigs": true,
    "includeWebXml": true,
    "includeInternalLibs": true
  },
  "internalLibs": {
    "enabled": true,
    "paths": [
      "internal-libs",
      "lib",
      "libs",
      "../internal-libs"
    ],
    "scanJars": false,
    "scanSources": true
  },
  "documentation": {
    "outputDir": ".copilot/docs",
    "codemapDir": ".copilot/docs/codemaps",
    "updateOnChange": true,
    "formats": ["json", "markdown"]
  },
  "context": {
    "maxTokens": 200000,
    "layers": {
      "project": 20000,
      "module": 50000,
      "internalLib": 40000,
      "feature": 50000,
      "task": 40000
    }
  },
  "tools": {
    "repopack": {
      "enabled": true,
      "format": "xml"
    },
    "astGrep": {
      "enabled": true
    }
  }
}
```

### Key Changes for Spring XML

1. **extensions:**
   - `.xml` - Spring configs, web.xml
   - `.jsp`, `.jspx` - JSP files
   - `.tld` - Tag library descriptors

2. **maxFileSize: 300000** - Larger for XML configs

3. **spring section:**
   - `xmlBased: true` - XML configuration
   - `detectBeans: true` - Parse bean definitions
   - `scanConfigs: true` - Find all Spring XML files
   - `includeWebXml: true` - Include web.xml

4. **internalLibs section:**
   - `enabled: true` - Scan internal libraries
   - `paths: []` - Where to find internal libs
   - `scanSources: true` - Scan source code in libs

---

## 🔧 Custom Script Cho Spring XML

### File: `.copilot/scripts/discover-spring-xml.js`

```javascript
#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * Parse Spring XML config to extract bean definitions
 */
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
        ignore: ['**/target/**', '**/node_modules/**']
      });
      xmlFiles.push(...files);
    }

    spinner.text = `Found ${xmlFiles.length} Spring XML config files`;

    // Parse all Spring XML files
    const springConfigs = [];
    let totalBeans = 0;
    const allComponentScanPackages = new Set();

    for (const xmlFile of xmlFiles) {
      const xmlPath = path.join(PROJECT_ROOT, xmlFile);
      const xmlInfo = await parseSpringXml(xmlPath);
      if (xmlInfo) {
        springConfigs.push(xmlInfo);
        totalBeans += xmlInfo.totalBeans;
        xmlInfo.componentScanPackages.forEach(pkg => allComponentScanPackages.add(pkg));
      }
    }

    // Find web.xml files
    const webXmlFiles = await glob('**/WEB-INF/web.xml', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**']
    });

    // Find all Java files
    const javaFiles = await glob('**/src/**/*.java', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**']
    });

    // Categorize Java files by Spring annotations
    const javaFilesByType = {
      controller: javaFiles.filter(f => {
        const content = fs.readFileSync(path.join(PROJECT_ROOT, f), 'utf-8');
        return content.includes('@Controller') || content.includes('@RestController');
      }),
      service: javaFiles.filter(f => {
        const content = fs.readFileSync(path.join(PROJECT_ROOT, f), 'utf-8');
        return content.includes('@Service');
      }),
      repository: javaFiles.filter(f => {
        const content = fs.readFileSync(path.join(PROJECT_ROOT, f), 'utf-8');
        return content.includes('@Repository');
      }),
      component: javaFiles.filter(f => {
        const content = fs.readFileSync(path.join(PROJECT_ROOT, f), 'utf-8');
        return content.includes('@Component');
      })
    };

    // Discover internal libraries
    const internalLibPaths = config.internalLibs?.paths || [];
    const internalLibs = await discoverInternalLibs(internalLibPaths);

    // Find all POMs
    const pomFiles = await glob('**/pom.xml', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**']
    });

    const discovery = {
      timestamp: new Date().toISOString(),
      projectType: 'spring-xml-multimodule',
      framework: 'Spring Framework (XML-based)',
      totalSpringXmlFiles: xmlFiles.length,
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
        springXmlConfigs: xmlFiles.length,
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
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(discovery, null, 2));

    spinner.succeed(chalk.green('Spring XML discovery complete!'));

    console.log(chalk.cyan('\n📊 Spring XML Project Summary:'));
    console.log(`  Spring XML configs: ${xmlFiles.length}`);
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

    console.log(chalk.cyan('\n🔍 Component Scan Packages:'));
    Array.from(allComponentScanPackages).forEach(pkg => {
      console.log(`  - ${pkg}`);
    });

    return discovery;

  } catch (error) {
    spinner.fail(chalk.red('Spring XML discovery failed'));
    console.error(error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverSpringXmlProject();
}

export { discoverSpringXmlProject };
```

### Add to package.json

File: `.copilot/package.json`

```json
{
  "scripts": {
    "discover": "node scripts/discover.js",
    "discover:maven": "node scripts/discover-maven.js",
    "discover:spring": "node scripts/discover-spring-xml.js",
    "generate": "node scripts/generate-docs.js",
    "update": "npm run discover && npm run discover:maven && npm run discover:spring && npm run generate",
    "watch": "nodemon --watch ../src --exec 'npm run update'"
  }
}
```

---

## 🎯 Copilot Instructions Cho Spring XML

### File: `.github/copilot-instructions.md`

Thêm Spring XML-specific instructions:

```markdown
# Spring Framework XML-Based Project Context

## Project Type

This is a Spring Framework project using XML-based configuration (not Spring Boot).

**Key Characteristics:**
- XML configuration files (applicationContext.xml, spring-*.xml)
- web.xml for web applications
- Traditional Spring MVC (not Spring Boot)
- Internal libraries (company-specific)
- Maven multi-module structure

## Spring XML Configuration

### Configuration Files

**Main configs:**
- `applicationContext.xml` - Root application context
- `spring-beans.xml` - Bean definitions
- `spring-service.xml` - Service layer beans
- `spring-mvc.xml` - MVC configuration
- `root-context.xml` - Root context for web apps
- `servlet-context.xml` - Servlet context

**Web configs:**
- `web.xml` - Web application descriptor
- `WEB-INF/spring/*.xml` - Spring configs in web app

### Bean Definition Patterns

**XML Bean Definition:**
```xml
<!-- Simple bean -->
<bean id="userService" class="com.company.service.UserServiceImpl">
    <property name="userRepository" ref="userRepository"/>
</bean>

<!-- Bean with constructor injection -->
<bean id="orderService" class="com.company.service.OrderServiceImpl">
    <constructor-arg ref="orderRepository"/>
    <constructor-arg ref="emailService"/>
</bean>

<!-- Bean with init/destroy methods -->
<bean id="dataSource" class="com.company.config.DataSourceConfig"
      init-method="init" destroy-method="cleanup">
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

**Component Scanning:**
```xml
<!-- Enable component scanning -->
<context:component-scan base-package="com.company.service"/>
<context:component-scan base-package="com.company.repository"/>
<context:component-scan base-package="com.company.controller"/>
```

**Property Placeholder:**
```xml
<!-- Load properties -->
<context:property-placeholder location="classpath:jdbc.properties"/>
<context:property-placeholder location="classpath:application.properties"/>
```

**Import Other Configs:**
```xml
<!-- Import other Spring configs -->
<import resource="classpath:spring-service.xml"/>
<import resource="classpath:spring-dao.xml"/>
<import resource="spring-security.xml"/>
```

## Java Code Patterns

### Service Layer

**Interface:**
```java
package com.company.service;

public interface UserService {
    User findById(Long id);
    User save(User user);
    void delete(Long id);
    List<User> findAll();
}
```

**Implementation (XML-configured):**
```java
package com.company.service.impl;

import com.company.service.UserService;
import com.company.repository.UserRepository;

public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    // Setter for XML injection
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
```

**Implementation (Annotation-based):**
```java
package com.company.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service("userService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findById(Long id) {
        return userRepository.findById(id);
    }
}
```

### Controller Layer (Spring MVC)

```java
package com.company.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

@Controller
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    // Setter for XML injection
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getUser(@PathVariable Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "user/detail";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createUser(@ModelAttribute User user) {
        userService.save(user);
        return "redirect:/users";
    }
}
```

### Repository Layer

**Interface:**
```java
package com.company.repository;

public interface UserRepository {
    User findById(Long id);
    User save(User user);
    void delete(Long id);
    List<User> findAll();
}
```

**Implementation (JDBC):**
```java
package com.company.repository.impl;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class UserRepositoryImpl implements UserRepository {

    private JdbcTemplate jdbcTemplate;

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public User findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
    }

    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            return user;
        }
    }
}
```

## Internal Libraries

### Usage Pattern

**In pom.xml:**
```xml
<dependency>
    <groupId>com.company.internal</groupId>
    <artifactId>common-utils</artifactId>
    <version>1.0.0</version>
</dependency>

<dependency>
    <groupId>com.company.internal</groupId>
    <artifactId>integration-lib</artifactId>
    <version>2.0.0</version>
</dependency>
```

**In Spring XML:**
```xml
<!-- Import beans from internal library -->
<import resource="classpath:internal-lib-context.xml"/>

<!-- Use beans from internal library -->
<bean id="myService" class="com.company.service.MyServiceImpl">
    <property name="internalUtil" ref="commonUtil"/>
</bean>
```

**In Java code:**
```java
import com.company.internal.utils.StringUtils;
import com.company.internal.integration.ApiClient;

@Service
public class MyServiceImpl implements MyService {

    @Autowired
    private ApiClient apiClient; // From internal lib

    public void doSomething() {
        String result = StringUtils.format(...); // From internal lib
        apiClient.call(...); // From internal lib
    }
}
```

## Web Application Structure

### web.xml Pattern

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         version="3.1">

    <!-- Spring Root Context -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>
            /WEB-INF/spring/root-context.xml
            classpath:spring-service.xml
        </param-value>
    </context-param>

    <listener>
        <listener-class>
            org.springframework.web.context.ContextLoaderListener
        </listener-class>
    </listener>

    <!-- Spring MVC Dispatcher Servlet -->
    <servlet>
        <servlet-name>appServlet</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/spring/servlet-context.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>appServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!-- Character Encoding Filter -->
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>
            org.springframework.web.filter.CharacterEncodingFilter
        </filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

## Coding Standards

### Dependency Injection

**Prefer setter injection for XML-configured beans:**
```java
public class MyService {
    private MyRepository repository;

    // Setter for XML injection
    public void setRepository(MyRepository repository) {
        this.repository = repository;
    }
}
```

**Use @Autowired for annotation-based:**
```java
@Service
public class MyService {
    @Autowired
    private MyRepository repository;
}
```

### Transaction Management

**XML-based:**
```xml
<tx:annotation-driven transaction-manager="transactionManager"/>

<bean id="transactionManager"
      class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

**In code:**
```java
@Service
public class UserServiceImpl implements UserService {

    @Transactional
    public User save(User user) {
        // Transactional method
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id);
    }
}
```

## Important Notes

- Always define beans in appropriate XML files (service beans in spring-service.xml, etc.)
- Use component-scan for annotation-based beans
- Keep XML configs organized and modular
- Import configs using `<import resource="..."/>`
- Use property placeholders for environment-specific values
- Document internal library dependencies in POMs
- Follow naming conventions: *Service, *Repository, *Controller
- Use interfaces for services and repositories
- Keep business logic in service layer
- Controllers should be thin, delegate to services

## Testing

### Test Configuration

```xml
<!-- test-context.xml -->
<beans>
    <import resource="classpath:spring-service.xml"/>

    <!-- Override beans for testing -->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="url" value="jdbc:h2:mem:testdb"/>
    </bean>
</beans>
```

### Test Class

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:test-context.xml"})
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testFindById() {
        User user = userService.findById(1L);
        assertNotNull(user);
    }
}
```
```

---

## 🚀 Usage Cho Spring XML Project

### 1. Setup

```bash
# Copy system vào Spring project
cp -r .copilot /your/spring/project/
cp -r .github /your/spring/project/

# Install
cd /your/spring/project/.copilot
npm install
```

### 2. Update Config

```bash
# Edit .copilot/config.json
# Copy config từ trên (Spring XML section)
```

### 3. Create Spring Discovery Script

```bash
# Copy discover-spring-xml.js vào .copilot/scripts/
# Update package.json với scripts mới
```

### 4. Run Discovery

```bash
# Từ project root (recommended)
npm run copilot:update

# Hoặc từ .copilot/
cd .copilot
npm run discover:spring

# Xem kết quả
cat docs/discovery.json
cat docs/spring-xml-discovery.json
cat docs/architecture/overview.md
```

### 5. Use with Copilot

```
@workspace Show me all Spring XML config files
@workspace How are beans defined in this project?
@workspace What internal libraries does this project use?
@workspace Show me all controllers
@workspace How is the user service configured?
```

---

## 📊 Expected Output

```json
{
  "projectType": "spring-xml-multimodule",
  "framework": "Spring Framework (XML-based)",
  "totalSpringXmlFiles": 12,
  "totalBeans": 45,
  "totalJavaFiles": 156,
  "totalInternalLibs": 3,
  "componentScanPackages": [
    "com.company.service",
    "com.company.repository",
    "com.company.controller"
  ],
  "internalLibs": [
    {
      "path": "internal-libs/lib-common",
      "javaFiles": 23,
      "modules": 1
    },
    {
      "path": "internal-libs/lib-utils",
      "javaFiles": 15,
      "modules": 1
    }
  ],
  "statistics": {
    "springXmlConfigs": 12,
    "totalBeanDefinitions": 45,
    "componentScanPackages": 3,
    "webApplications": 2,
    "controllers": 8,
    "services": 15,
    "repositories": 6,
    "internalLibModules": 2,
    "internalLibJavaFiles": 38
  }
}
```

---

## 💡 Tips

### 1. XML Config Organization

```
resources/
├── applicationContext.xml      # Main context
├── spring-service.xml          # Service beans
├── spring-dao.xml              # DAO/Repository beans
├── spring-mvc.xml              # MVC config
└── spring-security.xml         # Security config
```

### 2. Internal Libraries

Đảm bảo config paths đúng:
```json
"internalLibs": {
  "paths": [
    "internal-libs",
    "../company-libs",
    "lib"
  ]
}
```

### 3. Update Frequency

Spring XML projects:
- Update sau khi thêm XML config mới
- Update sau khi thêm internal lib
- Update sau khi refactor packages
- 1-2 lần/ngày

---

## ✅ Kết Luận

**Hoàn toàn có thể dùng cho Spring XML project với internal libs!**

**Cần làm:**
1. ✅ Update config.json (XML extensions, internal lib paths)
2. ✅ Create discover-spring-xml.js (parse XML, detect beans)
3. ✅ Update .github/copilot-instructions.md (Spring XML patterns)
4. ✅ Run discovery

**Copilot sẽ hiểu:**
- Spring XML configuration
- Bean definitions
- Component scan packages
- Internal library structure
- Web application layout
- Service/Repository/Controller patterns

**Chúc bạn thành công! 🚀**
