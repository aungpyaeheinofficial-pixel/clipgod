
import React, { useState, useEffect } from 'react';
import { ProcessingStep } from '../types';

interface DashboardProps {
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  apiKey: string;
}

const Dashboard: React.FC<DashboardProps> = ({ isProcessing, setIsProcessing, apiKey }) => {
  const [url, setUrl] = useState('');
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: '1', name: 'Acquisition', description: 'Downloading 1080p MP4 with yt-dlp', status: 'pending', progress: 0 },
    { id: '2', name: 'Transcription', description: 'Groq Whisper-Large-V3 word timestamps', status: 'pending', progress: 0 },
    { id: '3', name: 'Viral Analysis', description: 'Llama-3 70B high-retention selection', status: 'pending', progress: 0 },
    { id: '4', name: 'Face Tracking', description: 'MediaPipe Dynamic 9:16 reframe', status: 'pending', progress: 0 },
    { id: '5', name: 'Captioning', description: 'Pillow Hormozi-style overlays', status: 'pending', progress: 0 },
    { id: '6', name: 'Final Rendering', description: 'Assembly via MoviePy/FFmpeg', status: 'pending', progress: 0 },
  ]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Check if backend is running on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn('Backend server is not responding correctly');
        } else {
          console.log('✅ Backend server is running');
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn('Backend health check timed out');
        } else {
          console.warn('Backend server is not running. Please start it with: ./start_backend.sh or ./start_backend_simple.sh');
        }
      }
    };
    checkBackend();
  }, [API_BASE_URL]);

  const startProcessing = async () => {
    if (!url) return alert('Please enter a YouTube URL');
    if (!apiKey) return alert('Please set your Groq API Key in the header first');
    
    setIsProcessing(true);
    
    // Reset all steps
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending', progress: 0 })));
    
    try {
      // Check backend health first with timeout
      console.log(`🔍 Checking backend at: ${API_BASE_URL}/health`);
      console.log(`📍 Current URL: ${window.location.href}`);
      console.log(`🌐 API Base URL: ${API_BASE_URL}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout (increased)
        
        console.log('⏳ Sending health check request...');
        const healthCheck = await fetch(`${API_BASE_URL}/health`, {
          signal: controller.signal,
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        clearTimeout(timeoutId);
        
        console.log(`✅ Health check response: ${healthCheck.status} ${healthCheck.statusText}`);
        console.log(`📋 Response headers:`, Object.fromEntries(healthCheck.headers.entries()));
        
        if (!healthCheck.ok) {
          const errorText = await healthCheck.text();
          console.error('❌ Backend health check failed:', errorText);
          throw new Error(`Backend server responded with error: ${healthCheck.status}. Please check the backend logs.`);
        }
        
        const healthData = await healthCheck.json();
        console.log('✅ Backend is healthy:', healthData);
      } catch (error: any) {
        console.error('❌ Backend connection error:', error);
        console.error('❌ Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        if (error.name === 'AbortError') {
          throw new Error(`Backend server connection timeout after 10 seconds.\n\nTrying to connect to: ${API_BASE_URL}\n\nPlease check:\n1. Backend is running: lsof -ti:8000\n2. Test manually: curl ${API_BASE_URL}/health\n3. Check browser console for CORS errors\n4. Try opening: http://localhost:8000/health in browser`);
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch') || error.name === 'TypeError') {
          const detailedError = `Cannot connect to backend server at ${API_BASE_URL}\n\nDiagnostics:\n- Frontend URL: ${window.location.href}\n- Backend URL: ${API_BASE_URL}\n- Error: ${error.message}\n\nQuick fixes:\n1. Open http://localhost:8000/health in a new browser tab\n2. If that works, the issue is CORS/browser related\n3. If that fails, backend is not running\n\nTo start backend:\n1. Open terminal\n2. cd /Users/aungpyaehein/Downloads/clip-god\n3. ./start_backend.sh\n4. Wait for "Uvicorn running" message`;
          throw new Error(detailedError);
        }
        throw error;
      }

      // Start processing
      const processResponse = await fetch(`${API_BASE_URL}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          api_key: apiKey
        })
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `Server error: ${processResponse.status}`);
      }

      // Poll for status updates
      let pollAttempts = 0;
      const maxPollAttempts = 300; // 5 minutes max (300 * 1 second)
      
      const statusInterval = setInterval(async () => {
        try {
          pollAttempts++;
          if (pollAttempts > maxPollAttempts) {
            clearInterval(statusInterval);
            setIsProcessing(false);
            alert('Processing timeout. Please check the backend server logs.');
            return;
          }

          const statusResponse = await fetch(`${API_BASE_URL}/api/status`);
          if (!statusResponse.ok) {
            throw new Error(`Status check failed: ${statusResponse.status}`);
          }
          
          const status = await statusResponse.json();
          
          if (status.is_processing) {
            // Update current step
            const currentStepIndex = status.current_step - 1;
            setSteps(prev => {
              const next = [...prev];
              // Mark previous steps as completed
              for (let i = 0; i < currentStepIndex; i++) {
                if (next[i]) {
                  next[i].status = 'completed';
                  next[i].progress = 100;
                }
              }
              // Update current step
              if (currentStepIndex >= 0 && next[currentStepIndex]) {
                next[currentStepIndex].status = 'processing';
                next[currentStepIndex].progress = status.progress;
              }
              return next;
            });
          } else {
            // Processing complete
            clearInterval(statusInterval);
            setSteps(prev => prev.map(step => ({ ...step, status: 'completed', progress: 100 })));
            setIsProcessing(false);
            alert('Video processed successfully! Check the backend server for the output file.');
          }
        } catch (error) {
          console.error('Status check error:', error);
          // Don't stop polling on network errors, but log them
        }
      }, 1000); // Poll every second

    } catch (error: any) {
      console.error('Processing error:', error);
      const errorMessage = error.message || 'An unknown error occurred';
      alert(`Error: ${errorMessage}\n\nMake sure:\n1. Backend server is running (./start_backend.sh)\n2. Backend is accessible at ${API_BASE_URL}\n3. Check browser console for details`);
      setIsProcessing(false);
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending', progress: 0 })));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Create Viral <span className="text-yellow-400">Shorts</span> in Seconds.
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Paste a long-form YouTube link and let our AI-driven engine track speakers, 
          add captions, and find the perfect viral hook.
        </p>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-3xl p-1 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full relative">
                <i className="fa-brands fa-youtube absolute left-6 top-1/2 -translate-y-1/2 text-red-500 text-xl"></i>
                <input 
                    type="text" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    className="w-full bg-transparent py-6 pl-14 pr-6 text-lg focus:outline-none placeholder:text-gray-600"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isProcessing}
                />
            </div>
            <button 
                onClick={startProcessing}
                disabled={isProcessing}
                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-3 ${
                    isProcessing 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                }`}
            >
                {isProcessing ? (
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                )}
                <span>{isProcessing ? 'Processing Engine...' : 'Generate Short'}</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <i className="fa-solid fa-list-check text-yellow-400"></i>
            <span>Automation Workflow</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  step.status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 
                  step.status === 'processing' ? 'bg-yellow-400/5 border-yellow-400/20 ring-1 ring-yellow-400/10' :
                  'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500 text-white' : 
                      step.status === 'processing' ? 'bg-yellow-400 text-black animate-pulse' :
                      'bg-white/10 text-gray-500'
                    }`}>
                      {step.status === 'completed' ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{step.name}</h4>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {step.status === 'processing' && (
                    <span className="text-xs font-mono text-yellow-400">{Math.round(step.progress)}%</span>
                  )}
                </div>
                {(step.status === 'processing' || step.status === 'completed') && (
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${step.status === 'completed' ? 'bg-green-500' : 'bg-yellow-400'}`}
                      style={{ width: `${step.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center space-x-2">
                <i className="fa-solid fa-video text-yellow-400"></i>
                <span>Live Preview</span>
            </h3>
            <div className="aspect-[9/16] bg-black border border-white/10 rounded-3xl overflow-hidden relative group">
                {!isProcessing && steps[0].status === 'pending' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <i className="fa-solid fa-play text-gray-600 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 text-sm">Enter a URL to see the AI auto-crop in action.</p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <img 
                            src={`https://picsum.photos/seed/${url ? 'video' : 'empty'}/1080/1920`} 
                            className="w-full h-full object-cover opacity-50 blur-[2px]" 
                            alt="Preview"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        
                        {/* Fake Captions */}
                        <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center animate-bounce">
                           <span className="bg-black/80 px-4 py-1 rounded-lg border-2 border-yellow-400 text-yellow-400 font-black text-2xl uppercase tracking-tighter">
                               VIRAL CONTENT
                           </span>
                           <span className="bg-black/80 px-4 py-1 rounded-lg border-2 border-yellow-400 text-yellow-400 font-black text-2xl uppercase tracking-tighter mt-1">
                               DETECTION...
                           </span>
                        </div>

                        {/* Tracking Box */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-yellow-400/50 rounded-2xl flex items-center justify-center">
                             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                             <span className="absolute -top-6 left-0 text-[10px] font-bold text-yellow-400 bg-black/50 px-2 py-0.5 rounded">FACE_LOCKED: 98%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
