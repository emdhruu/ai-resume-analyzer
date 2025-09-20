import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { mistralResumeOCRTool } from "../tools/mistralOCRTool";
import { resumeAnalyzerAgent } from "../agents/resumeAgents";

const extractResumeTextStep = createStep({
  id: "extract-resume-text",
  description: "Extract raw text from a PDF resume",
  inputSchema: z.object({
    pdfFile: z.instanceof(Buffer),
  }),
  outputSchema: z.object({
    extractedText: z.string(),
  }),
  execute: async ({ inputData, runtimeContext }) => {
    const { extractedText } = await mistralResumeOCRTool.execute({
      context: { pdfBuffer: inputData.pdfFile },
      runtimeContext,
    });
    return { extractedText };
  },
});

const analyzeResumeStep = createStep({
  id: "analyze-resume",
  description: "Analyze resume content for insights",
  inputSchema: z.object({
    extractedText: z.string(),
  }),
  outputSchema: z.object({
    analysis: z.string(),
  }),
  execute: async ({ inputData }) => {
    const {text} = await resumeAnalyzerAgent.generateVNext(
       [{ role: "user", content: inputData.extractedText }],
    );

    return { analysis: text };
  },
});

export const resumeWorkflow = createWorkflow({
  id: "resume-analysis",
  description: "End-to-end workflow: Extract text from resume PDF and analyze",
  inputSchema: z.object({
    pdfFile: z.instanceof(Buffer),
  }),
  outputSchema: z.object({
    analysis: z.string(),
  }),
})
  .then(extractResumeTextStep)
  .then(analyzeResumeStep)
  .commit();
