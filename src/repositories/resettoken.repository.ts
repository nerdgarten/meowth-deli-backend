import { prisma } from "@/libs/prisma";
import { ResetToken } from "@/types/auth/token";
export default class ResetTokenRepository {


  async createResetToken(userId: number, tokenData: ResetToken) {
    return prisma.resetToken.create({
      data: {
        token: tokenData.token,
        user_id: userId,
        expires_at: tokenData.expires,
      },
    });
  }
  async findResetTokenByToken(token: string) {
    return prisma.resetToken.findFirst({
      where: { 
        token: token,
        expires_at: {
          gt: new Date(),
        },
       },
      include: {
        user: true,
      },
    });
  }
  async deleteResetToken(token: string) {
    return prisma.resetToken.deleteMany({
      where: { token: token },
    });
  }
}
