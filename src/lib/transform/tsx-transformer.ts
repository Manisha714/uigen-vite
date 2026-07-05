import * as Babel from "@babel/standalone";

export interface TransformResult {
  code: string;
  error?: string;
  missingImports?: Set<string>;
  cssImports?: Set<string>;
}

function createPlaceholderModule(componentName: string): string {
  return `
import React from 'react';
const ${componentName} = function() {
  return React.createElement('div', {}, null);
}
export default ${componentName};
export { ${componentName} };
`;
}

// Resolve a relative import path to an absolute path based on the importer's directory
function resolveImportPath(importPath: string, importerPath: string): string {
  if (importPath.startsWith("./") || importPath.startsWith("../")) {
    const importerDir = importerPath.substring(0, importerPath.lastIndexOf("/")) || "/";
    const parts = importerDir.split("/").filter(Boolean);
    const relParts = importPath.split("/");

    for (const part of relParts) {
      if (part === "..") {
        parts.pop();
      } else if (part !== ".") {
        parts.push(part);
      }
    }

    return "/" + parts.join("/");
  }
  return importPath;
}

// Rewrite relative imports in compiled code to absolute paths so the iframe runtime can resolve them
function rewriteRelativeImports(code: string, importerPath: string): string {
  const resolve = (relPath: string) => resolveImportPath(relPath, importerPath);

  // ES import: from "./..." / from '../...'
  code = code.replace(
    /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
    (_match, prefix, relPath, suffix) => `${prefix}${resolve(relPath)}${suffix}`
  );

  // CommonJS require: require("./...") / require('../...')
  code = code.replace(
    /require\(['"](\.\.?\/[^'"]+)['"]\)/g,
    (_match, relPath) => `require("${resolve(relPath)}")`
  );

  // Dynamic import: import("./...") / import('../...')
  code = code.replace(
    /import\(['"](\.\.?\/[^'"]+)['"]\)/g,
    (_match, relPath) => `import("${resolve(relPath)}")`
  );

  return code;
}

export function transformJSX(
  code: string,
  filename: string,
  existingFiles: Set<string>
): TransformResult {
  try {
    const isTypeScript = filename.endsWith(".ts") || filename.endsWith(".tsx");

    let processedCode = code;
    const importRegex =
      /import\s+(?:{[^}]+}|[^,\s]+)?\s*(?:,\s*{[^}]+})?\s+from\s+['"]([^'"]+)['"]/g;
    const imports = new Set<string>();
    const cssImports = new Set<string>();

    const cssImportRegex = /import\s+['"]([^'"]+\.css)['"]/g;
    let cssMatch;
    while ((cssMatch = cssImportRegex.exec(code)) !== null) {
      cssImports.add(cssMatch[1]);
    }

    processedCode = processedCode.replace(cssImportRegex, "");

    let match;
    while ((match = importRegex.exec(code)) !== null) {
      if (!match[1].endsWith(".css")) {
        imports.add(match[1]);
      }
    }

    const result = Babel.transform(processedCode, {
      filename,
      presets: [
        ["react", { runtime: "classic" }],
        ...(isTypeScript ? ["typescript"] : []),
      ],
      plugins: ["transform-modules-commonjs"],
    });

    let compiledCode = result.code || "";

    return {
      code: compiledCode,
      missingImports: imports,
      cssImports: cssImports,
    };
  } catch (error) {
    return {
      code: "",
      error: error instanceof Error ? error.message : "Unknown transform error",
    };
  }
}

export function createBlobURL(
  code: string,
  mimeType: string = "application/javascript"
): string {
  const blob = new Blob([code], { type: mimeType });
  return URL.createObjectURL(blob);
}

export interface ImportMapResult {
  importMap: string;
  styles: string;
  errors: Array<{ path: string; error: string }>;
  moduleRegistry: string;
}

function resolveRelativePath(fromDir: string, relativePath: string): string {
  const parts = fromDir.split("/").filter(Boolean);
  const relParts = relativePath.split("/");

  for (const part of relParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }

  return "/" + parts.join("/");
}

