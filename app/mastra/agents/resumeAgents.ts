import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";


export const resumeAgent = new Agent({
    name: "resume-agent",
    instructions: "You are a resume analysis agent. Your task is to analyze resumes and provide insights based on the content.",
    model: openai.responses("gpt-4"),
});