# 🚀 Quick Start Guide

## Step 1: Start Backend Server

Open a **new terminal window** and run:

```bash
cd /Users/aungpyaehein/Downloads/clip-god
./start_backend.sh
```

**OR** if that doesn't work, try the simple version:

```bash
./start_backend_simple.sh
```

Wait until you see:
```
✅ Starting FastAPI server on http://localhost:8000
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!** The backend must keep running.

## Step 2: Start Frontend

Open **another terminal window** and run:

```bash
cd /Users/aungpyaehein/Downloads/clip-god
npm run dev
```

Wait until you see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Step 3: Open Browser

Open your browser and go to: **http://localhost:3000**

## Step 4: Verify Backend Connection

1. Open browser console (F12 → Console tab)
2. You should see: `✅ Backend server is running`
3. If you see warnings, the backend isn't running - go back to Step 1

## Step 5: Use the App

1. The API key is already configured in `.env.local`
2. Enter a YouTube URL
3. Click "Generate Short"
4. Watch the processing steps!

## Troubleshooting

### "Cannot connect to backend server"
- Make sure backend is running (Step 1)
- Check terminal for errors
- Try: `curl http://localhost:8000/health` - should return `{"status":"healthy"}`

### "Port 8000 already in use"
```bash
# Find what's using the port
lsof -ti:8000

# Kill it (replace PID)
kill -9 PID
```

### Dependencies not installing
```bash
# Try manual install
pip3 install fastapi uvicorn
python3 backend.py
```

## Need Help?

Check `README_BACKEND.md` for detailed backend setup instructions.

