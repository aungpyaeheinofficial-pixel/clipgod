
import React from 'react';

const Docs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-gray-400 mb-8 text-lg">Detailed setup and technical requirements for running the OpusClone backend.</p>

      <section className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center space-x-3">
            <span className="bg-yellow-400 text-black w-8 h-8 rounded flex items-center justify-center text-sm">1</span>
            <span>Prerequisites</span>
          </h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <p className="text-gray-300">You must have FFmpeg and Python 3.10+ installed on your system.</p>
            <div className="bg-black/50 p-4 rounded-xl font-mono text-sm text-yellow-400">
              $ sudo apt update && sudo apt install ffmpeg python3-pip
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center space-x-3">
            <span className="bg-yellow-400 text-black w-8 h-8 rounded flex items-center justify-center text-sm">2</span>
            <span>Python Environment</span>
          </h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <p className="text-gray-300">Install the following core dependencies for processing:</p>
            <div className="bg-black/50 p-4 rounded-xl font-mono text-sm text-yellow-400">
              pip install groq yt-dlp opencv-python mediapipe pillow moviepy numpy
            </div>
          </div>
        </div>

        <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-3">
                <span className="bg-yellow-400 text-black w-8 h-8 rounded flex items-center justify-center text-sm">3</span>
                <span>Asset Requirements</span>
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                        <i className="fa-solid fa-check text-green-500 mt-1"></i>
                        <div>
                            <p className="font-bold">font.ttf</p>
                            <p className="text-sm text-gray-500">The script requires a font file named 'font.ttf' in the root directory for rendering captions. Recommended: Bold Sans-Serif fonts like 'TheBoldFont' or 'Montserrat'.</p>
                        </div>
                    </li>
                    <li className="flex items-start space-x-3">
                        <i className="fa-solid fa-check text-green-500 mt-1"></i>
                        <div>
                            <p className="font-bold">Groq API Key</p>
                            <p className="text-sm text-gray-500">Obtain a key from the Groq Cloud Dashboard. This provides the 800+ tokens/sec inference needed for fast analysis.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-yellow-400/20 to-transparent border border-yellow-400/20 rounded-3xl text-center">
            <h4 className="text-2xl font-bold text-yellow-400 mb-2">Need Help?</h4>
            <p className="text-gray-400 mb-6">Our senior engineers are available for custom deployments and enterprise API integration.</p>
            <button className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition-transform">
                Contact Engineering
            </button>
        </div>
      </section>
    </div>
  );
};

export default Docs;