export function createImportMap(files: Map<string, string>): ImportMapResult {
  const existingFiles = new Set(files.keys());
  const externalPackages = new Set<string>();
  const allCssImports = new Set<{ from: string; cssPath: string }>();
  let collectedStyles = "";
  const errors: Array<{ path: string; error: string }> = [];

  // Compile all files
  const compiledFiles = new Map<string, string>();
  for (const [path, content] of files) {
    if (path.endsWith(".js") || path.endsWith(".jsx") || path.endsWith(".ts") || path.endsWith(".tsx")) {
      const { code, error, missingImports, cssImports } = transformJSX(content, path, existingFiles);

      if (error) {
        errors.push({ path, error });
        continue;
      }

      compiledFiles.set(path, rewriteRelativeImports(code, path));

      if (missingImports) {
        missingImports.forEach((imp) => {
          const isPackage = !imp.startsWith(".") && !imp.startsWith("/") && !imp.startsWith("@/");
          if (isPackage) externalPackages.add(imp);
        });
      }

      if (cssImports) {
        cssImports.forEach((cssImport) => {
          allCssImports.add({ from: path, cssPath: cssImport });
        });
      }
    } else if (path.endsWith(".css")) {
      collectedStyles += `/* ${path} */\n${content}\n\n`;
    }
  }

  // Process CSS imports
  for (const { from, cssPath } of allCssImports) {
    let resolvedPath = cssPath;
    if (cssPath.startsWith("@/")) {
      resolvedPath = cssPath.replace("@/", "/");
    } else if (cssPath.startsWith("./") || cssPath.startsWith("../")) {
      const fromDir = from.substring(0, from.lastIndexOf("/"));
      resolvedPath = resolveRelativePath(fromDir, cssPath);
    }
    if (!files.has(resolvedPath)) {
      collectedStyles += `/* ${cssPath} not found */\n`;
    }
  }

  // Build import map for external packages only
  const imports: Record<string, string> = {
    react: "https://esm.sh/react@19",
    "react-dom": "https://esm.sh/react-dom@19",
    "react-dom/client": "https://esm.sh/react-dom@19/client",
    "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime",
    "react/jsx-dev-runtime": "https://esm.sh/react@19/jsx-dev-runtime",
  };
  for (const pkg of externalPackages) {
    if (!imports[pkg]) {
      imports[pkg] = `https://esm.sh/${pkg}`;
    }
  }

  // Build inline module registry script (avoids blob-to-blob import issues)
  const moduleRegistry = buildModuleRegistry(compiledFiles, imports);

  return {
    importMap: JSON.stringify({ imports }, null, 2),
    styles: collectedStyles,
    errors,
    moduleRegistry,
  };
}

// Build a self-contained script that registers all modules and provides a runtime require
function buildModuleRegistry(
  compiledFiles: Map<string, string>,
  externalImports: Record<string, string>
): string {
  const filesJSON: Record<string, string> = {};
  for (const [path, code] of compiledFiles) {
    filesJSON[path] = code;
  }

  // Escape </script> in JSON so it doesn't break the HTML parser
  return JSON.stringify(filesJSON).replace(/<\/script>/gi, "<\\/script>");
}

export function createPreviewHTML(
  entryPoint: string,
  importMap: string,
  styles: string = "",
  errors: Array<{ path: string; error: string }> = [],
  moduleRegistry: string = "{}"
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #root {
      width: 100vw;
      height: 100vh;
    }
    .error-boundary {
      color: red;
      padding: 1rem;
      border: 2px solid red;
      margin: 1rem;
      border-radius: 4px;
      background: #fee;
    }
    .syntax-errors {
      background: #fef5f5;
      border: 2px solid #ff6b6b;
      border-radius: 12px;
      padding: 32px;
      margin: 24px;
      font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
      font-size: 14px;
    }
    .syntax-errors h3 {
      color: #dc2626;
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
    }
    .syntax-errors .error-item {
      margin: 16px 0;
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      border-left: 4px solid #ff6b6b;
    }
    .syntax-errors .error-path {
      font-weight: 600;
      color: #991b1b;
      font-size: 15px;
      margin-bottom: 8px;
    }
    .syntax-errors .error-message {
      color: #7c2d12;
      margin-top: 8px;
      white-space: pre-wrap;
      line-height: 1.5;
      font-size: 13px;
    }
  </style>
  ${styles ? `<style>\n${styles}</style>` : ""}
  <script type="importmap">
    ${importMap}
  </script>
