import { Router, Request, Response } from "express";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join, resolve } from "path";

const router = Router();

const OUTPUT_DIR = resolve(process.cwd(), "generated");

// POST /api/save — save generated files to disk
router.post("/", async (req: Request, res: Response) => {
  try {
    const { files } = req.body as {
      files: Record<string, string>;
    };

    if (!files || Object.keys(files).length === 0) {
      res.status(400).json({ error: "No files to save" });
      return;
    }

    const savedFiles: string[] = [];

    for (const [filePath, content] of Object.entries(files)) {
      // Normalize path: remove leading slash, prefix with output dir
      const normalizedPath = filePath.replace(/^\/+/, "");
      const fullPath = join(OUTPUT_DIR, normalizedPath);

      // Ensure directory exists
      mkdirSync(dirname(fullPath), { recursive: true });

      // Write file
      writeFileSync(fullPath, content, "utf-8");
      savedFiles.push(normalizedPath);
    }

    console.log(`Saved ${savedFiles.length} files to ${OUTPUT_DIR}`);
    res.json({
      success: true,
      outputDir: OUTPUT_DIR,
      files: savedFiles,
    });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save files" });
  }
});

export default router;
