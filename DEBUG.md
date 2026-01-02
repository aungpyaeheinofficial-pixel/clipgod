# Debugging Backend Connection Issues

## Quick Checks

### 1. Is Backend Running?
```bash
# Check if port 8000 is in use
lsof -ti:8000

# Test health endpoint
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

### 2. Check Backend Logs
```bash
# View backend logs
tail -f backend.log

# Or if running in foreground, check terminal output
```

### 3. Check Frontend Console
1. Open browser (F12)
2. Go to Console tab
3. Look for:
   - `🔍 Checking backend at: http://localhost:8000/health`
   - `✅ Backend is healthy: {...}`
   - Or error messages

### 4. Test CORS
```bash
curl -v -X OPTIONS http://localhost:8000/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

Should see `access-control-allow-origin` header.

### 5. Check Environment Variables
```bash
# Frontend should use this URL
cat .env.local | grep VITE_API_URL

# Should be: VITE_API_URL=http://localhost:8000
```

### 6. Restart Everything
```bash
# Stop backend
kill -9 $(lsof -ti:8000)

# Start backend
./start_backend.sh

# In another terminal, restart frontend
npm run dev
```

## Common Issues

### Issue: "Failed to fetch"
**Cause:** Backend not running or wrong URL
**Fix:** 
1. Check backend is running: `lsof -ti:8000`
2. Test: `curl http://localhost:8000/health`
3. Restart backend if needed

### Issue: CORS Error
**Cause:** Backend CORS not configured correctly
**Fix:** Backend should have `allow_origins=["*"]` for development

### Issue: Timeout
**Cause:** Backend taking too long to respond
**Fix:** 
1. Check backend logs for errors
2. Make sure backend process is actually running
3. Check system resources

### Issue: Wrong Port
**Cause:** Frontend trying wrong URL
**Fix:** 
1. Check `.env.local` has correct `VITE_API_URL`
2. Restart frontend dev server after changing `.env.local`

## Manual Test

Test the full flow:
```bash
# 1. Start backend
./start_backend.sh

# 2. In another terminal, test API
curl -X POST http://localhost:8000/api/process \
  -H "Content-Type: application/json" \
  -d '{"url":"test","api_key":"test"}'

# Should get response (even if error about missing dependencies)
```

