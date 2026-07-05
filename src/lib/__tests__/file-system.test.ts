import { test, expect } from "vitest";
import { VirtualFileSystem } from "@/lib/file-system";

test("creates a new file system with root directory", () => {
  const fs = new VirtualFileSystem();
  const root = fs.getNode("/");

  expect(root).toBeDefined();
  expect(root?.type).toBe("directory");
  expect(root?.name).toBe("/");
  expect(root?.path).toBe("/");
});

test("normalizes paths correctly", () => {
  const fs = new VirtualFileSystem();

  // Test by creating files with different path formats
  fs.createFile("test.txt", "content");
  expect(fs.exists("/test.txt")).toBe(true);

  // Test path normalization - createFile now creates parent directories
  fs.createFile("//folder//file.txt", "content");
  expect(fs.exists("/folder/file.txt")).toBe(true);

  fs.createFile("/trailing/", "content");
  expect(fs.exists("/trailing")).toBe(true);
});

test("creates files in root directory", () => {
  const fs = new VirtualFileSystem();
  const file = fs.createFile("/test.txt", "Hello World");

  expect(file).toBeDefined();
  expect(file?.type).toBe("file");
  expect(file?.name).toBe("test.txt");
  expect(file?.path).toBe("/test.txt");
  expect(file?.content).toBe("Hello World");
});

test("creates directories", () => {
  const fs = new VirtualFileSystem();
  const dir = fs.createDirectory("/src");

  expect(dir).toBeDefined();
  expect(dir?.type).toBe("directory");
  expect(dir?.name).toBe("src");
  expect(dir?.path).toBe("/src");
});
