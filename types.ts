export interface AnalysisResult {
  score: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  improvements: string[];
  formattingIssues: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

export enum View {
  INPUT = 'INPUT',
  RESULTS = 'RESULTS',
}

// Ensure the structure matches what we request from Gemini
export interface GeminiResponseSchema {
  score: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  improvements: string[];
  formattingIssues: string[];
}
