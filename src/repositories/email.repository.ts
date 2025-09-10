
import database from "../config/db.js";

export default class EmailRepository {

  async findUniqueToken(token: string) {
    return database.verifyToken.findUnique({
      where: { token },
    });
  }

  async createToken(userId: number, token: string, expiresAt: Date) {
    return database.verifyToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async deleteToken(token: string) {
    return database.verifyToken.delete({
      where: { token },
    });
  }
}
