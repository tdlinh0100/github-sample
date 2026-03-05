# Tools Comparison - Codebase Documentation for AI Assistants

**Ngày so sánh:** 2026-03-05

## 📊 Comparison Matrix

### Repository-to-Text Converters

| Tool | Stars | Language | Output Format | Token Counting | Security | Best For |
|------|-------|----------|---------------|----------------|----------|----------|
| **Repopack** | 5.2k | TypeScript | XML, MD, JSON | ✅ | ✅ Secretlint | Quick snapshots |
| **code2prompt** | 1.8k | Python | Markdown | ✅ | ⚠️ Basic | Custom templates |
| **gpt-repository-loader** | 2.1k | Python | Text | ❌ | ❌ | Simple conversion |

**Winner: Repopack**
- Most features
- Active development
- Security-focused
- Multiple formats

---

### Semantic Code Search

| Tool | Approach | Languages | Privacy | Speed | Scalability |
|------|----------|-----------|---------|-------|-------------|
| **Aider** | Repo mapping | 100+ | ✅ Local | Fast | Excellent |
| **bloop** | Embeddings | 10+ | ✅ Local | Fast | Good |
| **Zoekt** | Trigram | All | ✅ Local | Very Fast | Excellent |
| **Sourcegraph** | Cloud-based | All | ❌ Cloud | Fast | Excellent |

**Winner: Aider (for AI assistants)**
- Purpose-built for AI coding
- Intelligent context gathering
- Proven at scale
- Easy integration

**Runner-up: bloop (for semantic search)**
- Privacy-first
- Natural language queries
- Good for exploration

---

### AST-Based Analysis

| Tool | Pattern Syntax | Languages | Speed | Use Case |
|------|----------------|-----------|-------|----------|
| **ast-grep** | Code-like | Many (tree-sitter) | Very Fast | Structural search |
| **Semgrep** | Code-like | 30+ | Fast | Security + Quality |
| **ts-morph** | Programmatic | TS/JS only | Fast | Code generation |
| **CodeQL** | QL language | 9 | Medium | Security research |

**Winner: ast-grep (for general use)**
- Intuitive syntax
- Fast
- Multi-language
- Easy to learn

**Winner: Semgrep (for security)**
- 2,000+ rules
- Security-focused
- Extensive community

---

### Knowledge Graph & RAG

| Tool | Approach | Complexity | Cost | Best For |
|------|----------|------------|------|----------|
| **GraphRAG** | LLM-powered | High | High | Deep analysis |
| **Kythe** | Static analysis | Very High | Medium | Enterprise |
| **CodeQL** | Query-based | High | Medium | Security |
| **Simple embeddings** | Vector DB | Low | Low | Basic RAG |

**Winner: Simple embeddings (ChromaDB)**
- For most use cases
- Low complexity
- Fast setup
- Good enough

**Use GraphRAG only if:**
- Need complex reasoning
- Have budget for LLM calls
- Very large codebase

---

## 🎯 Recommended Stack by Use Case

### Use Case 1: Quick Context for AI (Option A)
```
Tools:
- GitHub Copilot Memory (built-in)
- PRPM (community rules)
- Repopack (optional snapshots)

Pros:
- Fast setup (1-2h)
- Low maintenance
- Proven

Cons:
- Limited customization
- Basic features only
```

### Use Case 2: Production Team (Option B) ⭐ RECOMMENDED
```
Tools:
- Repopack (snapshots)
- ast-grep (structural search)
- Custom scripts (automation)
- PRPM (community rules)
- Git hooks (auto-update)

Pros:
- Best balance
- Proven tools
- Maintainable
- Scalable

Cons:
- Medium setup (3-5h)
- Some maintenance
```

### Use Case 3: Enterprise/Special Needs (Option C)
```
Tools:
- Custom scanner (@babel/parser)
- ChromaDB (embeddings)
- ast-grep (search)
- GraphRAG (optional)
- Custom everything

Pros:
- Full control
- Perfect fit
- Advanced features

Cons:
- High effort (1-2 weeks)
- High maintenance
- No community support
```

---

## 💰 Cost Analysis

### Setup Cost

