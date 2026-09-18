"use client";

import React, { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
  iterationCount?: number;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  isLoading,
  iterationCount = 0,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await onGenerate(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
      <div className="relative flex items-center">
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a component... (e.g. 'Modern pricing table with 3 tiers and billing toggle')"
          disabled={isLoading}
          className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900/90 py-3 pl-4 pr-14 text-sm text-neutral-100 placeholder-neutral-500 shadow-inner outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          Press Enter to generate, Shift+Enter for new line
        </span>
        {iterationCount > 0 && (
          <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-[11px] text-neutral-300">
            Iteration: {iterationCount}
          </span>
        )}
      </div>
    </form>
  );
};