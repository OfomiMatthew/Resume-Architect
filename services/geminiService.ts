import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to ensure API key exists
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API Key not found in environment variables");
  }
  return key;
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert ATS (Applicant Tracking System) and Resume Coach. 
    Your goal is to compare a candidate's resume against a specific job description.
    Analyze the relevance, keyword matching, and overall structure.
    Provide a strict percentage score based on how well the resume fits the job description.
    Identify matched keywords and critical missing keywords that appear in the job description but not the resume.
    Provide actionable improvements.
    Also check for major formatting red flags that might confuse an ATS (like implied complex columns or graphics, though you can only see text, infer structure from the text layout if possible, or give general advice).
  `;

  const prompt = `
    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    Please analyze the resume against the job description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "A score from 0 to 100 indicating the match percentage.",
            },
            summary: {
              type: Type.STRING,
              description: "A concise summary of the analysis (max 3 sentences).",
            },
            matchedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of important hard/soft skills found in both.",
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of important hard/soft skills found in Job Description but MISSING in Resume.",
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific, actionable advice to improve the score.",
            },
            formattingIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Potential ATS formatting warnings (e.g., use of headers, clarity).",
            },
          },
          required: ["score", "summary", "matchedKeywords", "missingKeywords", "improvements", "formattingIssues"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};
