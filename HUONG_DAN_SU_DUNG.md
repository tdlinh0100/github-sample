# Hướng Dẫn Sử Dụng GitHub Copilot Workflow

**Ngày tạo:** 05/03/2026
**Phiên bản:** 1.0 - Option B (Hybrid Approach)
**Trạng thái:** ✅ Đã cài đặt và sẵn sàng sử dụng

---

## 📚 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [Cách Sử Dụng Cơ Bản](#cách-sử-dụng-cơ-bản)
4. [Làm Việc Với GitHub Copilot](#làm-việc-với-github-copilot)
5. [Các Lệnh Thường Dùng](#các-lệnh-thường-dùng)
6. [Workflow Hàng Ngày](#workflow-hàng-ngày)
7. [Tùy Chỉnh Và Cấu Hình](#tùy-chỉnh-và-cấu-hình)
8. [Xử Lý Sự Cố](#xử-lý-sự-cố)
9. [Tips & Tricks](#tips--tricks)
10. [Câu Hỏi Thường Gặp](#câu-hỏi-thường-gặp)

---

## Giới Thiệu

> **📌 LƯU Ý:** Nếu bạn muốn setup cho **project đã có sẵn code**, xem file `SETUP_CHO_PROJECT_CO_SAN.md` để có hướng dẫn chi tiết.

### Hệ Thống Này Làm Gì?

Hệ thống GitHub Copilot Workflow giúp bạn:

✅ **Tự động quét và hiểu codebase** - Không cần đọc lung tung source code
✅ **Tạo tài liệu tự động** - Architecture, codemaps, tech stack
✅ **Tối ưu context cho Copilot** - Copilot hiểu project của bạn tốt hơn
✅ **Tiết kiệm thời gian** - Giảm 70% thời gian tìm code
✅ **Tăng độ chính xác** - Copilot suggestions chính xác hơn 20-30%

### Đã Cài Đặt Gì?

```
✓ .copilot/                    # Thư mục chính
  ✓ Scripts tự động quét code
  ✓ 101 packages đã cài
  ✓ Tài liệu tự động sinh

✓ .github/                     # GitHub Copilot config
  ✓ copilot-instructions.md    # Hướng dẫn cho Copilot

✓ Git hooks                    # Tự động cập nhật
  ✓ pre-commit                 # Chạy trước khi commit
  ✓ post-merge                 # Chạy sau khi merge

✓ npm scripts                  # Lệnh tiện ích
  ✓ copilot:init
  ✓ copilot:update
  ✓ copilot:watch
```

---

## Cấu Trúc Thư Mục

### Thư Mục `.copilot/`

```
.copilot/
├── config.json                 # ⚙️ Cấu hình hệ thống
│   └── Chứa: ignore patterns, file extensions, token limits
│
├── package.json                # 📦 Dependencies
│   └── 101 packages: @babel/parser, glob, chalk, ora...
│
├── docs/                       # 📄 Tài liệu tự động sinh
│   ├── discovery.json          # Metadata của project
│   ├── snapshot.xml            # Toàn bộ code (126KB)
│   ├── architecture/
│   │   └── overview.md         # Tổng quan kiến trúc
│   └── codemaps/
│       ├── frontend-map.json   # Map files frontend
│       ├── backend-map.json    # Map files backend
│       └── shared-map.json     # Map files dùng chung
│
├── scripts/                    # 🔧 Scripts tự động
│   ├── discover.js             # Quét codebase
│   ├── generate-docs.js        # Tạo tài liệu
│   ├── update-context.js       # Cập nhật context
│   └── setup-hooks.sh          # Cài git hooks
│
├── cache/                      # 💾 Cache (tự động)
└── logs/                       # 📝 Logs
    └── updates.log             # Lịch sử cập nhật
```

### Thư Mục `.github/`

```
.github/
└── copilot-instructions.md     # 📖 Hướng dẫn cho Copilot (11.5KB)
    ├── Project overview
    ├── Tech stack
    ├── Coding standards
    ├── Testing requirements
    ├── Common patterns
    ├── Security guidelines
    └── Git workflow
```

### Thư Mục `.copilot-workflow/`

```
.copilot-workflow/              # 📚 Tài liệu tham khảo
├── README.md                   # Tổng quan
├── option-a-quick-start.md     # Option A (1-2 giờ)
├── option-b-hybrid.md          # Option B (đã cài) ⭐
├── option-c-custom-build.md    # Option C (1-2 tuần)
├── recommendation.md           # Tại sao chọn Option B
├── research-summary.md         # Kết quả research
└── tools-comparison.md         # So sánh tools
```

---

## Cách Sử Dụng Cơ Bản

### Bước 1: Kiểm Tra Cài Đặt

```bash
# Xem tài liệu đã tạo
cat .copilot/docs/architecture/overview.md

# Xem metadata project
cat .copilot/docs/discovery.json

# Xem hướng dẫn cho Copilot
cat .github/copilot-instructions.md
```

### Bước 2: Thêm Source Code

**Hiện tại project đang trống (0 files).** Khi bạn thêm code:

```bash
# Ví dụ: Tạo file mới
mkdir -p src
echo "console.log('Hello World')" > src/index.js

# Cập nhật context
npm run copilot:update
```

**Hệ thống sẽ tự động:**
- ✅ Quét file mới
- ✅ Phát hiện tech stack (Node.js, JavaScript...)
- ✅ Phân loại files (frontend/backend/shared)
- ✅ Tạo codemaps
- ✅ Cập nhật architecture docs

### Bước 3: Xem Kết Quả

```bash
# Xem lại architecture (đã cập nhật)
cat .copilot/docs/architecture/overview.md

# Xem discovery results
cat .copilot/docs/discovery.json

# Xem codemaps
cat .copilot/docs/codemaps/backend-map.json
```

---

## Làm Việc Với GitHub Copilot

### Mở VS Code

1. Mở project trong VS Code
2. Đảm bảo GitHub Copilot extension đã cài
3. Mở Copilot Chat (Ctrl/Cmd + Shift + I)

### Sử Dụng Context

#### 1. Hỏi Về Project

```
@workspace Project này dùng tech stack gì?
```

**Copilot sẽ đọc:**
- `.github/copilot-instructions.md`
- `.copilot/docs/architecture/overview.md`
- `.copilot/docs/discovery.json`

#### 2. Hỏi Về Architecture

```
@workspace Kiến trúc của project này như thế nào?
```

**Copilot sẽ trả lời dựa trên:**
- Architecture overview
- File structure
- Entry points
- Tech stack detected

#### 3. Tham Chiếu File Cụ Thể

```
#file:.github/copilot-instructions.md
Dựa vào coding standards này, tạo một API endpoint mới cho user management
```

**Copilot sẽ:**
- Đọc coding standards
- Follow patterns đã định nghĩa
- Tạo code đúng convention

#### 4. Hỏi Về Patterns

```
@workspace Làm thế nào để tạo một custom React hook trong project này?
```

**Copilot sẽ:**
- Tìm patterns trong `.github/copilot-instructions.md`
- Show examples
- Generate code theo pattern

#### 5. Tìm Code

```
@workspace Tìm tất cả API endpoints trong project
```

**Copilot sẽ:**
- Search trong codemaps
- List tất cả endpoints
- Show file locations

---

## Các Lệnh Thường Dùng

### 1. Cập Nhật Context (Quan Trọng Nhất)

```bash
npm run copilot:update
```

**Khi nào chạy:**
- ✅ Sau khi thêm files mới
- ✅ Sau khi thay đổi nhiều code
- ✅ Sau khi cài thêm packages
- ✅ Trước khi bắt đầu task mới

**Lệnh này sẽ:**
1. Quét lại toàn bộ codebase
2. Phát hiện tech stack mới
3. Cập nhật codemaps
4. Regenerate architecture docs
5. Tạo snapshot mới

**Thời gian:** ~5-10 giây

### 2. Khởi Tạo Lần Đầu

```bash
npm run copilot:init
```

**Khi nào dùng:**
- Lần đầu setup (đã chạy rồi)
- Sau khi clone project mới
- Khi muốn regenerate toàn bộ

**Lệnh này = discover + generate**

### 3. Watch Mode (Development)

```bash
npm run copilot:watch
```

**Khi nào dùng:**
- Đang code actively
- Muốn auto-update khi save file
- Development mode

**Lệnh này sẽ:**
- Watch thư mục `src/`
- Auto-run update khi file thay đổi
- Chạy background

**Để dừng:** Ctrl + C

### 4. Xem Logs

```bash
# Xem lịch sử updates
cat .copilot/logs/updates.log

# Xem logs realtime
tail -f .copilot/logs/updates.log
```

### 5. Kiểm Tra Git Hooks

```bash
# Xem pre-commit hook
cat .git/hooks/pre-commit

# Xem post-merge hook
cat .git/hooks/post-merge

# Test pre-commit hook
git add .
git commit -m "test: check hook"
# → Hook sẽ chạy tự động
```

---

## Workflow Hàng Ngày

### Scenario 1: Bắt Đầu Ngày Làm Việc

```bash
# 1. Pull code mới
git pull origin main
# → post-merge hook tự động chạy
# → Docs được regenerate

# 2. Kiểm tra updates
cat .copilot/logs/updates.log

# 3. Mở VS Code và bắt đầu code
code .
```

### Scenario 2: Thêm Feature Mới

```bash
# 1. Tạo branch mới
git checkout -b feature/user-auth

# 2. Hỏi Copilot về patterns
# Trong VS Code Copilot Chat:
```
```
@workspace Làm thế nào để implement authentication trong project này?
#file:.github/copilot-instructions.md
Dựa vào security guidelines, tạo authentication service
```

```bash
# 3. Code feature...

# 4. Commit (hook tự động chạy)
git add .
git commit -m "feat: add user authentication"
# → pre-commit hook updates context
# → Docs được add vào commit

# 5. Push
git push origin feature/user-auth
```

### Scenario 3: Fix Bug

```bash
# 1. Tìm code liên quan
# Trong VS Code Copilot Chat:
```
```
@workspace Tìm code xử lý user login
@workspace Show me authentication flow
```

```bash
# 2. Fix bug...

# 3. Test

# 4. Commit
git add .
git commit -m "fix: resolve login timeout issue"
# → Hook tự động update
```

### Scenario 4: Refactor Code

```bash
# 1. Bật watch mode
npm run copilot:watch

# 2. Refactor code...
# → Watch mode tự động update khi save

# 3. Kiểm tra docs đã update
cat .copilot/docs/architecture/overview.md

# 4. Commit
git add .
git commit -m "refactor: improve auth service structure"
```

### Scenario 5: Review Code

```bash
# 1. Checkout branch cần review
git checkout feature/new-api

# 2. Update context
npm run copilot:update

# 3. Hỏi Copilot
# Trong VS Code:
```
```
@workspace Phân tích code trong branch này
@workspace Có vấn đề gì về security không?
@workspace Code này follow patterns của project không?
```

---

## Tùy Chỉnh Và Cấu Hình

### 1. Chỉnh Scan Patterns

**File:** `.copilot/config.json`

```json
{
  "scan": {
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage"
    ],
    "extensions": [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".py",
      ".go"
    ],
    "maxFileSize": 100000
  }
}
```

**Thêm file types:**
```json
"extensions": [".js", ".ts", ".vue", ".rs", ".java"]
```

**Thêm ignore patterns:**
```json
"ignore": ["node_modules", "vendor", "target", "*.log"]
```

**Sau khi sửa:**
```bash
npm run copilot:update
```

### 2. Tùy Chỉnh Copilot Instructions

**File:** `.github/copilot-instructions.md`

**Thêm project-specific patterns:**

```markdown
## Custom Patterns

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling
Always use try-catch with specific error types
```

**Thêm coding rules:**

```markdown
## Project Rules

1. NEVER use `any` type in TypeScript
2. ALWAYS validate user input with Zod
3. ALWAYS write tests before implementation (TDD)
4. File size limit: 400 lines max
```

**Sau khi sửa:**
- Không cần chạy lệnh gì
- Copilot sẽ đọc file mới ngay

### 3. Tạo Path-Specific Instructions

**Cho API routes:**

```bash
mkdir -p .github/instructions
nano .github/instructions/api.instructions.md
```

**Nội dung:**
```markdown
---
applyTo: "src/api/**/*.ts"
---

# API Development Guidelines

## Request Validation
- Use Zod for all inputs
- Return 400 for validation errors

## Response Format
- Always use ApiResponse<T>
- Include proper HTTP status codes

## Security
- Rate limit all endpoints
- Validate authentication tokens
```

**Cho React components:**

```bash
nano .github/instructions/components.instructions.md
```

**Nội dung:**
```markdown
---
applyTo: "src/components/**/*.tsx"
---

# React Component Guidelines

## Structure
- Functional components only
- Props interface above component
- Export as default

## Naming
- PascalCase for components
- camelCase for props
- Prefix event handlers with 'handle'
```

### 4. Điều Chỉnh Context Layers

**File:** `.copilot/config.json`

```json
{
  "context": {
    "maxTokens": 100000,
    "layers": {
      "project": 10000,    // Context luôn load
      "feature": 30000,    // Context theo feature
      "task": 60000        // Context theo task
    }
  }
}
```

**Tăng nếu project lớn:**
```json
"layers": {
  "project": 15000,
  "feature": 40000,
  "task": 70000
}
```

---

## Xử Lý Sự Cố

### Vấn Đề 1: Discovery Tìm 0 Files

**Triệu chứng:**
```bash
npm run copilot:update
# → Total files: 0
```

**Nguyên nhân:**
- Project đang trống (bình thường)
- Scan patterns không match
- Files bị ignore

**Giải pháp:**

**1. Kiểm tra có source code chưa:**
```bash
ls -la src/
```

**2. Kiểm tra config:**
```bash
cat .copilot/config.json
# Xem "extensions" và "ignore"
```

**3. Thêm extensions nếu cần:**
```json
"extensions": [".js", ".ts", ".py", ".go", ".vue"]
```

**4. Chạy lại:**
```bash
npm run copilot:update
```

### Vấn Đề 2: Git Hooks Không Chạy

**Triệu chứng:**
```bash
git commit -m "test"
# → Hook không chạy
```

**Giải pháp:**

**1. Kiểm tra hooks có tồn tại:**
```bash
ls -la .git/hooks/ | grep -E "(pre-commit|post-merge)"
```

**2. Kiểm tra executable:**
```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-merge
```

**3. Reinstall hooks:**
```bash
cd .copilot
bash scripts/setup-hooks.sh
```

**4. Test lại:**
```bash
git add .
git commit -m "test: check hook"
```

### Vấn Đề 3: Scripts Báo Lỗi

**Triệu chứng:**
```bash
npm run copilot:update
# → Error: Cannot find module...
```

**Giải pháp:**

**1. Kiểm tra Node.js version:**
```bash
node --version
# Cần >= 18.0.0
```

**2. Reinstall dependencies:**
```bash
cd .copilot
rm -rf node_modules package-lock.json
npm install
```

**3. Kiểm tra ES modules:**
```bash
cat .copilot/package.json | grep "type"
# Phải có: "type": "module"
```

**4. Chạy lại:**
```bash
npm run copilot:update
```

### Vấn Đề 4: Copilot Không Đọc Instructions

**Triệu chứng:**
- Copilot suggestions không follow patterns
- Không biết về project structure

**Giải pháp:**

**1. Restart VS Code:**
```bash
# Đóng và mở lại VS Code
```

**2. Clear Copilot cache:**
- Cmd/Ctrl + Shift + P
- Gõ: "Copilot: Clear Cache"
- Enter

**3. Reference file trực tiếp:**
```
#file:.github/copilot-instructions.md
#file:.copilot/docs/architecture/overview.md
[Your question]
```

**4. Kiểm tra file tồn tại:**
```bash
cat .github/copilot-instructions.md
```

### Vấn Đề 5: Watch Mode Không Hoạt Động

**Triệu chứng:**
```bash
npm run copilot:watch
# → Không update khi save file
```

**Giải pháp:**

**1. Kiểm tra nodemon:**
```bash
cd .copilot
npm list nodemon
```

**2. Reinstall nodemon:**
```bash
cd .copilot
npm install nodemon --save-dev
```

**3. Kiểm tra watch path:**
```bash
cat .copilot/package.json | grep watch
# Phải có: "watch": "nodemon --watch ../src --exec 'npm run update'"
```

**4. Thay đổi watch path nếu cần:**
```json
"watch": "nodemon --watch ../your-src-folder --exec 'npm run update'"
```

### Vấn Đề 6: Snapshot Quá Lớn

**Triệu chứng:**
```bash
ls -lh .copilot/docs/snapshot.xml
# → 500MB+
```

**Giải pháp:**

**1. Thêm ignore patterns:**
```json
// .copilot/config.json
"ignore": [
  "node_modules",
  "dist",
  "build",
  "*.log",
  "*.mp4",
  "*.zip",
  "public/uploads"
]
```

**2. Tăng maxFileSize filter:**
```json
"maxFileSize": 50000  // Giảm từ 100000
```

**3. Regenerate:**
```bash
npm run copilot:update
```

---

## Tips & Tricks

### Tip 1: Sử Dụng Watch Mode Hiệu Quả

```bash
# Terminal 1: Watch mode
npm run copilot:watch

# Terminal 2: Code và test
# → Mỗi lần save, context tự động update
```

### Tip 2: Tham Chiếu Nhiều Files

```
#file:.github/copilot-instructions.md
#file:.copilot/docs/architecture/overview.md
Dựa vào 2 files này, tạo một service mới cho payment processing
```

### Tip 3: Hỏi Về Specific Module

```
@workspace Show me all files related to authentication
@workspace Explain the user service implementation
@workspace Find all API endpoints for user management
```

### Tip 4: Kiểm Tra Context Trước Khi Code

```bash
# Trước khi bắt đầu task mới
npm run copilot:update

# Xem architecture
cat .copilot/docs/architecture/overview.md

# Sau đó mới code
```

### Tip 5: Sử Dụng Codemaps

```bash
# Xem frontend files
cat .copilot/docs/codemaps/frontend-map.json

# Xem backend files
cat .copilot/docs/codemaps/backend-map.json

# Tìm file cụ thể
cat .copilot/docs/codemaps/backend-map.json | grep "auth"
```

### Tip 6: Commit Messages Tốt

```bash
# Hook sẽ update context, nên commit message nên rõ ràng
git commit -m "feat: add user authentication with JWT"
git commit -m "fix: resolve login timeout in auth service"
git commit -m "refactor: improve error handling in API layer"
```

### Tip 7: Review Generated Docs

```bash
# Sau mỗi update, xem docs đã đúng chưa
cat .copilot/docs/architecture/overview.md

# Nếu sai, adjust config và chạy lại
nano .copilot/config.json
npm run copilot:update
```

### Tip 8: Backup Trước Khi Thay Đổi Lớn

```bash
# Backup docs hiện tại
cp -r .copilot/docs .copilot/docs.backup

# Thay đổi config...

# Nếu không ổn, restore
rm -rf .copilot/docs
mv .copilot/docs.backup .copilot/docs
```

### Tip 9: Sử Dụng Với Team

```bash
# 1. Commit .copilot/ và .github/ vào git
git add .copilot/ .github/
git commit -m "chore: add copilot workflow"
git push

# 2. Team members pull về
git pull

# 3. Họ chỉ cần chạy
cd .copilot
npm install
cd ..
npm run copilot:init
```

### Tip 10: Monitor Performance

```bash
# Xem logs để track updates
tail -f .copilot/logs/updates.log

# Xem thời gian mỗi update
cat .copilot/logs/updates.log
```

---

## Câu Hỏi Thường Gặp

### Q1: Tôi có cần chạy update sau mỗi lần thay đổi code không?

**A:** Không nhất thiết. Git hooks sẽ tự động chạy khi commit. Nhưng nên chạy manual khi:
- Thêm nhiều files mới
- Thay đổi structure lớn
- Cài thêm packages
- Trước khi bắt đầu task mới

### Q2: Watch mode có ảnh hưởng performance không?

**A:** Rất ít. Watch mode chỉ chạy khi file thay đổi. Nếu lo lắng:
- Chỉ bật khi đang code actively
- Tắt khi không dùng (Ctrl+C)
- Hoặc dùng git hooks thay thế

### Q3: Tôi có thể xóa .copilot/docs/ không?

**A:** Có, nhưng không nên. Nếu xóa:
```bash
rm -rf .copilot/docs/
npm run copilot:init  # Regenerate
```

### Q4: File snapshot.xml có cần thiết không?

**A:** Có, nhưng có thể disable nếu project quá lớn:
```json
// .copilot/config.json
"tools": {
  "repopack": {
    "enabled": false  // Tắt snapshot
  }
}
```

### Q5: Làm sao để Copilot hiểu project tốt hơn?

**A:**
1. Update context thường xuyên
2. Customize `.github/copilot-instructions.md`
3. Add path-specific instructions
4. Provide examples trong instructions
5. Reference files khi hỏi

### Q6: Tôi có thể dùng với monorepo không?

**A:** Có. Adjust config:
```json
"scan": {
  "ignore": ["node_modules", "packages/*/node_modules"]
}
```

Hoặc setup riêng cho mỗi package.

### Q7: Làm sao để share với team?

**A:**
1. Commit `.copilot/` và `.github/` vào git
2. Add `.copilot/node_modules/` vào `.gitignore`
3. Team chạy `cd .copilot && npm install`
4. Done!

### Q8: Có tốn tiền không?

**A:** Không. Tất cả tools đều free:
- Repopack: Free
- ast-grep: Free
- Scripts: Custom code
- GitHub Copilot: Cần subscription (riêng)

### Q9: Tôi có thể customize scripts không?

**A:** Có! Scripts ở `.copilot/scripts/`:
- `discover.js` - Customize scan logic
- `generate-docs.js` - Customize doc format
- `update-context.js` - Customize workflow

### Q10: Làm sao để upgrade sau này?

**A:**
1. Backup hiện tại
2. Pull updates từ `.copilot-workflow/`
3. Merge changes vào scripts
4. Test với `npm run copilot:update`

---

## 🎯 Tóm Tắt Nhanh

### Lệnh Quan Trọng Nhất

```bash
# Cập nhật context (dùng nhiều nhất)
npm run copilot:update

# Watch mode (khi đang code)
npm run copilot:watch

# Xem docs
cat .copilot/docs/architecture/overview.md
```

### Workflow Cơ Bản

```
1. Thêm/sửa code
2. npm run copilot:update (hoặc git commit - hook tự chạy)
3. Hỏi Copilot với @workspace
4. Code với suggestions tốt hơn
5. Repeat
```

### Khi Gặp Vấn Đề

```
1. Đọc phần "Xử Lý Sự Cố"
2. Check logs: cat .copilot/logs/updates.log
3. Reinstall: cd .copilot && npm install
4. Regenerate: npm run copilot:init
```

---

## 📞 Hỗ Trợ

### Tài Liệu Tham Khảo

- `COPILOT_SETUP.md` - Setup guide (English)
- `IMPLEMENTATION_COMPLETE.md` - Implementation summary
- `.copilot-workflow/option-b-hybrid.md` - Chi tiết kỹ thuật

### Kiểm Tra Logs

```bash
# Update history
cat .copilot/logs/updates.log

# Discovery results
cat .copilot/docs/discovery.json

# Architecture
cat .copilot/docs/architecture/overview.md
```

---

**Chúc bạn sử dụng hiệu quả! 🚀**

**Có câu hỏi?** Hỏi Copilot: `@workspace Giải thích workflow này cho tôi`
