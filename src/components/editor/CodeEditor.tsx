import Editor from "@monaco-editor/react";
import { useFileSystem } from "@/contexts/FileSystemContext";

export function CodeEditor() {
  const { files, selectedFile } = useFileSystem();

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Select a file to view its code
      </div>
    );
  }

  const content = files.get(selectedFile) || "";
  const ext = selectedFile.split(".").pop() || "jsx";
  const languageMap: Record<string, string> = {
    jsx: "javascript",
    tsx: "typescript",
    js: "javascript",
    ts: "typescript",
    css: "css",
    json: "json",
    html: "html",
  };

  return (
    <div className="h-full">
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 text-xs text-gray-600">
        {selectedFile}
      </div>
      <Editor
        height="calc(100% - 32px)"
        language={languageMap[ext] || "javascript"}
        value={content}
        theme="vs-light"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
