import React from 'react';
import { AnalysisResult } from '../types';
import ScoreChart from './ScoreChart';
import { CheckCircle, XCircle, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={onReset}
        className="mb-6 flex items-center text-slate-600 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Analyze Another
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center lg:col-span-1">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">ATS Match Score</h2>
          <ScoreChart score={result.score} />
          <p className="text-slate-500 text-center mt-4 text-sm">
            Based on keyword matching and relevance to the job description.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Executive Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg">
            {result.summary}
          </p>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Formatting Check</h3>
             {result.formattingIssues.length === 0 ? (
                <div className="flex items-center text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>No major formatting issues detected.</span>
                </div>
             ) : (
               <div className="space-y-2">
                 {result.formattingIssues.map((issue, idx) => (
                   <div key={idx} className="flex items-start text-amber-700 bg-amber-50 p-3 rounded-lg text-sm">
                     <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                     <span>{issue}</span>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Keywords */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-red-600 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Missing Keywords
            </h2>
            <span className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
              Critical
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">These important terms appear in the job description but were not found in your resume.</p>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.length > 0 ? (
              result.missingKeywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic">No critical keywords missing! Great job.</span>
            )}
          </div>
        </div>

        {/* Matched Keywords */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-emerald-600 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Matched Keywords
            </h2>
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
              Found
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Your resume successfully demonstrates these required skills.</p>
          <div className="flex flex-wrap gap-2">
             {result.matchedKeywords.length > 0 ? (
              result.matchedKeywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-medium">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic">No keywords matched yet.</span>
            )}
          </div>
        </div>

        {/* Improvements */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Actionable Improvements</h2>
          <div className="space-y-3">
            {result.improvements.map((tip, idx) => (
              <div key={idx} className="flex items-start bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold mr-3 flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-slate-700 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
