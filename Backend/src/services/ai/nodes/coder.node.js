import { llm } from "../../../config/ai.config.js";
import { CODER_SYSTEM_PROMPT } from "../prompts/coder.prompt.js";

// Cleans unexpected markdown backticks from LLM output
const sanitizeCode = (raw) => {
  if (!raw) return "";
  let clean = raw.trim();
  clean = clean.replace(/^```(?:jsx|tsx|javascript|js|react)?\s*/i, "");
  clean = clean.replace(/\s*```$/i, "");
  return clean.trim();
};

export const coderNode = async (state) => {
  const inputMessage = `Architecture Plan:\n${state.plan}\n\nOriginal Request:\n${state.userPrompt}`;

  const response = await llm.invoke([
    { role: "system", content: CODER_SYSTEM_PROMPT },
    { role: "user", content: inputMessage },
  ]);

  const rawCode = typeof response.content === "string" 
    ? response.content 
    : JSON.stringify(response.content);

  const cleanCode = sanitizeCode(rawCode);

  return {
    code: cleanCode,
    iterationCount: state.iterationCount + 1,
  };
};