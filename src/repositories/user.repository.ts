import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
import { Role } from "@/types/role";

export default class UserRepository {
  async getUsers() {
    return await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
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

  async deleteUserById(userId: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        is_deleted: true,
      },
    });
  }

  async getUsersWithProfiles(role?: string, limit?: number, offset?: number) {
    const whereClause: any = { is_deleted: false };
    if (role) whereClause.role = role as any;
    const take = typeof limit === "number" && limit > 0 ? limit : undefined;
    const skip = typeof offset === "number" && offset >= 0 ? offset : undefined;
    const data = await prisma.user.findMany({
      where: whereClause,
      include: { customer: true, driver: true, restaurant: true },
      orderBy: { id: "asc" },
      take,
      skip,
    });
    const total = await prisma.user.count({ where: whereClause });
    return { data, total };
  }
}
