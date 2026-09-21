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
          placeholder="Add a subtle glow ring to heading and enlarge font to text-3xl"
          disabled={isLoading}
          className="w-full resize-none rounded-xl border border-slate-800 bg-[#12131c] py-3 pl-4 pr-14 text-sm text-slate-100 placeholder-slate-500 shadow-inner outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-600 disabled:opacity-50 font-sans"
        />

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 shadow-md shadow-indigo-600/30"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-500">Press</span>
          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">#Enter</span>
          <span className="text-slate-500">to generate</span>
          <span className="text-slate-600">·</span>
          <span className="text-indigo-400">Visual edit sync directly to JSX code</span>
        </span>
        {iterationCount > 0 && (
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300 border border-slate-700">
            Iteration: {iterationCount}
          </span>
        )}
      </div>
    </form>
  );
};