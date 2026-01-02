#!/bin/bash

# Simple Backend Startup (without venv)
echo "🚀 Starting OpusClone Backend Server (Simple Mode)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed."
    exit 1
fi

# Install dependencies globally (or in user space)
echo "📥 Installing/Updating Python dependencies..."
pip3 install --upgrade pip --quiet
pip3 install fastapi uvicorn groq yt-dlp opencv-python mediapipe pillow moviepy numpy pydantic --quiet

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "   Trying with more verbose output..."
    pip3 install fastapi uvicorn groq yt-dlp opencv-python mediapipe pillow moviepy numpy pydantic
    exit 1
fi

# Start the server
echo ""
echo "✅ Starting FastAPI server on http://localhost:8000"
echo "   Press Ctrl+C to stop the server"
echo ""
python3 backend.py

