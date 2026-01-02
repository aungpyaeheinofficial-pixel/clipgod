
import React, { useState } from 'react';
import { OPUS_CLONE_PYTHON_SCRIPT } from '../constants';

const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OPUS_CLONE_PYTHON_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Source Code</h1>
          <p className="text-gray-400">The core logic engine of <code>opus_clone_eng.py</code></p>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all"
        >
          <i className={`fa-solid ${copied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
          <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
        </button>
      </div>

      <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center px-6 py-3 bg-white/5 border-b border-white/5 justify-between">
           <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                <span className="text-xs text-gray-500 ml-4 font-mono uppercase">python · opus_clone_eng.py</span>
           </div>
           <span className="text-[10px] text-gray-600 font-mono tracking-widest">v1.2.4-STABLE</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-300 leading-relaxed">
            <code className="block">
              {OPUS_CLONE_PYTHON_SCRIPT}
            </code>
          </pre>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
            <i className="fa-solid fa-microchip text-yellow-400 mb-4 text-xl"></i>
            <h4 className="font-bold mb-2">Groq Llama-3 Engine</h4>
            <p className="text-xs text-gray-500">Uses 70B parameter model to scan transcripts for viral hook potential using high-velocity reasoning.</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
            <i className="fa-solid fa-eye text-yellow-400 mb-4 text-xl"></i>
            <h4 className="font-bold mb-2">MediaPipe Reframe</h4>
            <p className="text-xs text-gray-500">Real-time face tracking with a moving average smoothing filter to prevent jitter in 9:16 portrait mode.</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
            <i className="fa-solid fa-font text-yellow-400 mb-4 text-xl"></i>
            <h4 className="font-bold mb-2">Hormozi Captions</h4>
            <p className="text-xs text-gray-500">Custom Pillow rendering engine generates high-impact yellow stroke text synced to Whisper word timestamps.</p>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
