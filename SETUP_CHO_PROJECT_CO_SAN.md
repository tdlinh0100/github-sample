# Hướng Dẫn Setup Cho Project Đã Có Sẵn

**Dành cho:** Project đã có source code
**Thời gian:** ~10-15 phút
**Yêu cầu:** Node.js 18+, Git

---

## 🎯 Tình Huống

Bạn đã có một project với source code sẵn và muốn thêm GitHub Copilot Workflow vào.

**Ví dụ project structure hiện tại:**
```
my-existing-project/
├── src/
│   ├── components/
│   ├── api/
│   ├── utils/
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Các Bước Thực Hiện

### Bước 1: Backup Project (Quan Trọng!)

```bash
# Commit tất cả changes hiện tại
git add .
git commit -m "chore: backup before adding copilot workflow"

# Hoặc tạo branch mới
git checkout -b add-copilot-workflow
```

### Bước 2: Copy Workflow System Vào Project

**Option A: Copy từ project mẫu này**

```bash
# Giả sử bạn đang ở project mẫu (github_test)
cd /home/linh/app/github_test

# Copy sang project của bạn
cp -r .copilot /path/to/your/project/
cp -r .github /path/to/your/project/
cp -r .copilot-workflow /path/to/your/project/
cp HUONG_DAN_SU_DUNG.md /path/to/your/project/
cp COPILOT_SETUP.md /path/to/your/project/

# Ví dụ cụ thể:
cp -r .copilot ~/projects/my-app/
cp -r .github ~/projects/my-app/
cp -r .copilot-workflow ~/projects/my-app/
cp HUONG_DAN_SU_DUNG.md ~/projects/my-app/
```

**Option B: Clone và copy**

```bash
# Clone project mẫu
git clone <repo-url> copilot-workflow-template
cd copilot-workflow-template

# Copy vào project của bạn
cp -r .copilot /path/to/your/project/
cp -r .github /path/to/your/project/
cp -r .copilot-workflow /path/to/your/project/
cp HUONG_DAN_SU_DUNG.md /path/to/your/project/
```

### Bước 3: Cài Đặt Dependencies

```bash
# Chuyển vào project của bạn
cd /path/to/your/project

# Cài dependencies cho workflow
cd .copilot
npm install

