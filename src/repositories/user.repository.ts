import { prisma } from "@/libs/prisma";
import { Prisma } from "@/generated/prisma/client";

export default class UserRepository {
  async getUsers() {
    return await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async createCustomerUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: data,
      include: { customer: true },
    });
  }

  async createDriverUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: data,
      include: { driver: true },
    });
  }

  async createRestaurantUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: data,
      include: { restaurant: true },
    });
  }

  async updateUserPassword(userId: number, hashedPassword: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }
}
