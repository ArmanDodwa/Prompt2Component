"use client";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Code2, Sliders} from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: "vs-dark" | "light";
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = "javascript",
  theme = "vs-dark",
  readOnly = false,
}) => {
  const handleEditorChange = (val: string | undefined) => {
    onChange(val || "");
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      reactNamespace: "React",
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d0e15] shadow-2xl">
      {/* Studio Code Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#12131c] px-4 py-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-white">
            <Code2 size={15} className="text-indigo-400" />
            <span>Code Editor</span>
          </div>
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
            <Sliders size={14} />
            <span>Visual Properties</span>
          </button>
        </div>
      </div>

  

      {/* Monaco Wrapper */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            readOnly,
            wordWrap: "on",
            folding: true,
            fontFamily: "Fira Code, Menlo, Monaco, Consolas, monospace",
          }}
        />
      </div>
    </div>
  );
};