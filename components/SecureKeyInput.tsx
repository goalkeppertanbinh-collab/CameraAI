import React, { useState } from 'react';

interface SecureKeyInputProps {
  onKeySubmit: (key: string) => void;
}

const SecureKeyInput: React.FC<SecureKeyInputProps> = ({ onKeySubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      onKeySubmit(inputValue.trim());
      setInputValue(''); // Clear local state immediately for security
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Setup API Access</h2>
        <p className="text-zinc-400 mb-6 text-sm">
          Please enter your Gemini API Key to continue. 
          <br />
          <span className="text-xs text-yellow-600">
            For security, the key is hidden and cannot be viewed again once set.
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="••••••••••••••••••••••"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-zinc-600 text-center tracking-widest"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputValue}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Authenticate & Start
          </button>
        </form>
        
        <div className="mt-6 text-xs text-zinc-500">
          Your key is stored in temporary browser memory and is never sent to our servers.
        </div>
      </div>
    </div>
  );
};

export default SecureKeyInput;