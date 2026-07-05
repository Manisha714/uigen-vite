import { Router, Request, Response } from "express";
import { readdirSync, readFileSync, statSync } from "fs";
import { join, resolve, relative } from "path";

const router = Router();

const GENERATED_DIR = resolve(process.cwd(), "generated");

function walkDir(dir: string): { path: string; content: string }[] {
  const results: { path: string; content: string }[] = [];

  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        results.push(...walkDir(fullPath));
      } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
        const relPath = "/" + relative(GENERATED_DIR, fullPath);
        const content = readFileSync(fullPath, "utf-8");
        results.push({ path: relPath, content });
      }
    }
  } catch {
    // Directory might not exist
  }

  return results;
}

// GET /api/gallery — list all generated components
router.get("/", async (_req: Request, res: Response) => {
  try {
    const files = walkDir(GENERATED_DIR);
    res.json({ files });
  } catch (error) {
    console.error("Gallery error:", error);
    res.status(500).json({ error: "Failed to read generated files" });
  }
});

export default router;
