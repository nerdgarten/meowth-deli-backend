import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { TestService } from "@/services/test.service";
import { AppError } from "@/types/error";

export class TestController {
  private testService;

  constructor() {
    this.testService = new TestService();
  }

  async testMiddleware(req: Request, res: Response) {
    try {
      const user = req.user!;

      const result = await this.testService.testMiddleware(user);

      res.status(StatusCodes.OK).json({
        message: "Middleware test successful",
        data: result,
      });
    } catch (e: unknown) {
      if (e instanceof AppError) {
        res.status(e.statusCode).json({ message: e.message });
        return;
      }

      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
