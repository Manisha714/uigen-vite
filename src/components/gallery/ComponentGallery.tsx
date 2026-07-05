import { useState, useEffect } from "react";
import { createImportMap, createPreviewHTML } from "@/lib/transform/tsx-transformer";
import { ArrowLeft } from "lucide-react";

interface GalleryFile {
  path: string;
  content: string;
}

interface GalleryComponent {
  name: string;
  files: Map<string, string>;
  entryPoint: string;
}

export function ComponentGallery({ onBack }: { onBack: () => void }) {
  const [components, setComponents] = useState<GalleryComponent[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          const allFiles: GalleryFile[] = data.files;
          const comps: GalleryComponent[] = [];

          // Find all component .tsx files (skip stories, configs, main, index)
          const componentFiles = allFiles.filter((f) => {
            const path = f.path;
            if (!path.endsWith(".tsx")) return false;
            if (path.includes(".stories.")) return false;
            if (path.endsWith("/main.tsx")) return false;
            if (path.endsWith("/index.tsx")) return false;
            // Only include files that look like components (in a components directory or named with uppercase)
            const fileName = path.split("/").pop()!.replace(".tsx", "");
            return fileName[0] === fileName[0].toUpperCase() && fileName !== "App";
          });

          for (const file of componentFiles) {
            const name = file.path.split("/").pop()!.replace(".tsx", "");
            const singleFileMap = new Map<string, string>();
            singleFileMap.set(file.path, file.content);

            // Create a wrapper App.tsx that handles both default and named exports
            const importPath = file.path.replace(".tsx", "");
            // Check if it has a default export
            const hasDefault = /export\s+default/.test(file.content);
            const importStatement = hasDefault
              ? `import ${name} from '${importPath}';`
              : `import { ${name} } from '${importPath}';`;

            // For components that require children prop, pass sample text
            const needsChildren = /children/.test(file.content);
            const renderTag = needsChildren
              ? `<${name}>Sample Content</${name}>`
              : `<${name} />`;

            const wrapperApp = `${importStatement}\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">\n      ${renderTag}\n    </div>\n  );\n}`;
            singleFileMap.set("/App.tsx", wrapperApp);

            comps.push({
              name,
              files: singleFileMap,
              entryPoint: "/App.tsx",
            });
          }

          setComponents(comps);
        }
      })
      .catch((err) => console.error("Gallery fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const currentComponent = components[selectedIdx];
  const previewHtml = currentComponent
    ? generatePreview(currentComponent.files, currentComponent.entryPoint)
    : "";

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading gallery...
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
        <p>No saved components yet.</p>
        <p className="text-xs">Generate components and click "Save to Disk" to see them here.</p>
        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Gallery Header */}
      <div className="h-14 border-b border-neutral-200/60 px-6 flex items-center gap-4 bg-neutral-50/50">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-sm font-medium text-neutral-900">Component Gallery</span>
        <div className="flex-1" />
        <span className="text-xs text-gray-400">{components.length} component(s)</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-neutral-200 bg-neutral-50 overflow-y-auto p-2">
          {components.map((comp, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left text-xs px-3 py-2 rounded-md mb-1 transition-colors ${
                selectedIdx === idx
                  ? "bg-white font-medium text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-gray-600 hover:bg-white hover:text-gray-900"
              }`}
            >
              {comp.name}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="flex-1 bg-white">
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title={`Preview: ${currentComponent?.name}`}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Select a component to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generatePreview(files: Map<string, string>, entryPoint: string): string {
  try {
    const { importMap, styles, errors, moduleRegistry } = createImportMap(files);
    return createPreviewHTML(entryPoint, importMap, styles, errors, moduleRegistry);
  } catch (err) {
    console.error("Preview generation error:", err);
    return `<html><body><div style="padding:2rem;color:red;">Preview generation failed: ${err}</div></body></html>`;
  }
}
