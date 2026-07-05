export interface FileNode {
  type: "file" | "directory";
  name: string;
  path: string;
  content?: string;
  children?: Map<string, FileNode>;
}

export class VirtualFileSystem {
  private files: Map<string, FileNode> = new Map();
  private root: FileNode;

  constructor() {
    this.root = {
      type: "directory",
      name: "/",
      path: "/",
      children: new Map(),
    };
    this.files.set("/", this.root);
  }

  private normalizePath(path: string): string {
    if (!path.startsWith("/")) path = "/" + path;
    if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);
    path = path.replace(/\/+/g, "/");
    return path;
  }

  private getParentPath(path: string): string {
    const normalized = this.normalizePath(path);
    if (normalized === "/") return "/";
    const parts = normalized.split("/");
    parts.pop();
    return parts.length === 1 ? "/" : parts.join("/");
  }

  private getFileName(path: string): string {
    const normalized = this.normalizePath(path);
    if (normalized === "/") return "/";
    const parts = normalized.split("/");
    return parts[parts.length - 1];
  }

  createFile(path: string, content: string = ""): boolean {
    const normalized = this.normalizePath(path);
    if (this.files.has(normalized)) {
      const existing = this.files.get(normalized)!;
      if (existing.type === "file") {
        existing.content = content;
        return true;
      }
      return false;
    }

    const parentPath = this.getParentPath(normalized);
    const parent = this.files.get(parentPath);
    if (!parent || parent.type !== "directory") return false;

    const node: FileNode = {
      type: "file",
      name: this.getFileName(normalized),
      path: normalized,
      content,
    };

    parent.children!.set(node.name, node);
    this.files.set(normalized, node);
    return true;
  }

  createFileWithParents(path: string, content: string = ""): string {
    const normalized = this.normalizePath(path);
    const parts = normalized.split("/").filter(Boolean);
    let currentPath = "";

    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += "/" + parts[i];
      if (!this.files.has(currentPath)) {
        const parentPath = this.getParentPath(currentPath);
        const parent = this.files.get(parentPath);
        if (!parent) return `Error: Parent ${parentPath} not found`;

        const dirNode: FileNode = {
          type: "directory",
          name: parts[i],
          path: currentPath,
          children: new Map(),
        };
        parent.children!.set(parts[i], dirNode);
        this.files.set(currentPath, dirNode);
      }
    }

    this.createFile(normalized, content);
    return `File created: ${normalized}`;
  }

  readFile(path: string): string | null {
    const normalized = this.normalizePath(path);
    const node = this.files.get(normalized);
    if (!node || node.type !== "file") return null;
    return node.content || "";
  }

  updateFile(path: string, content: string): boolean {
    const normalized = this.normalizePath(path);
    const node = this.files.get(normalized);
    if (!node || node.type !== "file") return false;
    node.content = content;
    return true;
  }

  deleteFile(path: string): boolean {
    const normalized = this.normalizePath(path);
    const node = this.files.get(normalized);
    if (!node || normalized === "/") return false;

    const parentPath = this.getParentPath(normalized);
    const parent = this.files.get(parentPath);
    if (parent && parent.children) {
      parent.children.delete(node.name);
    }

    if (node.type === "directory" && node.children) {
      const deleteRecursive = (n: FileNode) => {
        if (n.children) {
          for (const child of n.children.values()) {
            deleteRecursive(child);
          }
        }
        this.files.delete(n.path);
      };
      deleteRecursive(node);
    } else {
      this.files.delete(normalized);
    }
    return true;
  }

  rename(oldPath: string, newPath: string): boolean {
    const normalizedOld = this.normalizePath(oldPath);
    const normalizedNew = this.normalizePath(newPath);
    const node = this.files.get(normalizedOld);
    if (!node) return false;

    const content = node.type === "file" ? node.content : undefined;
    this.deleteFile(normalizedOld);

    if (node.type === "file") {
      this.createFileWithParents(normalizedNew, content || "");
    }
    return true;
  }

  replaceInFile(path: string, oldStr: string, newStr: string): string {
    const normalized = this.normalizePath(path);
    const node = this.files.get(normalized);
    if (!node || node.type !== "file") return `Error: File ${path} not found`;

    const content = node.content || "";
    if (!content.includes(oldStr)) {
      return `Error: String not found in ${path}`;
    }

    node.content = content.replace(oldStr, newStr);
    return `Replaced in ${path}`;
  }

  insertInFile(path: string, line: number, text: string): string {
    const normalized = this.normalizePath(path);
    const node = this.files.get(normalized);
    if (!node || node.type !== "file") return `Error: File ${path} not found`;

    const lines = (node.content || "").split("\n");
    lines.splice(line, 0, text);
    node.content = lines.join("\n");
    return `Inserted at line ${line} in ${path}`;
  }

  viewFile(path: string, range?: [number, number]): string {
    const normalized = this.normalizePath(path);
    const node = this.files.get(normalized);
    if (!node || node.type !== "file") return `Error: File ${path} not found`;

    const content = node.content || "";
    if (!range) return content;

    const lines = content.split("\n");
    const [start, end] = range;
    return lines.slice(start - 1, end).join("\n");
  }

  getAllFiles(): Map<string, string> {
    const result = new Map<string, string>();
    for (const [path, node] of this.files) {
      if (node.type === "file") {
        result.set(path, node.content || "");
      }
    }
    return result;
  }

  serialize(): Record<string, any> {
    const result: Record<string, any> = {};
    const serializeNode = (node: FileNode): any => {
      const obj: any = {
        type: node.type,
        name: node.name,
        path: node.path,
      };
      if (node.type === "file") {
        obj.content = node.content;
      }
      if (node.children) {
        obj.children = {};
        for (const [key, child] of node.children) {
          obj.children[key] = serializeNode(child);
        }
      }
      return obj;
    };
    result["/"] = serializeNode(this.root);
    return result;
  }

  deserializeFromNodes(data: Record<string, any>): void {
    this.files.clear();
    this.root = {
      type: "directory",
      name: "/",
      path: "/",
      children: new Map(),
    };
    this.files.set("/", this.root);

    const deserializeNode = (obj: any, parentPath: string) => {
      if (!obj) return;
      if (obj.type === "file") {
        this.createFileWithParents(obj.path, obj.content || "");
      }
      if (obj.children) {
        for (const key of Object.keys(obj.children)) {
          deserializeNode(obj.children[key], obj.path);
        }
      }
    };

    if (data["/"]) {
      deserializeNode(data["/"], "/");
    } else {
      for (const key of Object.keys(data)) {
        deserializeNode(data[key], "/");
      }
    }
  }

  reset(): void {
    this.files.clear();
    this.root = {
      type: "directory",
      name: "/",
      path: "/",
      children: new Map(),
    };
    this.files.set("/", this.root);
  }
}
