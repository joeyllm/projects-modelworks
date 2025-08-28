#!/bin/bash

echo "🏥 Clinical Coding Assistant - Status Check"
echo "=========================================="

# Check if we're in the correct directory
echo "📍 Current Directory: $(pwd)"
if [[ $(pwd) == *"clinical-coding-portal"* ]]; then
    echo "✅ Correct directory: clinical-coding-portal"
else
    echo "❌ Wrong directory. Please navigate to clinical-coding-portal"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not found. Run: npm install"
    exit 1
fi

# Check if src directory has all files
echo "📁 Checking source files..."
required_files=("src/index.js" "src/App.js" "src/DemoMenu.jsx" "src/ClinicalCodingDemo.jsx" "src/index.css")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# Check if server is running
echo "🌐 Checking server status..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server is running on http://localhost:3000"
    echo ""
    echo "🎉 SUCCESS! Your Clinical Coding Assistant is ready!"
    echo "🌐 Open your browser and go to: http://localhost:3000"
    echo ""
    echo "📋 What you'll see:"
    echo "   • Southern Cross Portal with 6 demo applications"
    echo "   • Click 'Clinical Coding Assistant' to enter the app"
    echo "   • Navigate between 5 screens using tab navigation"
    echo "   • Use 'Back to Menu' to return to the portal"
else
    echo "❌ Server not responding on port 3000"
    echo "💡 Try running: npm start"
fi

echo ""
echo "🔧 If you need to restart the server:"
echo "   1. Press Ctrl+C to stop"
echo "   2. Run: npm start"
echo ""
echo "📚 For more information, see: README.md"
