# Quick Reference Card

Fast lookup for common tasks and commands.

---

## Commands

### Daily Usage (from project root)

```bash
npm run copilot:update    # Update context (2-3x/day)
npm run copilot:watch     # Auto-update mode
npm run copilot:init      # Full regenerate
```

### From .copilot/ Directory

```bash
npm run update            # Update context
npm run discover          # Run discovery
npm run generate          # Generate docs
npm test                  # Run tests (16 tests)
```

---

## When to Update

### ✅ Update When:
- Added 5+ new files
- Installed new packages
- Changed project structure
- Before starting new task
- After pulling from team
- Copilot suggestions inaccurate

### ❌ Don't Update When:
- Small file changes (1-2 files)
- Just fixing typos
- Only doc changes
- Every commit (overkill)

**Rule:** 2-3 times per day is enough

---

## File Locations

```
.copilot/docs/
├── discovery.json              # Project metadata
├── maven-discovery.json        # Maven info (if applicable)
├── spring-xml-discovery.json   # Spring XML info (if applicable)
├── architecture/
│   └── overview.md            # Architecture overview
└── codemaps/
    ├── frontend-map.json      # Frontend files
    ├── backend-map.json       # Backend files
    ├── shared-map.json        # Shared utilities
    └── test-map.json          # Test files

.github/
└── copilot-instructions.md    # Copilot context (11.5KB)

.copilot/
├── config.json                # Configuration
└── logs/
    └── discover.log           # Structured logs
```

---

## Copilot Questions

### Project Understanding
```
@workspace What is the project structure?
@workspace What tech stack does this project use?
@workspace Show me the architecture
```

### Code Navigation
```
@workspace Find all API endpoints
@workspace Where is the authentication logic?
@workspace Show me all controllers
```

### Code Generation
```
#file:.github/copilot-instructions.md
Based on coding standards, create a new API endpoint for user management
```

---

## Troubleshooting

### Discovery finds 0 files
```bash
cat .copilot/config.json        # Check config
# Add file extensions
# Update ignore patterns
npm run copilot:update          # Run again
```

### Tests fail
```bash
cd .copilot
rm -rf node_modules package-lock.json
npm install
npm test
```

### Copilot not reading instructions
1. Restart VS Code
2. Cmd/Ctrl+Shift+P → "Copilot: Clear Cache"
3. Reference directly: `#file:.github/copilot-instructions.md`

---

## Configuration

### File: `.copilot/config.json`

**Common changes:**

```json
{
  "scan": {
    "ignore": ["node_modules", "dist", "target"],
    "extensions": [".js", ".ts", ".java", ".py"],
    "maxFileSize": 100000
  }
}
```

**After changes:** Run `npm run copilot:update`

---

## Documentation

- **[QUICKSTART.md](../../QUICKSTART.md)** - 5-minute setup
- **[HUONG_DAN.md](../../HUONG_DAN.md)** - Full guide
- **[MAVEN_GUIDE.md](../../MAVEN_GUIDE.md)** - Maven projects
- **[SPRING_XML_GUIDE.md](../../SPRING_XML_GUIDE.md)** - Spring XML projects
- **[README.md](../../README.md)** - Overview
- **[CHANGELOG.md](../../CHANGELOG.md)** - Version history

---

## Workflow

```bash
# Morning: Pull code
git pull origin main
npm run copilot:update

# During day: Code normally
# ... edit files ...

# When needed: Update context
npm run copilot:update

# Evening: Commit
git add .
git commit -m "feat: add feature"
git push
```

---

## Performance

- **Small projects:** 2-5 seconds
- **Large projects:** 10-30 seconds
- **Tests:** 16 tests, 100% pass
- **Quality score:** 8.5/10

---

## Support

**Ask Copilot:**
```
@workspace How do I use this system?
@workspace Explain the workflow
```

**Read docs:**
- Quick start: [QUICKSTART.md](../../QUICKSTART.md)
- Full guide: [HUONG_DAN.md](../../HUONG_DAN.md)

---

**Version:** 3.0.0
**Updated:** 2026-03-05