</head>
<body>
  ${
    errors.length > 0
      ? `
    <div class="syntax-errors">
      <h3>Syntax Error${errors.length > 1 ? "s" : ""} (${errors.length})</h3>
      ${errors
        .map(
          (e) => `
        <div class="error-item">
          <div class="error-path">${e.path}</div>
          <div class="error-message">${e.error.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `
      : ""
  }
  <div id="root"></div>
  ${
    errors.length === 0
      ? `<script type="module">
    import React from 'react';
    import { createRoot } from 'react-dom/client';

    // Forward iframe errors/logs to parent window for debugging
    window.onerror = (msg, url, line, col, err) => {
      window.parent?.postMessage({ type: 'iframe-error', message: String(msg), stack: err?.stack }, '*');
      return false;
    };
    window.onunhandledrejection = (event) => {
      window.parent?.postMessage({ type: 'iframe-unhandledrejection', reason: String(event.reason) }, '*');
    };
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      window.parent?.postMessage({ type: 'iframe-console-error', args: args.map((a) => String(a)) }, '*');
    };

    // Runtime module registry — compiled CommonJS modules
    const __MODULES__ = ${moduleRegistry};
    const __CACHE__ = {};

    function __resolve__(specifier) {
      if (__MODULES__[specifier]) return specifier;
      const variations = [
        specifier,
        specifier + '.tsx', specifier + '.jsx', specifier + '.ts', specifier + '.js',
        '/' + specifier, '/' + specifier + '.tsx', '/' + specifier + '.jsx',
      ];
      if (specifier.startsWith('./') || specifier.startsWith('../')) {
        const abs = specifier.replace(/^\\.\\//, '/').replace(/^\\.\\.\\//, '/');
        variations.push(abs, abs + '.tsx', abs + '.jsx', abs + '.ts', abs + '.js');
      }
      if (specifier.startsWith('@/')) {
        const abs = '/' + specifier.slice(2);
        variations.push(abs, abs + '.tsx', abs + '.jsx', abs + '.ts', abs + '.js');
      }
      for (const v of variations) {
        if (__MODULES__[v]) return v;
      }
      return null;
    }

    function __require__(specifier) {
      // Built-in modules
      if (specifier === 'react') {
        const m = Object.assign({}, React, { default: React });
        return m;
      }
      if (specifier === 'react-dom' || specifier === 'react-dom/client') {
        const ReactDOM = { createRoot };
        return Object.assign({}, ReactDOM, { default: ReactDOM });
      }

      const resolved = __resolve__(specifier);
      if (!resolved) {
        console.warn('Module not found:', specifier);
        return {};
      }
      if (__CACHE__[resolved]) return __CACHE__[resolved];

      const code = __MODULES__[resolved];
      const exports = {};
      const module = { exports };
      // Pre-cache to handle circular deps
      __CACHE__[resolved] = exports;

      try {
        const fn = new Function('module', 'exports', 'require', 'React', code);
        fn(module, exports, __require__, React);
        // If module.exports was reassigned
        if (module.exports !== exports) {
          __CACHE__[resolved] = module.exports;
          return module.exports;
        }
        return exports;
      } catch (err) {
        console.error('Error executing ' + resolved + ':', err);
        return {};
      }
    }

    // Render the app
    try {
      const appExports = __require__('${entryPoint}');
      let App = appExports.default;
      if (typeof App !== 'function') {
        // Find first function export (named component)
        for (const key of Object.keys(appExports)) {
          if (typeof appExports[key] === 'function') {
            App = appExports[key];
            break;
          }
        }
      }

      if (typeof App === 'function') {
        const root = createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
      } else {
        document.getElementById('root').innerHTML = '<div class="error-boundary"><h2>No component found</h2><pre>Module exports: ' + Object.keys(appExports).join(', ') + '</pre></div>';
      }
    } catch (error) {
      console.error('Failed to load app:', error);
      document.getElementById('root').innerHTML = '<div class="error-boundary"><h2>Failed to load app</h2><pre>' + error.toString() + '</pre></div>';
    }
  </script>`
      : ""
  }
</body>
</html>`;
}
