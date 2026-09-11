import { Annotation } from "@langchain/langgraph";

export const ComponentStateAnnotation = Annotation.Root({
  userPrompt: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => "",
  }),
  plan: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => null,
  }),
  code: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => "",
  }),
  errorLogs: Annotation({
    reducer: (curr, next) => (next ? curr.concat(next) : curr),
    default: () => [],
  }),
  iterationCount: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => 0,
  }),
  isValid: Annotation({
    reducer: (curr, next) => next ?? curr,
    default: () => false,
  }),
});