| Option | Time | Hourly Rate | Total Cost |
|--------|------|-------------|------------|
| **Option A** | 1-2h | $50/h | $50-100 |
| **Option B** | 3-5h | $50/h | $150-250 |
| **Option C** | 80-160h | $50/h | $4,000-8,000 |

### Maintenance Cost (Annual)

| Option | Weekly | Annual | Total Cost |
|--------|--------|--------|------------|
| **Option A** | 0.5h | 26h | $1,300 |
| **Option B** | 1h | 52h | $2,600 |
| **Option C** | 3h | 156h | $7,800 |

### Value Generated (Annual, Team of 3)

| Metric | Before | After A | After B | After C |
|--------|--------|---------|---------|---------|
| **Time to find code** | 15 min | 8 min | 3 min | 2 min |
| **Daily savings** | - | 21 min | 36 min | 39 min |
| **Annual value** | - | $7,875 | $13,500 | $14,625 |

### ROI Calculation

| Option | Setup | Maintenance | Value | Net | ROI |
|--------|-------|-------------|-------|-----|-----|
| **Option A** | $100 | $1,300 | $7,875 | $6,475 | 462% |
| **Option B** | $250 | $2,600 | $13,500 | $10,650 | 374% |
| **Option C** | $8,000 | $7,800 | $14,625 | -$1,175 | -7% |

**Conclusion:**
- Option A: Best ROI (462%) but limited features
- Option B: Great ROI (374%) with excellent features ⭐
- Option C: Negative ROI first year, break-even year 2

---

## 🔍 Detailed Tool Reviews

### Repopack ⭐⭐⭐⭐⭐

**Pros:**
- Multiple output formats (XML, Markdown, JSON)
- Token counting per file
- Security scanning (Secretlint)
- Git-aware (.gitignore support)
- Tree-sitter compression
- Remote repository support
- Active development

**Cons:**
- Static snapshot (no semantic understanding)
- Manual regeneration needed
- Large repos = large output

**Best For:**
- Quick codebase snapshots
- LLM consumption
- Documentation generation

**Installation:**
```bash
npx repopack
# or
npm install -g repopack
```

**Usage:**
```bash
repomix --output snapshot.xml --style xml
```

---

### Aider ⭐⭐⭐⭐⭐

**Pros:**
- Intelligent repo mapping
- Context-gatherer subagent
- AST-based analysis
- 100+ language support
- Proven at scale
- Active community

**Cons:**
- Requires running service
- Python-based
- Learning curve

**Best For:**
- AI pair programming
- Deep codebase understanding
- Context optimization

**Installation:**
```bash
pip install aider-chat
```

**Usage:**
```bash
aider --map-tokens 1024
```

---

### ast-grep ⭐⭐⭐⭐⭐

**Pros:**
- Intuitive code-like syntax
- Very fast
- Multi-language (tree-sitter)
- Search and replace
- Custom linting
- Online playground

**Cons:**
- Requires AST understanding
- Pattern syntax learning curve

**Best For:**
- Structural code search
- Pattern-based refactoring
- Custom linting rules

**Installation:**
```bash
npm install -g @ast-grep/cli
```

**Usage:**
```bash
ast-grep --pattern 'function $NAME($$$) { $$$ }'
```

---

### bloop ⭐⭐⭐⭐

**Pros:**
- Privacy-first (local embeddings)
- Natural language queries
- Multi-modal search
- Fast (Tantivy + Qdrant)
- Code Studio LLM playground

**Cons:**
- Rust-based (compilation)
- Resource intensive
- Setup complexity

**Best For:**
- Private semantic search
- Natural language queries
- Code exploration

**Installation:**
```bash
# Download from releases
# Or build from source
```

---

### Semgrep ⭐⭐⭐⭐

**Pros:**
- 2,000+ community rules
- 30+ languages
- Code-like syntax
- Security-focused
- Automatic fixes
- IDE integration

**Cons:**
- Community edition limited
- Single-file analysis only (free)
- Data-flow requires commercial

**Best For:**
- Security analysis
- Code quality enforcement
- Custom linting

**Installation:**
```bash
pip install semgrep
```

