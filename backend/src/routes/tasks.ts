import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ tasks });
  } catch (e) {
    console.error("Tasks list error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const { title, description } = req.body || {};
    if (!title || !description)
      return res.status(400).json({ message: "Missing fields" });
    const task = await prisma.task.create({
      data: { userId, title, description },
    });
    return res.status(201).json({ task });
  } catch (e) {
    console.error("Task create error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id" });
    const { title, description, completed } = req.body || {};
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId)
      return res.status(404).json({ message: "Not found" });
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title || existing.title,
        description: description || existing.description,
        completed: completed !== undefined ? completed : existing.completed,
      },
    });
    return res.status(200).json({ task });
  } catch (e) {
    console.error("Task update error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id" });
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId)
      return res.status(404).json({ message: "Not found" });
    await prisma.task.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Task delete error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
