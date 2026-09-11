import { StateGraph, END, START } from "@langchain/langgraph";
import { ComponentStateAnnotation } from "./state.js";
import { plannerNode } from "./nodes/planner.node.js";
import { coderNode } from "./nodes/coder.node.js";
import { validatorNode } from "./nodes/validator.node.js";
import { fixerNode } from "./nodes/fixer.node.js";

/**
 * Conditional router:
 * - If code passed validation -> finish (END)
 * - If iteration count reached 3 -> finish (avoid infinite loops on free tier)
 * - Otherwise -> route to fixer node
 */
function routeAfterValidation(state) {
  if (state.isValid || state.iterationCount >= 3) {
    return END;
  }
  return "fixer";
}

// Assemble the StateGraph
const workflow = new StateGraph(ComponentStateAnnotation)
  .addNode("planner", plannerNode)
  .addNode("coder", coderNode)
  .addNode("validator", validatorNode)
  .addNode("fixer", fixerNode)
  // Entry point and primary pipeline
  .addEdge(START, "planner")
  .addEdge("planner", "coder")
  .addEdge("coder", "validator")
  // Conditional repair branch
  .addConditionalEdges("validator", routeAfterValidation, {
    fixer: "fixer",
    [END]: END,
  })
  // After fixing, re-validate
  .addEdge("fixer", "validator");

export const componentGraph = workflow.compile();