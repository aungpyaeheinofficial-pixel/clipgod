import os
import sys
import json
import time
import yt_dlp
import cv2
import numpy as np
import mediapipe as mp
from groq import Groq
from PIL import Image, ImageDraw, ImageFont
from moviepy.editor import VideoFileClip, AudioFileClip, ImageSequenceClip, CompositeVideoClip, ColorClip

# --- CONFIGURATION & SETUP ---
class OpusCloneEngine:
    def __init__(self, groq_api_key):
        self.client = Groq(api_key=groq_api_key)
        self.temp_dir = "temp_processing"
        os.makedirs(self.temp_dir, exist_ok=True)
        
        # Verify font (optional for now - will fail at caption generation if missing)
        self.font_path = "font.ttf"
        if not os.path.exists(self.font_path):
            print("Warning: font.ttf not found. Caption generation will be skipped.")
            self.font_path = None
            
        # Mediapipe Face Detection
        self.mp_face_detection = mp.solutions.face_detection
        self.face_detection = self.mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)

    def download_video(self, url):
        print("🚀 Downloading video from YouTube...")
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'outtmpl': os.path.join(self.temp_dir, 'source_video.%(ext)s'),
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            return ydl.prepare_filename(info)

    def transcribe_video(self, video_path):
        print("🎙️ Transcribing with Groq Whisper...")
        # Extract audio first
        audio_path = os.path.join(self.temp_dir, "audio.mp3")
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path, verbose=False, logger=None)
        
        with open(audio_path, "rb") as file:
            transcription = self.client.audio.transcriptions.create(
                file=(audio_path, file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
            )
        return transcription

    def get_viral_segment(self, transcript_data):
        print("🧠 Analyzing virality with Llama 3...")
        # Simplify transcript for LLM
        text_content = " ".join([s['text'] for s in transcript_data.segments])
        
        system_prompt = "You are a master video editor. Analyze this transcript. Find the single most engaging, funny, or high-retention 60-second segment."
        user_prompt = f"Transcript:\n{text_content}\n\nReturn ONLY a JSON object: {{\"start\": float, \"end\": float, \"reason\": string}}"
        
        completion = self.client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)

    def smart_face_crop(self, video_clip, start_time, end_time):
        print("👀 Tracking faces and reframing...")
        sub_clip = video_clip.subclip(start_time, end_time)
        w, h = sub_clip.size
        target_ratio = 9/16
        target_w = int(h * target_ratio)
        
        # Smooth tracking
        history_x = []
        smoothing_window = 15
        
        def process_frame(get_frame, t):
            frame = get_frame(t)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_detection.process(frame_rgb)
            
            # Default center
            center_x = w / 2
            
            if results.detections:
                # Use the first face found
                bbox = results.detections[0].location_data.relative_bounding_box
                face_center_x = (bbox.xmin + bbox.width / 2) * w
                center_x = face_center_x
            
            history_x.append(center_x)
            if len(history_x) > smoothing_window:
                history_x.pop(0)
                
            smoothed_x = sum(history_x) / len(history_x)
            
            # Clamp crop window
            left = max(0, min(w - target_w, int(smoothed_x - target_w / 2)))
            right = left + target_w
            
            cropped_frame = frame[:, left:right]
            return cv2.resize(cropped_frame, (1080, 1920))

        return sub_clip.fl(process_frame)

    def generate_captions(self, transcription, start_time, end_time):
        print("✍️ Generating viral captions...")
        # Filtering segments within the window
        relevant_words = []
        for segment in transcription.segments:
            if segment['start'] >= start_time and segment['end'] <= end_time:
                # Assuming word-level timestamps are in the segment or need parsing
                # In a real scenario, we'd use the 'words' list if provided by Whisper
                # Here we simulate word-level splitting for the logic
                words = segment['text'].split()
                duration = segment['end'] - segment['start']
                word_dur = duration / len(words)
                for i, word in enumerate(words):
                    relevant_words.append({
                        'text': word.upper(),
                        'start': segment['start'] + (i * word_dur) - start_time,
                        'end': segment['start'] + ((i + 1) * word_dur) - start_time
                    })

        clips = []
        font_size = 80
        font = ImageFont.truetype(self.font_path, font_size)
        
        # Group words in chunks of 2-3
        chunk_size = 2
        for i in range(0, len(relevant_words), chunk_size):
            chunk = relevant_words[i:i+chunk_size]
            text = " ".join([w['text'] for w in chunk])
            start = chunk[0]['start']
            end = chunk[-1]['end']
            
            # Create PIL image
            img = Image.new('RGBA', (1080, 1920), (0,0,0,0))
            draw = ImageDraw.Draw(img)
            
            # Draw stroke and text
            stroke_width = 4
            text_x, text_y = 540, 1500 # Position bottom-center
            
            # Bounding box for centering
            bbox = draw.textbbox((0, 0), text, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            pos = (text_x - tw/2, text_y - th/2)
            
            draw.text(pos, text, font=font, fill="#FFD700", stroke_width=stroke_width, stroke_fill="black")
            
            # Convert to MoviePy clip
            img_np = np.array(img)
            text_clip = ImageSequenceClip([img_np], fps=30).set_start(start).set_duration(end - start)
            clips.append(text_clip)
            
        return clips

    def process(self, url, progress_callback=None):
        try:
            if progress_callback:
                progress_callback(1, "Downloading video...")
            video_path = self.download_video(url)
            
            if progress_callback:
                progress_callback(2, "Transcribing audio...")
            transcript = self.transcribe_video(video_path)
            
            if progress_callback:
                progress_callback(3, "Analyzing viral segment...")
            viral_meta = self.get_viral_segment(transcript)
            
            print(f"🎯 Chosen Segment: {viral_meta['start']}s to {viral_meta['end']}s")
            print(f"💡 Reason: {viral_meta['reason']}")
            
            if progress_callback:
                progress_callback(4, "Tracking faces and reframing...")
            source_clip = VideoFileClip(video_path)
            reframed_clip = self.smart_face_crop(source_clip, viral_meta['start'], viral_meta['end'])
            
            if progress_callback:
                progress_callback(5, "Generating captions...")
            caption_clips = self.generate_captions(transcript, viral_meta['start'], viral_meta['end'])
            
            if progress_callback:
                progress_callback(6, "Rendering final video...")
            final_video = CompositeVideoClip([reframed_clip] + caption_clips)
            output_path = "final_viral_short.mp4"
            final_video.write_videofile(output_path, fps=30, codec="libx264", audio_codec="aac")
            
            print("✅ Done! Output saved to final_viral_short.mp4")
            return {
                "success": True,
                "output_path": output_path,
                "segment": viral_meta
            }
            
        except Exception as e:
            print(f"❌ Error occurred: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            # Cleanup
            import shutil
            shutil.rmtree(self.temp_dir, ignore_errors=True)

if __name__ == "__main__":
    url = input("YouTube URL: ")
    key = input("Groq API Key: ")
    engine = OpusCloneEngine(key)
    engine.process(url)

