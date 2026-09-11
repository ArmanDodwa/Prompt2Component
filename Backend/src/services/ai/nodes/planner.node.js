import { llm } from "../../../config/ai.config.js";
import { PLANNER_SYSTEM_PROMPT } from "../prompts/planner.prompt.js";

export const plannerNode = async (state) => {
  const response = await llm.invoke([
    { role: "system", content: PLANNER_SYSTEM_PROMPT },
    { role: "user", content: state.userPrompt },
  ]);

  const planText = typeof response.content === "string" 
    ? response.content 
    : JSON.stringify(response.content);

  return { plan: planText };
};