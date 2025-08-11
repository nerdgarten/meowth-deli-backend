import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(userId: string) {
    const user = await this.userRepository.getUser(userId);
    return user;
  }
}
