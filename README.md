<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OpusClone AI Studio - Viral Shorts Generator

Automatically create viral YouTube Shorts from long-form videos using AI-powered face tracking, transcription, and caption generation.

## Features

- 🎬 **Automatic Video Processing** - Download, transcribe, and analyze YouTube videos
- 🤖 **AI-Powered Analysis** - Uses Groq Llama-3 70B to find the most viral 60-second segment
- 👁️ **Smart Face Tracking** - MediaPipe face detection with smooth reframing to 9:16 format
- ✍️ **Auto Captions** - Hormozi-style yellow captions synced to audio
- ⚡ **Fast Processing** - Groq API for high-speed AI inference

## Prerequisites

### Frontend
- Node.js 18+ and npm

### Backend
- Python 3.10+
- FFmpeg installed on your system
- Groq API Key ([Get one here](https://console.groq.com/))

## Installation & Setup

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 2. Backend Setup

```bash
# Option 1: Use the startup script (recommended)
./start_backend.sh

# Option 2: Manual setup
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 backend.py
```

Backend will run on `http://localhost:8000`

### 3. Font File

You need a font file named `font.ttf` in the project root for caption generation. Download a bold sans-serif font (e.g., Montserrat Bold, TheBoldFont) and place it as `font.ttf`.

## Usage

1. **Start Backend Server**: Run `./start_backend.sh` or `python3 backend.py`
2. **Start Frontend**: Run `npm run dev`
3. **Set API Key**: Enter your Groq API Key in the header
4. **Paste YouTube URL**: Enter a YouTube video URL
5. **Generate Short**: Click "Generate Short" and wait for processing
6. **Download**: The processed video will be saved as `final_viral_short.mp4` in the backend directory

## Project Structure

```
clip-god/
├── backend.py              # FastAPI backend server
├── opus_clone_eng.py       # Core processing engine
├── requirements.txt        # Python dependencies
├── start_backend.sh        # Backend startup script
├── components/             # React components
│   ├── Dashboard.tsx      # Main processing interface
│   ├── Header.tsx          # API key management
│   ├── Sidebar.tsx         # Navigation
│   ├── CodeViewer.tsx      # Source code viewer
│   └── Docs.tsx            # Documentation
├── App.tsx                 # Main app component
└── package.json           # Node.js dependencies
```

## API Endpoints

- `POST /api/process` - Start video processing
- `GET /api/status` - Get processing status
- `GET /api/download` - Download processed video
- `GET /health` - Health check

## Processing Workflow

1. **Acquisition** - Downloads 1080p MP4 using yt-dlp
2. **Transcription** - Groq Whisper-Large-V3 for word-level timestamps
3. **Viral Analysis** - Llama-3 70B finds the best 60-second segment
4. **Face Tracking** - MediaPipe tracks faces and reframes to 9:16
5. **Captioning** - Pillow generates Hormozi-style captions
6. **Final Rendering** - MoviePy/FFmpeg assembles the final video

## Troubleshooting

- **Font not found**: Make sure `font.ttf` exists in the project root
- **FFmpeg errors**: Install FFmpeg: `sudo apt install ffmpeg` (Linux) or `brew install ffmpeg` (Mac)
- **API connection failed**: Ensure backend is running on port 8000
- **Processing fails**: Check your Groq API key is valid and has credits

## License

MIT License
