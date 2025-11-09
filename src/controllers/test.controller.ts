import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { PrismaClient } from "@/generated/prisma/client";
import { fakeUser, fakeRestaurant, fakeDish } from "@/utils/fake";

const prisma = new PrismaClient();

async function main() {

  for (let i = 0; i < 100; i++) {
    const userData = fakeUser();
    const restaurantData = fakeRestaurant();
    const restaurant = await prisma.user.create({
      data: {
        ...userData,
        roles: { create: { role: "restaurant" } },
        restaurant: { create: restaurantData },
      },
      include: {
        roles: true,
        restaurant: true,
      },
    });
    // Create 10 fake dishes for each restaurant
    for (let j = 0; j < 10; j++) {
      const dishData = fakeDish();
      await prisma.dish.create({
        data: { ...dishData, restaurant_id: restaurant.id },
      });
    }
  }
}

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
  async seedDatabase(req: Request, res: Response) {
    try {
      main();
      res.status(StatusCodes.OK).json({ message: "Database seeded successfully" });
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