# Quay lại root
cd ..
```

### Bước 4: Cấu Hình Cho Project Của Bạn

#### 4.1. Điều Chỉnh Scan Patterns

**File:** `.copilot/config.json`

```json
{
  "project": {
    "name": "your-project-name",  // ← Đổi tên project
    "version": "1.0.0",
    "type": "fullstack"  // hoặc "frontend", "backend"
  },
  "scan": {
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".git",
      ".next",
      "coverage",
      "*.log",
      ".copilot-workflow"
      // ← Thêm folders cần ignore của bạn
    ],
    "extensions": [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".py",
      ".go",
      ".rs"
      // ← Thêm/bớt extensions theo project
    ],
    "maxFileSize": 100000
  }
}
```

**Ví dụ cho React + TypeScript project:**
```json
"extensions": [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"]
```

**Ví dụ cho Python project:**
```json
"extensions": [".py", ".pyi", ".yaml", ".yml"]
```

**Ví dụ cho Go project:**
```json
"extensions": [".go", ".mod", ".sum"]
```

#### 4.2. Cập Nhật Root Package.json

**File:** `package.json` (root của project)

Thêm scripts:

```json
{
  "scripts": {
    // ... scripts hiện tại của bạn
    "copilot:init": "cd .copilot && npm run discover && npm run generate",
    "copilot:update": "cd .copilot && npm run update",
    "copilot:watch": "cd .copilot && npm run watch"
  }
}
```

**Nếu chưa có package.json:**
```bash
npm init -y
# Sau đó thêm scripts như trên
```

### Bước 5: Chạy Discovery Lần Đầu

```bash
# Quét toàn bộ codebase hiện tại
npm run copilot:init
```

**Output mong đợi:**
```
✔ Discovery complete!

📊 Project Summary:
  Total files: 45
  Frontend: 23
  Backend: 15
  Shared: 5
  Tests: 2

  Tech Stack:
    frontend: Next.js, React, TypeScript
    backend: Express
    database: PostgreSQL
    testing: Jest
```

### Bước 6: Kiểm Tra Kết Quả

```bash
# Xem architecture đã generate
cat .copilot/docs/architecture/overview.md

# Xem discovery results
cat .copilot/docs/discovery.json

# Xem codemaps
ls -la .copilot/docs/codemaps/
cat .copilot/docs/codemaps/frontend-map.json
```

### Bước 7: Tùy Chỉnh Copilot Instructions

**File:** `.github/copilot-instructions.md`

Cập nhật thông tin project:

```markdown
# Project Context for GitHub Copilot

## Project Overview
[Tên project của bạn] - [Mô tả ngắn gọn]

## Tech Stack
- **Frontend**: [React 19, Next.js 15, TypeScript 5]
- **Backend**: [Express, Node.js 20]
- **Database**: [PostgreSQL 16, Redis]
- **Infrastructure**: [AWS, Docker, Kubernetes]

## Architecture
- **Deployment**: [Mô tả deployment của bạn]
- **File Organization**: [Feature-based / Layer-based]
- **Code Style**: [Conventions của team]

## Coding Standards

### Naming Conventions
[Conventions cụ thể của project]

### Project-Specific Rules
1. [Rule 1]
2. [Rule 2]
3. [Rule 3]

## Common Patterns

### [Pattern 1 của project]
```typescript
// Code example
```

### [Pattern 2 của project]
```typescript
// Code example
```
```

### Bước 8: Setup Git Hooks

```bash
# Cài git hooks
cd .copilot
bash scripts/setup-hooks.sh
cd ..

# Verify hooks đã cài
ls -la .git/hooks/ | grep -E "(pre-commit|post-merge)"
```

### Bước 9: Update .gitignore

```bash
# Thêm vào .gitignore
cat >> .gitignore << 'EOF'

# Copilot workflow
.copilot/cache/
.copilot/logs/
.copilot/docs/snapshot.xml
.copilot/node_modules/
EOF
```

### Bước 10: Test Workflow

```bash
# Test update
npm run copilot:update

# Xem logs
cat .copilot/logs/updates.log

# Test git hook
git add .
git commit -m "test: verify copilot workflow"
# → Hook sẽ chạy tự động
```

---

## 🔧 Tùy Chỉnh Cho Các Loại Project

### React / Next.js Project

**Config:**
```json
{
  "scan": {
    "extensions": [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
    "ignore": [
      "node_modules",
      ".next",
      "out",
      "build",
      "dist",
      "coverage"
    ]
  }
}
```

**Copilot Instructions:**
```markdown
## React Patterns

### Component Structure
- Functional components only
- Props interface above component
- Hooks at top

### File Organization
- src/components/ - Reusable components
- src/app/ - Next.js app router pages
- src/hooks/ - Custom hooks
- src/utils/ - Utility functions
```

### Python / FastAPI Project

**Config:**
```json
{
  "scan": {
    "extensions": [".py", ".pyi", ".yaml", ".yml", ".toml"],
    "ignore": [
      "__pycache__",
      "venv",
      ".venv",
      "env",
      ".pytest_cache",
      "*.pyc"
    ]
  }
}
```

**Copilot Instructions:**
```markdown
## Python Patterns

### Code Style
- Follow PEP 8
- Type hints required
- Docstrings for all functions

### Project Structure
- app/ - Application code
- tests/ - Test files
- models/ - Data models
- services/ - Business logic
```

### Go Project

**Config:**
```json
{
  "scan": {
    "extensions": [".go", ".mod", ".sum"],
    "ignore": [
      "vendor",
      "bin",
      "dist"
    ]
  }
}
```

**Copilot Instructions:**
```markdown
## Go Patterns

### Code Style
- Follow Go conventions
- Use gofmt
- Error handling explicit

### Project Structure
- cmd/ - Main applications
- pkg/ - Library code
- internal/ - Private code
```

### Monorepo Project

**Config:**
```json
{
  "scan": {
    "ignore": [
      "node_modules",
      "packages/*/node_modules",
      "packages/*/dist",
      "packages/*/build"
    ]
  }
}
```

**Hoặc setup riêng cho mỗi package:**
```bash
# Copy workflow vào từng package
cp -r .copilot packages/frontend/
cp -r .copilot packages/backend/

# Mỗi package có config riêng
```

---

## 📊 Kiểm Tra Kết Quả

### Xem Tech Stack Detected

```bash
cat .copilot/docs/discovery.json | grep -A 10 "techStack"
```

**Output mong đợi:**
```json
"techStack": {
  "frontend": ["Next.js", "React", "TypeScript"],
  "backend": ["Express"],
  "database": ["PostgreSQL", "Redis"],
  "testing": ["Jest", "Playwright"]
}
```

### Xem File Distribution

```bash
cat .copilot/docs/discovery.json | grep -A 5 "categorized"
```

**Output mong đợi:**
```json
"categorized": {
  "frontend": 23,
  "backend": 15,
  "shared": 5,
  "tests": 2
}
```

### Xem Architecture Overview

```bash
cat .copilot/docs/architecture/overview.md
```

**Nên thấy:**
- Project name đúng
- Tech stack đúng
- File distribution đúng
- Entry points đúng

---

## 🎯 Sử Dụng Với Project Có Sẵn

### Test Với GitHub Copilot

**Mở VS Code:**
```bash
code .
```

**Trong Copilot Chat:**
```
@workspace Phân tích architecture của project này

@workspace Tech stack của project là gì?

@workspace Show me all API endpoints

@workspace Tìm tất cả React components

#file:.github/copilot-instructions.md
Dựa vào patterns này, tạo một component mới cho...
```

### Verify Context Working

**Test 1: Hỏi về project**
```
@workspace Project này làm gì?
```
→ Copilot nên trả lời dựa trên discovery results

**Test 2: Hỏi về structure**
```
@workspace Cấu trúc thư mục như thế nào?
```
→ Copilot nên show đúng structure

**Test 3: Hỏi về patterns**
```
@workspace Làm thế nào để tạo API endpoint mới?
```
→ Copilot nên follow patterns trong instructions

---

## 🔄 Workflow Với Project Có Sẵn

### Khi Thêm Code Mới

```bash
# 1. Code như bình thường
# 2. Commit (hook tự động update)
git add .
git commit -m "feat: add new feature"
# → pre-commit hook updates context

# 3. Hoặc update manual
npm run copilot:update
```

### Khi Refactor Lớn

```bash
# 1. Bật watch mode
npm run copilot:watch

# 2. Refactor code
# → Context tự động update khi save

# 3. Kiểm tra docs đã update
cat .copilot/docs/architecture/overview.md

# 4. Commit
git add .
git commit -m "refactor: restructure project"
```

### Khi Thêm Dependencies Mới

```bash
# 1. Install package
npm install new-package

# 2. Update context
npm run copilot:update

# 3. Verify tech stack detected
cat .copilot/docs/discovery.json | grep "new-package"
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Kiểm Tra .gitignore

Đảm bảo không commit:
```
.copilot/cache/
.copilot/logs/
.copilot/docs/snapshot.xml
.copilot/node_modules/
```

### 2. Large Codebase

Nếu project rất lớn (1000+ files):

**Tăng ignore patterns:**
```json
"ignore": [
  "node_modules",
  "dist",
  "build",
  "public/uploads",
  "*.mp4",
  "*.zip",
  "vendor"
]
```

**Giảm maxFileSize:**
```json
"maxFileSize": 50000  // Từ 100000
```

### 3. Monorepo

Với monorepo, có 2 options:

**Option A: Setup ở root (recommended)**
```bash
# Scan toàn bộ monorepo
npm run copilot:init
```

**Option B: Setup riêng mỗi package**
```bash
# Copy vào từng package
cp -r .copilot packages/app1/
cp -r .copilot packages/app2/
```

### 4. Private/Sensitive Code

Thêm vào ignore:
```json
"ignore": [
  "node_modules",
  "secrets/",
  "*.key",
  "*.pem",
  ".env*",
  "credentials/"
]
```

---

## 🐛 Xử Lý Sự Cố

### Vấn Đề: Discovery Không Tìm Thấy Files

**Nguyên nhân:** Scan patterns không match

**Giải pháp:**
```bash
# 1. Kiểm tra extensions
cat .copilot/config.json | grep extensions

# 2. Thêm extensions của bạn
nano .copilot/config.json
# Thêm: ".vue", ".svelte", etc.

# 3. Chạy lại
npm run copilot:init
```

### Vấn Đề: Tech Stack Không Đúng

**Nguyên nhân:** package.json không có dependencies

**Giải pháp:**
```bash
# 1. Kiểm tra package.json
cat package.json | grep dependencies

# 2. Nếu không có, tạo package.json
npm init -y
npm install <your-packages>

# 3. Chạy lại discovery
npm run copilot:update
```

### Vấn Đề: Snapshot Quá Lớn

**Nguyên nhân:** Project có nhiều files lớn

**Giải pháp:**
```bash
# 1. Disable snapshot
nano .copilot/config.json
```
```json
"tools": {
  "repopack": {
    "enabled": false
  }
}
```

```bash
# 2. Hoặc thêm ignore patterns
"ignore": ["public/", "uploads/", "*.mp4"]
```

---

## ✅ Checklist Hoàn Thành

- [ ] Backup project (git commit)
- [ ] Copy .copilot/ vào project
- [ ] Copy .github/ vào project
- [ ] Copy documentation files
- [ ] Cài dependencies (cd .copilot && npm install)
- [ ] Cấu hình config.json cho project
- [ ] Thêm scripts vào root package.json
- [ ] Chạy npm run copilot:init
- [ ] Kiểm tra discovery results
- [ ] Tùy chỉnh .github/copilot-instructions.md
- [ ] Setup git hooks
- [ ] Update .gitignore
- [ ] Test với GitHub Copilot
- [ ] Commit changes

---

## 🎯 Tóm Tắt Nhanh

```bash
# 1. Copy files
cp -r /path/to/template/.copilot ./
cp -r /path/to/template/.github ./
cp /path/to/template/HUONG_DAN_SU_DUNG.md ./

# 2. Install
cd .copilot && npm install && cd ..

# 3. Configure
nano .copilot/config.json  # Adjust for your project

# 4. Add scripts to package.json
nano package.json  # Add copilot:* scripts

# 5. Run discovery
npm run copilot:init

# 6. Setup hooks
cd .copilot && bash scripts/setup-hooks.sh && cd ..

# 7. Test
npm run copilot:update
cat .copilot/docs/architecture/overview.md

# 8. Use with Copilot
code .
# VS Code: @workspace [your question]
```

---

## 📚 Tài Liệu Liên Quan

- `HUONG_DAN_SU_DUNG.md` - Hướng dẫn sử dụng chi tiết
- `COPILOT_SETUP.md` - Setup guide (English)
- `.copilot-workflow/option-b-hybrid.md` - Technical details

---

**Chúc bạn setup thành công! 🚀**

**Có vấn đề?** Xem phần "Xử Lý Sự Cố" trong `HUONG_DAN_SU_DUNG.md`
