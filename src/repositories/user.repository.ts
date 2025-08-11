export class UserRepository {
  async getUser(userId: string) {
    return {
      name: "John Doe",
      id: userId,
    };
  }
}
