import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import {
  createToken,
  setAuthCookie,
  clearAuthCookie,
  getSession,
} from "../auth";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = createToken(user.id, user.email);
    setAuthCookie(res, token);

    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ error: "An error occurred during sign up" });
  }
});

// POST /api/auth/signin
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = createToken(user.id, user.email);
    setAuthCookie(res, token);

    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ error: "An error occurred during sign in" });
  }
});

// POST /api/auth/signout
router.post("/signout", (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

// GET /api/auth/me
router.get("/me", async (req: Request, res: Response) => {
  const session = getSession(req);
  if (!session) {
    res.json({ user: null });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, createdAt: true },
    });
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

export default router;
