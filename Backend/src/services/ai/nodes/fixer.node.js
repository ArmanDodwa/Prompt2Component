import { llm } from "../../../config/ai.config.js";
import { FIXER_SYSTEM_PROMPT } from "../prompts/fixer.prompt.js";

const sanitizeCode = (raw) => {
  if (!raw) return "";
  let clean = raw.trim();
  clean = clean.replace(/^```(?:jsx|tsx|javascript|js|react)?\s*/i, "");
  clean = clean.replace(/\s*```$/i, "");
  return clean.trim();
};

export const fixerNode = async (state) => {
  const inputMessage = `Current Broken Code:\n${state.code}\n\nValidation Errors:\n${state.errorLogs.join("\n")}`;

  const response = await llm.invoke([
    { role: "system", content: FIXER_SYSTEM_PROMPT },
    { role: "user", content: inputMessage },
  ]);

  const rawCode = typeof response.content === "string" 
    ? response.content 
    : JSON.stringify(response.content);

  const fixedCode = sanitizeCode(rawCode);

  return {
    code: fixedCode,
    iterationCount: state.iterationCount + 1,
    errorLogs: [],
  };
};