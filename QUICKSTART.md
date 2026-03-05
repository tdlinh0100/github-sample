# ⚡ Quick Start - 5 Minutes

Get GitHub Copilot Workflow System running in 5 minutes.

---

## Prerequisites

- Node.js 18+
- npm 8+
- Git
- GitHub Copilot subscription

---

## Installation (3 Commands)

### For New Project

```bash
# 1. Add source code
mkdir -p src
echo "console.log('Hello World')" > src/index.js

# 2. Update context
npm run copilot:update

# 3. Open in VS Code
code .
```

### For Existing Project

```bash
# 1. Copy system to your project
cp -r .copilot /your/project/
cp -r .github /your/project/

# 2. Install dependencies
cd /your/project/.copilot && npm install

# 3. Add scripts to package.json
cd ..
npm pkg set scripts.copilot:init="cd .copilot && npm run discover && npm run generate"
npm pkg set scripts.copilot:update="cd .copilot && npm run update"
npm pkg set scripts.copilot:watch="cd .copilot && npm run watch"

# 4. Run initial discovery
npm run copilot:init

# 5. Open in VS Code
code .
```

---

## First Run

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

### 2. Verify It Works

```bash
# Check generated docs
cat .copilot/docs/discovery.json
cat .copilot/docs/architecture/overview.md

# Check Copilot instructions
cat .github/copilot-instructions.md
```

### 3. Use with GitHub Copilot

Open VS Code and try:

```
@workspace What is the project structure?
@workspace What tech stack does this project use?
@workspace Show me all API endpoints
```

---

## Verify It Works

### Test 1: Context Generated

```bash
# Should show project metadata
cat .copilot/docs/discovery.json | head -20
```

**Expected:** JSON with project info, file counts, tech stack

### Test 2: Copilot Instructions Created

```bash
# Should show instructions for Copilot
cat .github/copilot-instructions.md | head -30
```

**Expected:** Markdown with project context, coding standards

### Test 3: Copilot Understands Project

In VS Code Copilot Chat:
```
@workspace What files are in this project?
```

**Expected:** Copilot lists files and explains structure

---

## Next Steps

### Daily Usage

```bash
# Update context 2-3 times per day
npm run copilot:update

# Or use watch mode (auto-update on file change)
npm run copilot:watch
```

### Learn More

- **Full Guide:** [HUONG_DAN.md](./HUONG_DAN.md) - Comprehensive Vietnamese guide
- **Maven Projects:** [MAVEN_GUIDE.md](./MAVEN_GUIDE.md) - Maven multi-module setup
- **Spring XML Projects:** [SPRING_XML_GUIDE.md](./SPRING_XML_GUIDE.md) - Spring Framework with XML config
- **Main README:** [README.md](./README.md) - Overview and features
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Version history

### Common Commands

```bash
npm run copilot:update    # Update context (most used)
npm run copilot:watch     # Auto-update on file change
npm run copilot:init      # Full regenerate (rare)
cd .copilot && npm test   # Run tests
```

### Troubleshooting

**Discovery finds 0 files:**
```bash
# Check config
cat .copilot/config.json

# Add your file extensions
# Update ignore patterns
# Run again
npm run copilot:update
```

**Copilot not reading instructions:**
1. Restart VS Code
2. Clear Copilot cache: Cmd/Ctrl+Shift+P → "Copilot: Clear Cache"
3. Reference file directly: `#file:.github/copilot-instructions.md`

---

## What You Get

- `.copilot/docs/discovery.json` - Project metadata
- `.copilot/docs/architecture/overview.md` - Architecture overview
- `.copilot/docs/codemaps/*.json` - File categorization
- `.github/copilot-instructions.md` - Context for Copilot (11.5KB)
- 16 tests, 100% pass
- Structured logs with rotation

---

## Ready! 🚀

You're all set. Start coding and ask Copilot questions about your project.

**Need help?** See [HUONG_DAN.md](./HUONG_DAN.md) for detailed instructions.
