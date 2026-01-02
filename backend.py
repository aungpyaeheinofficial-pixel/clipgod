"""
FastAPI Backend Server for OpusClone
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
import asyncio
try:
    from opus_clone_eng import OpusCloneEngine
except ImportError as e:
    # Allow server to start even if processing engine dependencies aren't installed
    print(f"Warning: opus_clone_eng import failed: {e}")
    print("Server will start but video processing will fail until dependencies are installed.")
    OpusCloneEngine = None
import os
from typing import Optional

app = FastAPI(title="OpusClone API")

# CORS middleware for frontend - allow all localhost origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    url: str
    api_key: str

class ProcessResponse(BaseModel):
    success: bool
    message: str
    step: Optional[int] = None
    progress: Optional[int] = None

# Store processing status
processing_status = {
    "is_processing": False,
    "current_step": 0,
    "progress": 0,
    "message": ""
}

@app.get("/")
async def root():
    return {"message": "OpusClone API Server", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/process", response_model=ProcessResponse)
async def process_video(request: ProcessRequest):
    global processing_status
    
    if processing_status["is_processing"]:
        raise HTTPException(status_code=400, detail="Already processing a video")
    
    if not request.url or not request.api_key:
        raise HTTPException(status_code=400, detail="URL and API key are required")
    
    processing_status["is_processing"] = True
    processing_status["current_step"] = 0
    processing_status["progress"] = 0
    
    def progress_callback(step: int, message: str):
        processing_status["current_step"] = step
        processing_status["message"] = message
        processing_status["progress"] = int((step / 6) * 100)
    
    try:
        if OpusCloneEngine is None:
            raise HTTPException(
                status_code=503, 
                detail="Processing engine not available. Please install all dependencies: pip3 install -r requirements.txt"
            )
        # Run processing in background
        engine = OpusCloneEngine(request.api_key)
        result = await asyncio.to_thread(engine.process, request.url, progress_callback)
        
        processing_status["is_processing"] = False
        
        if result["success"]:
            return ProcessResponse(
                success=True,
                message="Video processed successfully",
                step=6,
                progress=100
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Processing failed"))
            
    except Exception as e:
        processing_status["is_processing"] = False
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def get_status():
    return {
        "is_processing": processing_status["is_processing"],
        "current_step": processing_status["current_step"],
        "progress": processing_status["progress"],
        "message": processing_status["message"]
    }

@app.get("/api/download")
async def download_video():
    output_path = "final_viral_short.mp4"
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(
        output_path,
        media_type="video/mp4",
        filename="final_viral_short.mp4"
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

