import { Mastra } from "@mastra/core/mastra";
import { resumeAgent } from "./agents/resumeAgents";
export const mastra = new Mastra({
    agents: { resumeAgent },    
});