import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { getSession, requireAuth } from "../auth";

const router = Router();

// GET /api/projects — list user's projects
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).session;

  try {
    const projects = await prisma.project.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /api/projects/:id — get a single project
router.get("/:id", async (req: Request, res: Response) => {
  const session = getSession(req);

  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // Only return project if it belongs to the user
    if (project.userId && (!session || project.userId !== session.userId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.json({
      project: {
        ...project,
        messages: JSON.parse(project.messages),
        data: JSON.parse(project.data),
      },
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST /api/projects — create a new project
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).session;

  try {
    const { name, messages = [], data = {} } = req.body;

    const project = await prisma.project.create({
      data: {
        name: name || `New Design #${~~(Math.random() * 100000)}`,
        userId: session.userId,
        messages: JSON.stringify(messages),
        data: JSON.stringify(data),
      },
    });

    res.json({ project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

export default router;
