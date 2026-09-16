import { Annotation } from "@langchain/langgraph";

export const ComponentStateAnnotation = Annotation.Root({
  // --- Input & Planning ---
  userPrompt: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => "",
  }),
  plan: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => null,
  }),

  // --- Separated Outputs (New Channels) ---
  code: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => "",
  }),
  fileName: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => "Component.jsx",
  }),
  explanation: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => "",
  }),
  dependencies: Annotation({
    reducer: (curr, next) => next ?? curr ?? [],
    default: () => [],
  }),

  // --- Validation & Control Flow ---
  isValid: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => false,
  }),
  // Stores current iteration errors (overwritten each check, not stacked)
  errors: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => [],
  }),
  iterationCount: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => 0,
  }),
});