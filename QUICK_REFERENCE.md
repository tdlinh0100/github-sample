# Quick Reference - GitHub Copilot Workflow

**Phiên bản:** 1.0 | **Ngày:** 05/03/2026

---

## 🚀 Quick Start

### Project Mới (Trống)
```bash
# Đã setup sẵn, chỉ cần thêm code
mkdir -p src
echo "console.log('Hello')" > src/index.js
npm run copilot:update
```

### Project Có Sẵn Code
```bash
# 1. Copy workflow vào
cp -r /path/to/template/.copilot ./
cp -r /path/to/template/.github ./

# 2. Install & run
cd .copilot && npm install && cd ..
npm run copilot:init

# 3. Done!
```

**Chi tiết:** Xem `SETUP_CHO_PROJECT_CO_SAN.md`

---

## 📝 Lệnh Thường Dùng

### Cập Nhật Context
```bash
npm run copilot:update
```
**Khi nào:** Sau khi thêm/sửa code, cài packages mới

### Watch Mode
```bash
npm run copilot:watch
```
**Khi nào:** Đang code actively, muốn auto-update

### Khởi Tạo Lại
```bash
npm run copilot:init
```
**Khi nào:** Lần đầu setup, hoặc regenerate toàn bộ

### Xem Logs
```bash
cat .copilot/logs/updates.log
tail -f .copilot/logs/updates.log  # Realtime
```

---

## 💬 Sử Dụng Với Copilot

### Hỏi Về Project
```
@workspace Project này dùng tech stack gì?
@workspace Kiến trúc như thế nào?
@workspace Tìm tất cả API endpoints
```

### Tham Chiếu Files
```
#file:.github/copilot-instructions.md
Dựa vào coding standards, tạo API endpoint mới

#file:.copilot/docs/architecture/overview.md
Giải thích architecture này
```

### Hỏi Về Patterns
```
@workspace Làm thế nào để tạo React component?
@workspace Show me authentication flow
@workspace Tìm repository pattern examples
```

---

## 📁 Cấu Trúc Files

```
.copilot/
├── config.json              # ⚙️ Cấu hình
├── docs/                    # 📄 Docs tự động
│   ├── discovery.json       # Metadata
│   ├── snapshot.xml         # Codebase snapshot
│   ├── architecture/        # Architecture docs
│   └── codemaps/            # File mappings
└── scripts/                 # 🔧 Scripts
    ├── discover.js          # Quét code
    ├── generate-docs.js     # Tạo docs
    └── update-context.js    # Update

.github/
└── copilot-instructions.md  # 📖 Hướng dẫn Copilot

.git/hooks/
├── pre-commit               # Auto-update trước commit
└── post-merge               # Regenerate sau merge
```

---

## ⚙️ Cấu Hình Nhanh

### Thêm File Types
**File:** `.copilot/config.json`
```json
"extensions": [".js", ".ts", ".vue", ".go", ".py"]
```

### Thêm Ignore Patterns
```json
"ignore": ["node_modules", "dist", "vendor", "*.log"]
```

### Tắt Snapshot (Nếu Project Lớn)
```json
"tools": {
  "repopack": {
    "enabled": false
  }
}
```

---

## 🔧 Xử Lý Sự Cố Nhanh

### Discovery Tìm 0 Files
```bash
# Kiểm tra extensions
cat .copilot/config.json | grep extensions
# Thêm extensions của bạn, rồi:
npm run copilot:update
```

### Git Hooks Không Chạy
```bash
cd .copilot
bash scripts/setup-hooks.sh
```

### Scripts Lỗi
```bash
cd .copilot
rm -rf node_modules package-lock.json
npm install
```

### Copilot Không Đọc Instructions
```
# Trong VS Code:
Cmd/Ctrl + Shift + P
→ "Copilot: Clear Cache"
→ Restart VS Code
```

---

## 📊 Workflow Hàng Ngày

### Sáng: Bắt Đầu
```bash
git pull origin main
# → post-merge hook tự động chạy
code .
```

### Trong Ngày: Code
```bash
# Option 1: Dùng git hooks (tự động)
git add .
git commit -m "feat: add feature"
# → pre-commit hook updates context

# Option 2: Watch mode
npm run copilot:watch
# → Auto-update khi save
```

### Tối: Review
```bash
cat .copilot/logs/updates.log
git push
```

---

## 🎯 Tips Nhanh

### 1. Update Trước Khi Code
```bash
npm run copilot:update
# → Context mới nhất
```

### 2. Reference Nhiều Files
```
#file:.github/copilot-instructions.md
#file:.copilot/docs/architecture/overview.md
Dựa vào 2 files này, tạo service mới
```

### 3. Dùng @workspace
```
@workspace Show all authentication code
@workspace Find API endpoints for users
```

### 4. Kiểm Tra Docs
```bash
cat .copilot/docs/architecture/overview.md
cat .copilot/docs/codemaps/backend-map.json
```

### 5. Watch Mode Khi Dev
```bash
# Terminal 1: Watch
npm run copilot:watch

# Terminal 2: Code
# → Auto-update
```

---

## 📚 Tài Liệu Đầy Đủ

### Tiếng Việt
- **HUONG_DAN_SU_DUNG.md** - Chi tiết nhất (24KB, 1060 dòng)
- **SETUP_CHO_PROJECT_CO_SAN.md** - Setup cho project có sẵn
- **QUICK_REFERENCE.md** - File này

### English
- **COPILOT_SETUP.md** - Setup guide
- **IMPLEMENTATION_COMPLETE.md** - Summary
- **SUMMARY.md** - Complete overview

---

## 🆘 Cần Giúp?

### Đọc Docs
```bash
cat HUONG_DAN_SU_DUNG.md        # Chi tiết
cat SETUP_CHO_PROJECT_CO_SAN.md # Project có sẵn
cat QUICK_REFERENCE.md          # Quick ref
```

### Kiểm Tra Logs
```bash
cat .copilot/logs/updates.log
cat .copilot/docs/discovery.json
```

### Hỏi Copilot
```
@workspace Giải thích workflow này
#file:HUONG_DAN_SU_DUNG.md Làm thế nào để...
```

---

## ✅ Checklist Nhanh

### Setup Mới
- [ ] Copy .copilot/ và .github/
- [ ] cd .copilot && npm install
- [ ] Adjust config.json
- [ ] npm run copilot:init
- [ ] Setup git hooks
- [ ] Test với Copilot

### Hàng Ngày
- [ ] git pull (hook tự chạy)
- [ ] Code
- [ ] git commit (hook tự chạy)
- [ ] Hoặc: npm run copilot:update

### Khi Có Vấn Đề
- [ ] Check logs
- [ ] Reinstall: cd .copilot && npm install
- [ ] Regenerate: npm run copilot:init
- [ ] Đọc troubleshooting

---

## 🎊 Tóm Tắt 1 Dòng

```bash
# Setup → Update → Use
npm run copilot:init && npm run copilot:update && code .
```

**Trong VS Code:** `@workspace [câu hỏi của bạn]`

---

**Version:** 1.0 | **Updated:** 05/03/2026 06:34 UTC
