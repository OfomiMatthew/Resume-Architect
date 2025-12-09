import React, { useState } from 'react';
import { Upload, FileText, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import mammoth from 'mammoth';

// Configure worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

interface InputFormProps {
  onAnalyze: (resume: string, jobDesc: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // Iterate over all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Combine text items, adding a space between them
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setFileName(null);
    setResumeText('');
    
    if (file) {
      setIsParsing(true);
      try {
        let text = '';
        if (file.type === 'application/pdf') {
          text = await extractTextFromPdf(file);
        } else if (
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')
        ) {
          text = await extractTextFromDocx(file);
        } else if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          text = await file.text();
        } else {
           throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
        }

        if (!text || text.trim().length === 0) {
           throw new Error("Could not extract text. The file might be empty or a scanned image.");
        }
        
        setResumeText(text);
        setFileName(file.name);
      } catch (err: any) {
        console.error("File parsing error:", err);
        setFileError(err.message || "Failed to read file.");
      } finally {
        setIsParsing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim() && jobDesc.trim()) {
      onAnalyze(resumeText, jobDesc);
    }
  };

  const isButtonDisabled = !resumeText.trim() || !jobDesc.trim() || isLoading || isParsing;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Optimize Your Resume for <span className="text-indigo-600">ATS Algorithms</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Paste your resume and the job description below. Our AI will analyze the match, find missing keywords, and give you actionable feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Resume Section */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Your Resume
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`text-xs px-2 py-1 rounded ${activeTab === 'paste' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`text-xs px-2 py-1 rounded ${activeTab === 'upload' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  File
                </button>
              </div>
            </div>
            
            <div className="flex-grow bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
               {activeTab === 'paste' ? (
                <textarea
                  className="w-full h-80 p-4 resize-none border-none outline-none text-slate-600 text-sm font-mono placeholder:text-slate-400"
                  placeholder="Paste your full resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
               ) : (
                 <div className="w-full h-80 flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-6 relative">
                    <Upload className={`w-10 h-10 mb-4 ${fileError ? 'text-red-400' : 'text-slate-400'}`} />
                    
                    {isParsing ? (
                       <div className="text-center">
                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                         <p className="text-sm text-indigo-600 font-medium">Extracting text...</p>
                       </div>
                    ) : !fileName ? (
                      <>
                        <p className="text-sm mb-2 font-medium text-slate-700">Upload Resume</p>
                        <p className="text-xs text-slate-400 mb-4">PDF, DOCX, or TXT</p>
                      </>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                        <p className="text-sm font-medium text-emerald-700 truncate max-w-[200px]">{fileName}</p>
                        <p className="text-xs text-emerald-600 mt-1">Ready for analysis</p>
                        <button 
                          type="button" 
                          onClick={() => { setFileName(null); setResumeText(''); }}
                          className="mt-3 text-xs text-slate-400 hover:text-red-500 underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <div className="mt-4 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {fileError}
                      </div>
                    )}

                    <input 
                      type="file" 
                      accept=".txt,.md,.pdf,.docx" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isParsing}
                    />
                 </div>
               )}
            </div>
          </div>

          {/* Job Description Section */}
          <div className="flex flex-col h-full">
            <div className="mb-2">
               <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Description
              </label>
            </div>
            <div className="flex-grow bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
              <textarea
                className="w-full h-80 p-4 resize-none border-none outline-none text-slate-600 text-sm font-mono placeholder:text-slate-400"
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`
              relative group flex items-center px-8 py-4 text-lg font-bold rounded-full text-white transition-all
              ${isButtonDisabled 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 shadow-md shadow-indigo-200'}
            `}
          >
            {isLoading ? (
               <>
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                 Analyzing...
               </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Match
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;