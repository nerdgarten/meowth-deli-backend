
import { prisma } from "@/libs/prisma";

export default class EmailRepository {

  async findUniqueToken(token: string) {
    return prisma.verifyToken.findUnique({
      where: { token },
    });
  }

  async createToken(userId: number, token: string, expiresAt: Date) {
    return prisma.verifyToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async deleteToken(token: string) {
    return prisma.verifyToken.delete({
      where: { token },
    });
  }
}
