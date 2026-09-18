"use client";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";

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
    // Configure JSX parsing diagnostics if editing typescript/javascript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      reactNamespace: "React",
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-neutral-800 bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
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
  );
};