import { Router, Request, Response } from "express";
import { streamText, appendResponseMessages } from "ai";
import { VirtualFileSystem } from "../file-system";
import { buildStrReplaceTool, buildFileManagerTool } from "../tools";
import { getLanguageModel, isMockProvider } from "../provider";
import { getSession } from "../auth";
import { prisma } from "../prisma";

const SYSTEM_PROMPT = `You are a React + TypeScript component generator. When asked to create a component:
1. Create an App.tsx entry point that imports and renders the component
2. Create component files as .tsx in a /components directory
3. Use Tailwind CSS for styling
4. Make components interactive with React hooks when appropriate
5. Use proper TypeScript types and interfaces for props, state, and event handlers
6. Use the str_replace_editor tool to create and modify files
7. Always use .tsx file extensions, never .jsx`;

const router = Router();

// POST /api/chat
router.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, files, projectId } = req.body;

    const allMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ];

    const fileSystem = new VirtualFileSystem();
    if (files) {
      fileSystem.deserializeFromNodes(files);
    }

    const model = getLanguageModel();
    const mock = isMockProvider();

    const result = streamText({
      model,
      messages: allMessages,
      maxTokens: 10_000,
      maxSteps: mock ? 4 : 40,
      onError: (err: any) => {
        console.error(err);
      },
      tools: {
        str_replace_editor: buildStrReplaceTool(fileSystem),
        file_manager: buildFileManagerTool(fileSystem),
      },
      onFinish: async ({ response }) => {
        if (projectId) {
          try {
            const session = getSession(req);
            if (!session) return;

            const responseMessages = response.messages || [];
            const combined = appendResponseMessages({
              messages: [...messages],
              responseMessages,
            });

            // Derive a project name from the first user message
            const firstUserMsg = messages.find((m: any) => m.role === "user");
            const derivedName = firstUserMsg
              ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "")
              : undefined;

            const updateData: any = {
              messages: JSON.stringify(combined),
              data: JSON.stringify(fileSystem.serialize()),
            };

            // Only rename if this is the first message (only 1 user message)
            const userMessages = messages.filter((m: any) => m.role === "user");
            if (derivedName && userMessages.length === 1) {
              updateData.name = derivedName;
            }

            await prisma.project.update({
              where: { id: projectId, userId: session.userId },
              data: updateData,
            });
          } catch (error) {
            console.error("Failed to save project:", error);
          }
        }
      },
    });

    const dataStream = result.toDataStreamResponse();

    // Forward the stream response
    res.setHeader("Content-Type", dataStream.headers.get("content-type") || "text/plain");
    
    if (dataStream.body) {
      const reader = dataStream.body.getReader();
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          res.write(value);
        }
      };
      pump().catch((err) => {
        console.error("Stream error:", err);
        res.end();
      });
    } else {
      res.end();
    }
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat request failed" });
  }
});

export default router;
