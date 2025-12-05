import React, { useRef, useEffect, useState, useCallback } from 'react';
import { analyzeImageWithGemini } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface CameraCaptureProps {
  apiKey: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ apiKey, onAnalysisComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Unable to access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setAnalyzing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get Base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const response = await analyzeImageWithGemini(apiKey, imageData);
        
        const result: AnalysisResult = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          imageData: imageData,
          description: response.text
        };

        onAnalysisComplete(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setAnalyzing(false);
      }
    }
  }, [apiKey, onAnalysisComplete]);

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      <div className="relative flex-grow bg-black rounded-2xl overflow-hidden shadow-xl border border-zinc-800">
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
            Initializing Camera...
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center z-20 bg-black/80">
            {error}
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay while analyzing */}
        {analyzing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-white font-medium animate-pulse">Analyzing with Gemini...</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={captureAndAnalyze}
          disabled={!isStreaming || analyzing}
          className="group relative flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          <div className="bg-black rounded-full p-1">
             <div className="h-16 w-16 bg-white rounded-full border-4 border-black group-hover:bg-zinc-200 transition-colors"></div>
          </div>
        </button>
      </div>
      <p className="text-center text-zinc-500 text-sm mt-3">Tap to capture & analyze</p>
    </div>
  );
};

export default CameraCapture;