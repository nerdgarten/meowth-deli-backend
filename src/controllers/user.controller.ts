import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

const service = new UserService();

export async function getUser(req: Request, res: Response): Promise<void> {
  const userId = req.params.id;
  const user = service.getUser(userId);
  res.json(user);
}
