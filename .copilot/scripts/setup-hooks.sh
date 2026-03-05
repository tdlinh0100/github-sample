#!/bin/bash

# Git Hooks Setup Script
# This script installs pre-commit and post-merge hooks for the project

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"
COPILOT_DIR="$PROJECT_ROOT/.copilot"

echo "Setting up git hooks for project at: $PROJECT_ROOT"

# Ensure hooks directory exists
if [ ! -d "$HOOKS_DIR" ]; then
    echo "Error: .git/hooks directory not found. Is this a git repository?"
    exit 1
fi

# Create pre-commit hook
echo "Creating pre-commit hook..."
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Pre-commit hook: Update context for staged files

set -e

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
COPILOT_DIR="$PROJECT_ROOT/.copilot"

echo "Running pre-commit hook: Updating context for staged files..."

if [ ! -d "$COPILOT_DIR" ]; then
    echo "Warning: .copilot directory not found, skipping context update"
    exit 0
fi

# Run update command
cd "$COPILOT_DIR"
if npm run update --silent; then
    echo "Context updated successfully"

    # Stage updated documentation files
    git add "$COPILOT_DIR/docs/" 2>/dev/null || true
    git add "$COPILOT_DIR/cache/" 2>/dev/null || true
else
    echo "Warning: Context update failed, but allowing commit to proceed"
fi

exit 0
EOF

chmod +x "$HOOKS_DIR/pre-commit"
echo "✓ pre-commit hook installed"

# Create post-merge hook
echo "Creating post-merge hook..."
cat > "$HOOKS_DIR/post-merge" << 'EOF'
#!/bin/bash

# Post-merge hook: Regenerate docs after merge

set -e

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
COPILOT_DIR="$PROJECT_ROOT/.copilot"

echo "Running post-merge hook: Regenerating documentation..."

if [ ! -d "$COPILOT_DIR" ]; then
    echo "Warning: .copilot directory not found, skipping doc regeneration"
    exit 0
fi

# Run update command
cd "$COPILOT_DIR"
if npm run update --silent; then
    echo "Documentation regenerated successfully"
else
    echo "Warning: Documentation regeneration failed"
    exit 1
fi

exit 0
EOF

chmod +x "$HOOKS_DIR/post-merge"
echo "✓ post-merge hook installed"

echo ""
echo "Git hooks setup complete!"
echo "Installed hooks:"
echo "  - pre-commit: Updates context for staged files"
echo "  - post-merge: Regenerates docs after merge"
