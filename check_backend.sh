#!/bin/bash
echo "🔍 Checking backend server status..."
echo ""

# Check if port 8000 is in use
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "✅ Port 8000 is in use (backend might be running)"
    echo ""
    echo "Testing connection..."
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend is responding!"
        curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || echo '{"status":"healthy"}'
    else
        echo "❌ Port 8000 is in use but backend is not responding"
        echo "   Something else might be using the port"
    fi
else
    echo "❌ Backend server is NOT running"
    echo ""
    echo "To start it, run:"
    echo "  ./start_backend.sh"
    echo "  or"
    echo "  ./start_backend_simple.sh"
fi
