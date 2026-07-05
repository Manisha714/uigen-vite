import { z } from "zod";
import { tool } from "ai";
import { VirtualFileSystem } from "./file-system";

const TextEditorParameters = z.object({
  command: z.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
  path: z.string(),
  file_text: z.string().optional(),
  insert_line: z.number().optional(),
  new_str: z.string().optional(),
  old_str: z.string().optional(),
  view_range: z.array(z.number()).optional(),
});

export const buildStrReplaceTool = (fileSystem: VirtualFileSystem) => ({
  id: "str_replace_editor" as const,
  args: {},
  parameters: TextEditorParameters,
  execute: async ({
    command,
    path,
    file_text,
    insert_line,
    new_str,
    old_str,
    view_range,
  }: z.infer<typeof TextEditorParameters>) => {
    switch (command) {
      case "view":
        return fileSystem.viewFile(path, view_range as [number, number] | undefined);
      case "create":
        return fileSystem.createFileWithParents(path, file_text || "");
      case "str_replace":
        return fileSystem.replaceInFile(path, old_str || "", new_str || "");
      case "insert":
        return fileSystem.insertInFile(path, insert_line || 0, new_str || "");
      case "undo_edit":
        return "Error: undo_edit not supported. Use str_replace to revert.";
    }
  },
});

export function buildFileManagerTool(fileSystem: VirtualFileSystem) {
  return tool({
    description: 'Rename or delete files or folders.',
    parameters: z.object({
      command: z.enum(["rename", "delete"]),
      path: z.string(),
      new_path: z.string().optional(),
    }),
    execute: async ({ command, path, new_path }) => {
      if (command === "rename") {
        if (!new_path) return { success: false, error: "new_path required" };
        const success = fileSystem.rename(path, new_path);
        return success
          ? { success: true, message: `Renamed ${path} to ${new_path}` }
          : { success: false, error: `Failed to rename ${path}` };
      }
      if (command === "delete") {
        const success = fileSystem.deleteFile(path);
        return success
          ? { success: true, message: `Deleted ${path}` }
          : { success: false, error: `Failed to delete ${path}` };
      }
      return { success: false, error: "Invalid command" };
    },
  });
}
