# 🎯 Hướng Dẫn Cho Maven Java Multi-Module Project

**Áp dụng cho:** Maven projects với nhiều modules và cấu trúc phức tạp
**Cập nhật:** 05/03/2026

---

## 📖 Tài Liệu Liên Quan

- **[QUICKSTART.md](./QUICKSTART.md)** - Hướng dẫn nhanh 5 phút
- **[HUONG_DAN.md](./HUONG_DAN.md)** - Hướng dẫn đầy đủ (workflow, commands)
- **[SPRING_XML_GUIDE.md](./SPRING_XML_GUIDE.md)** - Hướng dẫn cho Spring XML projects
- **[README.md](./README.md)** - Tổng quan hệ thống
- **[CHANGELOG.md](./CHANGELOG.md)** - Lịch sử phiên bản

---

## 📋 Maven Multi-Module Project Structure

### Typical Structure

```
my-maven-project/
├── pom.xml                          # Parent POM
├── module-core/
│   ├── pom.xml
│   └── src/
│       ├── main/java/
│       └── test/java/
├── module-api/
│   ├── pom.xml
│   └── src/
│       ├── main/java/
│       └── test/java/
├── module-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/
│       └── test/java/
└── module-web/
    ├── pom.xml
    └── src/
        ├── main/
        │   ├── java/
        │   ├── resources/
        │   └── webapp/
        └── test/java/
```

---

## ⚙️ Config Tối Ưu Cho Maven

### File: `.copilot/config.json`

```json
{
  "project": {
    "name": "my-maven-project",
    "version": "1.0.0",
    "type": "maven-multimodule"
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
      "*.log"
    ],
    "extensions": [
      ".java",
      ".xml",
      ".properties",
      ".yml",
      ".yaml",
      ".sql",
      ".md"
    ],
    "maxFileSize": 200000
  },
  "maven": {
    "detectModules": true,
    "scanPoms": true,
    "includeTests": true,
    "includeResources": true
  },
  "documentation": {
    "outputDir": ".copilot/docs",
    "codemapDir": ".copilot/docs/codemaps",
    "updateOnChange": true,
    "formats": ["json", "markdown"]
  },
  "context": {
    "maxTokens": 150000,
    "layers": {
      "project": 15000,
      "module": 40000,
      "feature": 50000,
      "task": 45000
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

### Key Changes for Maven

1. **ignore patterns:**
   - `target/` - Maven build output
   - `*.class`, `*.jar`, `*.war` - Compiled files
   - `.idea/`, `.settings/` - IDE files

2. **extensions:**
   - `.java` - Source code
   - `.xml` - POMs, Spring configs
   - `.properties`, `.yml` - Configuration files
   - `.sql` - Database scripts

3. **maxFileSize: 200000** - Larger for Java files

4. **maven section:**
   - `detectModules: true` - Auto-detect modules
   - `scanPoms: true` - Parse pom.xml files
   - `includeTests: true` - Include test files
   - `includeResources: true` - Include resources

---

## 🔧 Custom Script Cho Maven

### File: `.copilot/scripts/discover-maven.js`

Tạo script mới để detect Maven modules:

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
 * Parse pom.xml to extract module information
 */
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
      ignore: ['**/target/**', '**/node_modules/**']
    });

    spinner.text = `Found ${pomFiles.length} pom.xml files`;

    // Parse all POMs
    const modules = [];
    for (const pomFile of pomFiles) {
      const pomPath = path.join(PROJECT_ROOT, pomFile);
      const pomInfo = await parsePomXml(pomPath);
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
      other: []
    };

    // Find Java source files
    const javaFiles = await glob('**/src/**/*.java', {
      cwd: PROJECT_ROOT,
      ignore: ['**/target/**']
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
      ignore: ['**/target/**'],
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
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(discovery, null, 2));

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
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverMavenProject();
}

export { discoverMavenProject };
```

### Add to package.json

File: `.copilot/package.json`

```json
{
  "scripts": {
    "discover": "node scripts/discover.js",
    "discover:maven": "node scripts/discover-maven.js",
    "generate": "node scripts/generate-docs.js",
    "update": "npm run discover && npm run discover:maven && npm run generate",
    "watch": "nodemon --watch ../src --exec 'npm run update'"
  }
}
```

---

## 🎯 Copilot Instructions Cho Maven

### File: `.github/copilot-instructions.md`

Thêm Maven-specific instructions:

```markdown
# Maven Multi-Module Project Context

## Project Structure

This is a Maven multi-module project with the following structure:
- Parent POM at root
- Multiple child modules (core, api, service, web)
- Standard Maven directory layout (src/main/java, src/test/java)

## Maven Conventions

### Directory Structure
```
module-name/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/           # Source code
    │   └── resources/      # Configuration files
    └── test/
        ├── java/           # Test code
        └── resources/      # Test resources
```

### Package Naming
- Base package: `com.company.project`
- Controllers: `com.company.project.controller`
- Services: `com.company.project.service`
- Repositories: `com.company.project.repository`
- Entities: `com.company.project.entity`
- DTOs: `com.company.project.dto`
- Config: `com.company.project.config`

## Coding Standards

### Java Code Style
- Use Java 17+ features
- Follow Google Java Style Guide
- Use Lombok for boilerplate reduction
- Use Spring Boot conventions

### Class Naming
- Controllers: `*Controller.java`
- Services: `*Service.java` (interface) + `*ServiceImpl.java` (implementation)
- Repositories: `*Repository.java`
- Entities: `*Entity.java` or just entity name
- DTOs: `*DTO.java` or `*Request.java`, `*Response.java`

### Annotations
- Controllers: `@RestController`, `@RequestMapping`
- Services: `@Service`
- Repositories: `@Repository` (if not using Spring Data)
- Entities: `@Entity`, `@Table`
- Configuration: `@Configuration`

### Dependency Injection
- Use constructor injection (preferred)
- Use `@Autowired` on constructor (optional in Spring 4.3+)
- Avoid field injection

### Example Controller
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.create(request));
    }
}
```

