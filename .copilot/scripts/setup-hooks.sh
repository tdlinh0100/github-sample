#!/bin/bash

# Setup Git Hooks for Copilot Workflow
# NOTE: This script is DEPRECATED and no longer used
# Git hooks have been removed to give users full control

set -e

echo "⚠️  Git hooks are no longer automatically installed."
echo ""
echo "📌 Manual workflow is recommended:"
echo "   1. Make your code changes"
echo "   2. Run: npm run copilot:update (when you want to update context)"
echo "   3. Review: cat .copilot/docs/discovery.json"
echo "   4. Commit normally: git commit -m 'your message'"
echo ""
echo "💡 This gives you full control over when context is updated."
echo ""
echo "If you still want automatic hooks, you can manually create them."
echo "See documentation for examples."
