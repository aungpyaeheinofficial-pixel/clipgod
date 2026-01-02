
import React, { useState, useEffect } from 'react';
import { AppView, ProcessingStep } from './types';
import Dashboard from './components/Dashboard';
import CodeViewer from './components/CodeViewer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Docs from './components/Docs';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [apiKey, setApiKey] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load API key from environment variable or local storage
  useEffect(() => {
    // First check environment variable (from .env.local)
    const envKey = import.meta.env.VITE_GROQ_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      localStorage.setItem('GROQ_API_KEY', envKey);
      return;
    }
    // Otherwise check localStorage
    const savedKey = localStorage.getItem('GROQ_API_KEY');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('GROQ_API_KEY', key);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0B]">
      {/* Navigation Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          apiKey={apiKey} 
          onSaveKey={handleSaveKey} 
          isProcessing={isProcessing}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {currentView === AppView.DASHBOARD && (
            <Dashboard 
              isProcessing={isProcessing} 
              setIsProcessing={setIsProcessing}
              apiKey={apiKey}
            />
          )}
          {currentView === AppView.CODE && (
            <CodeViewer />
          )}
          {currentView === AppView.DOCS && (
            <Docs />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