### Example Service
```java
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toDTO)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Override
    @Transactional
    public UserDTO create(UserRequest request) {
        User user = userMapper.toEntity(request);
        User saved = userRepository.save(user);
        return userMapper.toDTO(saved);
    }
}
```

### Example Repository
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.status = :status")
    List<User> findByStatus(@Param("status") UserStatus status);
}
```

### Example Entity
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

## Testing Standards

### Test Structure
- Unit tests in `src/test/java`
- Integration tests with `@SpringBootTest`
- Use JUnit 5
- Use Mockito for mocking
- Use AssertJ for assertions

### Test Naming
- Method: `should_ExpectedBehavior_When_StateUnderTest`
- Example: `should_ReturnUser_When_UserExists`

### Example Test
```java
@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    void should_ReturnUser_When_UserExists() {
        // Given
        Long userId = 1L;
        User user = User.builder()
            .id(userId)
            .email("test@example.com")
            .name("Test User")
            .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        UserDTO result = userService.findById(userId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }
}
```

## Maven Commands

### Build
```bash
mvn clean install          # Build all modules
mvn clean install -DskipTests  # Build without tests
mvn clean package          # Package without install
```

### Test
```bash
mvn test                   # Run all tests
mvn test -Dtest=UserServiceTest  # Run specific test
mvn verify                 # Run integration tests
```

### Run
```bash
mvn spring-boot:run        # Run Spring Boot app
mvn spring-boot:run -Dspring-boot.run.profiles=dev  # Run with profile
```

## Module Dependencies

When adding dependencies between modules:
1. Add dependency in child module's pom.xml
2. Use `<dependency>` with groupId, artifactId, version
3. Version should be managed in parent POM's `<dependencyManagement>`

## Important Notes

- Always use `@Transactional` for service methods that modify data
- Use DTOs for API responses, never expose entities directly
- Validate input with `@Valid` and Bean Validation annotations
- Handle exceptions with `@ControllerAdvice`
- Use Lombok to reduce boilerplate
- Follow RESTful conventions for API endpoints
- Use proper HTTP status codes
```

---

## 🚀 Usage Cho Maven Project

### 1. Setup

```bash
# Copy system vào Maven project
cp -r .copilot /your/maven/project/
cp -r .github /your/maven/project/

# Install
cd /your/maven/project/.copilot
npm install

# Add scripts to package.json (nếu có)
# Hoặc chạy trực tiếp
```

### 2. Update Config

```bash
# Edit .copilot/config.json
# Copy config từ trên vào
```

### 3. Run Discovery

```bash
# Từ project root
cd .copilot
npm run discover:maven

# Xem kết quả
cat docs/maven-discovery.json
```

### 4. Update Context

```bash
# Từ project root (recommended)
npm run copilot:update

# Hoặc từ .copilot/
cd .copilot
npm run update

# Xem kết quả
cat docs/discovery.json
cat docs/maven-discovery.json
```

### 5. Use with Copilot

```
@workspace Show me all REST controllers
@workspace How is the user service implemented?
@workspace What modules does this project have?
@workspace Show me the database entities
```

---

## 📊 Expected Output

### Maven Discovery Output

```json
{
  "timestamp": "2026-03-05T15:40:00.000Z",
  "projectType": "maven-multimodule",
  "totalModules": 5,
  "totalJavaFiles": 142,
  "parentPom": {
    "groupId": "com.company",
    "artifactId": "my-project",
    "version": "1.0.0",
    "modules": ["module-core", "module-api", "module-service", "module-web"]
  },
  "statistics": {
    "mainSourceFiles": 98,
    "testFiles": 44,
    "controllers": 12,
    "services": 18,
    "repositories": 8,
    "entities": 15,
    "dtos": 25,
    "configs": 6
  }
}
```

---

## 💡 Tips Cho Maven Projects

### 1. Ignore Patterns

Đảm bảo ignore:
- `target/` - Build output
- `*.class` - Compiled files
- `.idea/`, `.settings/` - IDE files

### 2. File Extensions

Include:
- `.java` - Source code
- `.xml` - POMs, configs
- `.properties`, `.yml` - Configuration
- `.sql` - Database scripts

### 3. Module Detection

Script tự động detect:
- Parent POM
- Child modules
- Dependencies
- Package structure

### 4. Update Frequency

Maven projects lớn:
- Update 1-2 lần/ngày
- Sau khi thêm module mới
- Sau khi refactor packages
- Trước khi bắt đầu feature mới

---

## 🎯 Kết Luận

**Có thể dùng được cho Maven multi-module project!**

**Cần làm:**
1. ✅ Update config.json (ignore patterns, extensions)
2. ✅ Tạo discover-maven.js script (optional, for better detection)
3. ✅ Update .github/copilot-instructions.md (Maven conventions)
4. ✅ Run discovery

**Lợi ích:**
- Copilot hiểu Maven structure
- Detect modules tự động
- Follow Java/Spring conventions
- Better code suggestions

**Chúc bạn thành công! 🚀**
