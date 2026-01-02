# Backend Server Setup Guide

## Quick Start

### Option 1: Using Virtual Environment (Recommended)
```bash
./start_backend.sh
```

### Option 2: Simple Mode (No Virtual Environment)
```bash
./start_backend_simple.sh
```

### Option 3: Manual Start
```bash
# Install dependencies
pip3 install -r requirements.txt

# Start server
python3 backend.py
```

## Verify Backend is Running

After starting the backend, test it:
```bash
./test_backend.sh
```

Or manually:
```bash
curl http://localhost:8000/health
```

You should see: `{"status":"healthy"}`

## Troubleshooting

### Port 8000 Already in Use
```bash
# Find what's using port 8000
lsof -ti:8000

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Dependencies Installation Fails
- Make sure you have Python 3.10+ installed
- Try: `pip3 install --upgrade pip`
- Install system dependencies:
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg python3-pip`

### Backend Starts but Frontend Can't Connect
1. Check CORS settings in `backend.py`
2. Make sure frontend is using correct URL: `http://localhost:8000`
3. Check browser console for detailed errors

## Backend Endpoints

- `GET /` - Server info
- `GET /health` - Health check
- `POST /api/process` - Start video processing
- `GET /api/status` - Get processing status
- `GET /api/download` - Download processed video

