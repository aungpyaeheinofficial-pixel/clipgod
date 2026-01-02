#!/bin/bash

# Test Backend Connection Script
echo "🔍 Testing backend connection..."

API_URL="http://localhost:8000"

# Test health endpoint
echo "Testing /health endpoint..."
if curl -s -f "${API_URL}/health" > /dev/null; then
    echo "✅ Backend is running and healthy!"
    curl -s "${API_URL}/health" | python3 -m json.tool
else
    echo "❌ Backend is not responding at ${API_URL}"
    echo ""
    echo "Please start the backend server with:"
    echo "  ./start_backend.sh"
    echo "  or"
    echo "  python3 backend.py"
    exit 1
fi

echo ""
echo "Testing /api/status endpoint..."
curl -s "${API_URL}/api/status" | python3 -m json.tool

