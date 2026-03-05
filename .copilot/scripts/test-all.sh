#!/bin/bash

# Test runner for discovery modules
# Run all tests with coverage

echo "Running Maven Discovery Tests..."
node --test --experimental-test-coverage discover-maven.test.js

echo ""
echo "Running Spring XML Discovery Tests..."
node --test --experimental-test-coverage discover-spring-xml.test.js

echo ""
echo "Running All Tests Together..."
node --test discover-maven.test.js discover-spring-xml.test.js

echo ""
echo "Test suite complete!"
