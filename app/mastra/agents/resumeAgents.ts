import { Agent } from '@mastra/core/agent';
import { mistralResumeOCRTool } from '../tools/mistralOCRTool';
import { resumeWorkflow } from '../workflow/resumeInput';
import { groq } from '@ai-sdk/groq';

export const resumeAnalyzerAgent: Agent = new Agent({
  name: 'Resume Analyzer Pro',
  instructions: `
You are a resume analysis assistant. Your job is to:
- Summarize the candidate’s education, skills, and experience
- Highlight strengths and weaknesses
- Suggest improvements to make the resume stand out
- Evaluate how well this resume fits for software development roles

Keep it concise, structured, and professional.
  `,
  model: groq("openai/gpt-oss-20b") ,
  tools: { mistralResumeOCRTool },
  workflows: { resumeWorkflow } 
});
