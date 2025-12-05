import React, { useState } from 'react';
import SecureKeyInput from './components/SecureKeyInput';
import CameraCapture from './components/CameraCapture';
import HistoryView from './components/HistoryView';
import { AnalysisResult, AppView } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.API_SETUP);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // Callback when API key is submitted securely
  const handleKeySubmit = (key: string) => {
    setApiKey(key);
    setCurrentView(AppView.CAMERA);
  };

  // Callback when a new analysis is complete
  const handleAnalysisComplete = (result: AnalysisResult) => {
    setHistory(prev => [result, ...prev]);
    // Optional: Switch to history view automatically or show a toast
    // For now, we stay on camera to allow rapid logging, but you can toggle this.
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all local logs? This cannot be undone.")) {
      setHistory([]);
    }
  };

  // If key is not present, force the Secure Input view
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
        <header className="p-6 border-b border-zinc-900 flex justify-between items-center">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Gemini Vision Logger
            </h1>
        </header>
        <SecureKeyInput onKeySubmit={handleKeySubmit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-500/30">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
           <h1 className="text-lg font-bold tracking-tight">Vision Logger</h1>
        </div>
        
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setCurrentView(AppView.CAMERA)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currentView === AppView.CAMERA 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setCurrentView(AppView.HISTORY)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currentView === AppView.HISTORY
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Logs <span className="ml-1 text-[10px] bg-zinc-950 px-1.5 py-0.5 rounded-full border border-zinc-800">{history.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-hidden flex flex-col">
        {currentView === AppView.CAMERA ? (
          <CameraCapture apiKey={apiKey} onAnalysisComplete={handleAnalysisComplete} />
        ) : (
          <HistoryView history={history} onClear={handleClearHistory} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="p-4 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        <p>Powered by Gemini 2.5 Flash Image. Data stored locally in browser session.</p>
      </footer>
    </div>
  );
}

export default App;