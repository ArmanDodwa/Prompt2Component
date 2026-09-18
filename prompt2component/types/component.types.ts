export interface GeneratePromptRequest {
  prompt: string;
}

export interface GeneratedComponentState {
  // Input & Planning
  userPrompt: string;
  plan: string | null;

  // Outputs
  code: string;
  fileName: string;
  explanation: string;
  dependencies: string[];

  // Validation & Iteration
  isValid: boolean;
  errors: string[];
  iterationCount: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  code: string;
  fileName: string;
  prompt: string;
  createdAt: string;
}