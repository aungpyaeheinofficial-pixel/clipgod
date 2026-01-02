#!/bin/bash

# Start Backend Server Script
echo "🚀 Starting OpusClone Backend Server..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip first
echo "⬆️  Upgrading pip..."
pip install --upgrade pip --quiet

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "   Trying without --quiet flag for more details..."
    pip install -r requirements.txt
    exit 1
fi

# Check if font.ttf exists (optional, just a warning)
if [ ! -f "font.ttf" ]; then
    echo "⚠️  Warning: font.ttf not found. Caption generation may fail."
    echo "   You can download a font file and name it 'font.ttf' in the project root."
    echo "   For now, the server will start but video processing may fail at caption step."
fi

# Start the server
echo ""
echo "✅ Starting FastAPI server on http://localhost:8000"
echo "   Press Ctrl+C to stop the server"
echo ""
python3 backend.py

