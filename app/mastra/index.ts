import { Mastra } from "@mastra/core/mastra";
import { resumeAnalyzerAgent } from "./agents/resumeAgents";
import { resumeWorkflow } from "./workflow/resumeInput";

export const mastra = new Mastra({
    workflows: { resumeWorkflow },
    agents: { resumeAnalyzerAgent },
});