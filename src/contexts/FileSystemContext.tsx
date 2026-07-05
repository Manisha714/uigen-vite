import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FileNode {
  type: "file" | "directory";
  name: string;
  path: string;
  content?: string;
  children?: Record<string, any>;
}

interface FileSystemContextType {
  files: Map<string, string>;
  selectedFile: string | null;
  setSelectedFile: (path: string | null) => void;
  refreshTrigger: number;
  handleToolCall: (toolCall: { toolName: string; args: any }) => void;
  getSerializedFiles: () => Record<string, any>;
  loadFiles: (serialized: Record<string, any>) => void;
  reset: () => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Map<string, string>>(new Map());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fileTree, setFileTree] = useState<Record<string, any>>({});

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleToolCall = useCallback(
    (toolCall: { toolName: string; args: any }) => {
      const { toolName, args } = toolCall;

      if (toolName === "str_replace_editor" && args) {
        const { command, path, file_text, old_str, new_str } = args;

        setFiles((prev) => {
          const next = new Map(prev);

          switch (command) {
            case "create":
              if (path && file_text !== undefined) {
                next.set(path, file_text);
              }
              break;
            case "str_replace":
              if (path && old_str !== undefined && new_str !== undefined) {
                const current = next.get(path) || "";
                next.set(path, current.replace(old_str, new_str));
              }
              break;
          }

          return next;
        });
        triggerRefresh();
      }

      if (toolName === "file_manager" && args) {
        const { command, path, new_path } = args;

        setFiles((prev) => {
          const next = new Map(prev);

          if (command === "delete" && path) {
            next.delete(path);
          }
          if (command === "rename" && path && new_path) {
            const content = next.get(path) || "";
            next.delete(path);
            next.set(new_path, content);
          }

          return next;
        });
        triggerRefresh();
      }
    },
    [triggerRefresh]
  );

  const getSerializedFiles = useCallback(() => {
    const root: any = {
      type: "directory",
      name: "/",
      path: "/",
      children: {},
    };

    files.forEach((content, path) => {
      const parts = path.split("/").filter(Boolean);
      let current = root;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current.children[parts[i]]) {
          const dirPath = "/" + parts.slice(0, i + 1).join("/");
          current.children[parts[i]] = {
            type: "directory",
            name: parts[i],
            path: dirPath,
            children: {},
          };
        }
        current = current.children[parts[i]];
      }

      const fileName = parts[parts.length - 1];
      current.children[fileName] = {
        type: "file",
        name: fileName,
        path,
        content,
      };
    });

    return { "/": root };
  }, [files]);

  const loadFiles = useCallback((serialized: Record<string, any>) => {
    const newFiles = new Map<string, string>();

    function walk(node: any) {
      if (node.type === "file" && node.path && node.content !== undefined) {
        newFiles.set(node.path, node.content);
      }
      if (node.children) {
        Object.values(node.children).forEach(walk);
      }
    }

    Object.values(serialized).forEach(walk);
    setFiles(newFiles);
    setSelectedFile(null);
    triggerRefresh();
  }, [triggerRefresh]);

  const reset = useCallback(() => {
    setFiles(new Map());
    setSelectedFile(null);
    triggerRefresh();
  }, [triggerRefresh]);

  return (
    <FileSystemContext.Provider
      value={{
        files,
        selectedFile,
        setSelectedFile,
        refreshTrigger,
        handleToolCall,
        getSerializedFiles,
        loadFiles,
        reset,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error("useFileSystem must be used within FileSystemProvider");
  return context;
}
