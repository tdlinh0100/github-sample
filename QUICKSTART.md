# ⚡ Bắt Đầu Nhanh - 5 Phút

Chạy GitHub Copilot Workflow System trong 5 phút.

---

## Yêu Cầu

- Node.js 18+
- npm 8+
- Git
- GitHub Copilot subscription

---

## Cài Đặt (3 Lệnh)

### Cho Project Mới

```bash
# 1. Thêm source code
mkdir -p src
echo "console.log('Hello World')" > src/index.js

# 2. Update context
npm run copilot:update

# 3. Mở trong VS Code
code .
```

### Cho Project Có Sẵn

```bash
# 1. Copy hệ thống vào project của bạn
cp -r .copilot /your/project/
cp -r .github /your/project/

# 2. Cài đặt dependencies
cd /your/project/.copilot && npm install

# 3. Thêm scripts vào package.json
cd ..
npm pkg set scripts.copilot:init="cd .copilot && npm run discover && npm run generate"
npm pkg set scripts.copilot:update="cd .copilot && npm run update"
npm pkg set scripts.copilot:watch="cd .copilot && npm run watch"

# 4. Chạy discovery ban đầu
npm run copilot:init

# 5. Mở trong VS Code
code .
```

---

## Chạy Lần Đầu

### 1. Update Context

```bash
npm run copilot:update
```

**Output:**
```
🔄 Updating Copilot context...
✔ Discovery complete!
📊 Project Summary:
  Total files: 42
  Frontend: 15
  Backend: 18
  Shared: 7
  Tests: 2
✅ Context update complete!
```

### 2. Xác Minh Hoạt Động

```bash
# Kiểm tra docs được tạo
cat .copilot/docs/discovery.json
cat .copilot/docs/architecture/overview.md

# Kiểm tra Copilot instructions
cat .github/copilot-instructions.md
```

### 3. Sử Dụng Với GitHub Copilot

Mở VS Code và thử:

```
@workspace Cấu trúc project này như thế nào?
@workspace Project này dùng tech stack gì?
@workspace Cho tôi xem tất cả API endpoints
```

---

## Xác Minh Hoạt Động

### Test 1: Context Được Tạo

```bash
# Nên hiển thị project metadata
cat .copilot/docs/discovery.json | head -20
```

**Kỳ vọng:** JSON với thông tin project, số lượng files, tech stack

### Test 2: Copilot Instructions Được Tạo

```bash
# Nên hiển thị instructions cho Copilot
cat .github/copilot-instructions.md | head -30
```

**Kỳ vọng:** Markdown với context của project, coding standards

### Test 3: Copilot Hiểu Project

Trong VS Code Copilot Chat:
```
@workspace Project này có những files gì?
```

**Kỳ vọng:** Copilot liệt kê files và giải thích cấu trúc

---

## Bước Tiếp Theo

### Sử Dụng Hàng Ngày

```bash
# Update context 2-3 lần mỗi ngày
npm run copilot:update

# Hoặc dùng watch mode (auto-update khi file thay đổi)
npm run copilot:watch
```

### Tìm Hiểu Thêm

- **Hướng dẫn đầy đủ:** [HUONG_DAN.md](./HUONG_DAN.md) - Hướng dẫn tiếng Việt đầy đủ
- **Maven Projects:** [MAVEN_GUIDE.md](./MAVEN_GUIDE.md) - Setup Maven multi-module
- **Spring XML Projects:** [SPRING_XML_GUIDE.md](./SPRING_XML_GUIDE.md) - Spring Framework với XML config
- **README chính:** [README.md](./README.md) - Tổng quan và tính năng
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Lịch sử phiên bản

### Các Lệnh Thường Dùng

```bash
npm run copilot:update    # Update context (dùng nhiều nhất)
npm run copilot:watch     # Auto-update khi file thay đổi
npm run copilot:init      # Tạo lại toàn bộ (hiếm khi dùng)
cd .copilot && npm test   # Chạy tests
```

### Troubleshooting

**Discovery tìm 0 files:**
```bash
# Kiểm tra config
cat .copilot/config.json

# Thêm file extensions của bạn
# Update ignore patterns
# Chạy lại
npm run copilot:update
```

**Copilot không đọc instructions:**
1. Restart VS Code
2. Clear Copilot cache: Cmd/Ctrl+Shift+P → "Copilot: Clear Cache"
3. Reference file trực tiếp: `#file:.github/copilot-instructions.md`

---

## Những Gì Bạn Nhận Được

- `.copilot/docs/discovery.json` - Metadata của project
- `.copilot/docs/architecture/overview.md` - Tổng quan kiến trúc
- `.copilot/docs/codemaps/*.json` - Phân loại files
- `.github/copilot-instructions.md` - Context cho Copilot (11.5KB)
- 16 tests, 100% pass
- Structured logs với rotation

---

## Sẵn Sàng! 🚀

Bạn đã setup xong. Bắt đầu code và hỏi Copilot về project của bạn.

**Cần trợ giúp?** Xem [HUONG_DAN.md](./HUONG_DAN.md) để biết hướng dẫn chi tiết.
