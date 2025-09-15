import { IJwtData } from "@/types/auth/jwt";

export class TestService {
  async testMiddleware(user: IJwtData) {
    return `User ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`;
  }
}