**Usage:**
```bash
semgrep --config auto
```

---

### GraphRAG ⭐⭐⭐

**Pros:**
- Sophisticated reasoning
- Multi-level analysis
- Research-backed
- Private data support

**Cons:**
- Expensive to run
- Complex setup
- High LLM costs
- Overkill for most cases

**Best For:**
- Complex document analysis
- Deep reasoning required
- Research projects

**Installation:**
```bash
pip install graphrag
```

---

## 🎯 Decision Tree

```
Start Here
    ↓
Solo dev, <50 files?
    ├─ YES → Option A (Copilot + PRPM)
    └─ NO → Continue
         ↓
Team 2-5, 50-200 files?
    ├─ YES → Option B (Hybrid) ⭐
    └─ NO → Continue
         ↓
Team 5+, 200+ files?
    ├─ YES → Option B (with scaling)
    └─ NO → Continue
         ↓
Very specific needs?
    ├─ YES → Try Option B first
    │         ↓
    │    Still not enough?
    │         ├─ YES → Option C
    │         └─ NO → Stay with B
    └─ NO → Option B
```

---

## 📋 Feature Comparison

| Feature | Option A | Option B | Option C |
|---------|----------|----------|----------|
| **Codebase Snapshots** | ⚠️ Manual | ✅ Automated | ✅ Custom |
| **Semantic Search** | ❌ | ⚠️ Basic | ✅ Advanced |
| **Pattern Recognition** | ⚠️ Basic | ✅ Good | ✅ Perfect |
| **Context Selection** | ❌ | ✅ Smart | ✅ Optimal |
| **Git Integration** | ❌ | ✅ Hooks | ✅ Custom |
| **Team Collaboration** | ⚠️ Basic | ✅ Excellent | ✅ Excellent |
| **Incremental Updates** | ❌ | ✅ Yes | ✅ Yes |
| **Token Optimization** | ⚠️ Basic | ✅ Good | ✅ Perfect |
| **Documentation Gen** | ❌ | ✅ Automated | ✅ Custom |
| **Symbol Registry** | ❌ | ⚠️ Basic | ✅ Advanced |
| **Dependency Graph** | ❌ | ⚠️ Basic | ✅ Advanced |
| **Security Scanning** | ❌ | ⚠️ Optional | ✅ Custom |

---

## 🏆 Final Recommendations

### For 90% of Use Cases: Option B ⭐

**Tools:**
1. **Repopack** - Codebase snapshots
2. **ast-grep** - Structural search
3. **PRPM** - Community rules
4. **Custom scripts** - Automation

**Why:**
- Best balance (9/10 quality, 3-5h effort)
- Proven tools
- Community support
- Maintainable
- Scalable
- Fast ROI

### For Quick Testing: Option A

**Tools:**
1. **GitHub Copilot** (native features)
2. **PRPM** (optional)

**Why:**
- Fast setup (1-2h)
- Validate approach
- Low risk
- Easy upgrade to B

### For Special Needs: Option C

**Tools:**
1. **Custom everything**
2. **ChromaDB** (embeddings)
3. **GraphRAG** (optional)

**Why:**
- Full control
- Perfect fit
- Advanced features

**But only if:**
- Option B tried and insufficient
- Have 1-2 weeks
- Specific requirements
- Plan to maintain

---

## 📚 Resources

### Documentation
- [Repopack](https://github.com/yamadashy/repopack)
- [Aider](https://aider.chat)
- [ast-grep](https://ast-grep.github.io)
- [bloop](https://github.com/BloopAI/bloop)
- [Semgrep](https://semgrep.dev)
- [GraphRAG](https://github.com/microsoft/graphrag)

### Community
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) - 38.2k stars
- [cursor.directory](https://cursor.directory) - 3.9k stars
- [PRPM](https://prpm.ai) - 7,500+ packages

### Comparisons
- [Cursor vs Copilot](https://cursor.directory/compare)
- [Code Search Tools](https://github.com/topics/code-search)
- [AST Tools](https://github.com/topics/ast)

---

**Last updated:** 2026-03-05
**Maintained by:** Research team
**Next review:** 2026-06-05
