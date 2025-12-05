export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageData: string; // Base64
  description: string;
}

export enum AppView {
  API_SETUP = 'API_SETUP',
  CAMERA = 'CAMERA',
  HISTORY = 'HISTORY',
}

export interface AnalysisResponse {
  text: string;
}