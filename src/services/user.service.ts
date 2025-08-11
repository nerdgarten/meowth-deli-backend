import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
}
