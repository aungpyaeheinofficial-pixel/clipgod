
import React, { useState } from 'react';

interface HeaderProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
  isProcessing: boolean;
}

const Header: React.FC<HeaderProps> = ({ apiKey, onSaveKey, isProcessing }) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [inputValue, setInputValue] = useState(apiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputValue);
    setShowKeyInput(false);
  };

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="md:hidden w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
            <i className="fa-solid fa-bolt text-black"></i>
        </div>
        <h2 className="text-gray-400 text-sm font-medium hidden md:block">
            Project / <span className="text-white">ViralShort_Gen_01</span>
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {showKeyInput ? (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <input
              type="password"
              placeholder="Enter Groq API Key..."
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors w-64"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-sm font-bold">
              Save
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setShowKeyInput(true)}
            className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{apiKey ? 'Groq Key Active' : 'Set Groq API Key'}</span>
            <i className="fa-solid fa-key ml-1 opacity-50"></i>
          </button>
        )}

        <div className="h-8 w-[1px] bg-white/10"></div>
        
        <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                SA
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
