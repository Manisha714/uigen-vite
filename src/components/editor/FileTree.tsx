import { useFileSystem } from "@/contexts/FileSystemContext";
import { File, Folder } from "lucide-react";

export function FileTree() {
  const { files, selectedFile, setSelectedFile } = useFileSystem();

  const paths = Array.from(files.keys()).sort();

  // Build tree structure
  const tree: Record<string, string[]> = {};
  const rootFiles: string[] = [];

  paths.forEach((path) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 1) {
      rootFiles.push(path);
    } else {
      const dir = "/" + parts.slice(0, -1).join("/");
      if (!tree[dir]) tree[dir] = [];
      tree[dir].push(path);
    }
  });

  const dirs = Object.keys(tree).sort();

  return (
    <div className="h-full overflow-y-auto p-2 text-sm">
      <div className="font-medium text-xs uppercase text-gray-400 px-2 py-1 mb-1">
        Files
      </div>

      {/* Root files */}
      {rootFiles.map((path) => (
        <button
          key={path}
          onClick={() => setSelectedFile(path)}
          className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 hover:bg-gray-100 ${
            selectedFile === path ? "bg-blue-50 text-blue-700" : "text-gray-700"
          }`}
        >
          <File className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{path.split("/").pop()}</span>
        </button>
      ))}

      {/* Directories */}
      {dirs.map((dir) => (
        <div key={dir} className="mt-1">
          <div className="px-2 py-1 flex items-center gap-2 text-gray-500">
            <Folder className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate text-xs font-medium">
              {dir.split("/").filter(Boolean).pop()}
            </span>
          </div>
          {tree[dir].map((path) => (
            <button
              key={path}
              onClick={() => setSelectedFile(path)}
              className={`w-full text-left pl-7 pr-2 py-1 rounded flex items-center gap-2 hover:bg-gray-100 ${
                selectedFile === path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              <File className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{path.split("/").pop()}</span>
            </button>
          ))}
        </div>
      ))}

      {paths.length === 0 && (
        <p className="text-gray-400 text-xs px-2 mt-4">
          No files yet. Ask the AI to create a component.
        </p>
      )}
    </div>
  );
}
