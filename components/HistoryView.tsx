import React from 'react';
import { AnalysisResult } from '../types';

interface HistoryViewProps {
  history: AnalysisResult[];
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClear }) => {
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `gemini_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadCSV = () => {
    const headers = ["ID", "Timestamp", "Description"];
    const rows = history.map(item => [
      item.id,
      item.timestamp,
      // Escape quotes for CSV
      `"${item.description.replace(/"/g, '""')}"` 
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gemini_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>No logs available yet.</p>
        <p className="text-xs mt-1">Capture an image to start logging.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Local Logs ({history.length})</h2>
        <div className="flex gap-2">
           <button 
            onClick={downloadCSV}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-md border border-zinc-700 transition-colors text-white"
          >
            Export CSV
          </button>
          <button 
            onClick={downloadJSON}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-md border border-zinc-700 transition-colors text-white"
          >
            Export JSON
          </button>
          <button 
            onClick={onClear}
            className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-medium rounded-md border border-red-900/50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-auto space-y-4 pb-4 pr-2">
        {history.map((item) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 shadow-sm hover:border-zinc-700 transition-colors">
            <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-zinc-950 rounded-md overflow-hidden border border-zinc-800">
              <img src={item.imageData} alt="Analysis Capture" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-zinc-500 font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                <span className="text-[10px] text-zinc-600 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">ID: {item.id.slice(0, 8)}</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;