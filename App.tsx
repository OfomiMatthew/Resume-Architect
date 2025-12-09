import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import InputForm from './components/InputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeResume } from './services/geminiService';
import { AnalysisResult, View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (resume: string, jobDesc: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(resume, jobDesc);
      setAnalysisResult(result);
      setCurrentView(View.RESULTS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentView(View.INPUT);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">ResumeArchitect</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                onClick={(e) => { e.preventDefault(); handleReset(); }}
              >
                New Analysis
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {error && (
          <div className="max-w-3xl mx-auto mt-6 w-full px-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <span className="font-medium mr-2">Error:</span> {error}
            </div>
          </div>
        )}

        {currentView === View.INPUT && (
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {currentView === View.RESULTS && analysisResult && (
          <AnalysisDashboard result={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Powered by Google Gemini 2.5 Flash. This is an AI assistant and does not guarantee job placement.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
