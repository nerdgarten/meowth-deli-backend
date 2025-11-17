import { TestService } from "@/services/test.service";
import { IJwtData } from "@/types/auth/jwt";
import { Role } from "@/types/role";
import Test from "supertest/lib/test";


describe("TestService", () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  })

  it("formats middle context correctly (to a response strnig)", async () => {
    const user: IJwtData = {
      id: 12345,
      email: "userexample@gmail.com",
      role: Role.driver,
    };

    await expect(service.testMiddleware(user)).resolves.toBe("User ID: 12345, Email: userexample@gmail.com, Role: driver");
  });

  it("handles empty user data", async () => {
    const user: IJwtData = {
      id: 0,
      email: "",
      role: Role.driver,
    };

    await expect(service.testMiddleware(user)).resolves.toBe("User ID: 0, Email: , Role: driver");
  });

  it("reflects differeing user payloads", async () => {
    const user: IJwtData = {
      id: 123,
      email: "differentuser@example.com",
      role: Role.customer,
    };
    await expect(service.testMiddleware(user)).resolves.toBe("User ID: 123, Email: differentuser@example.com, Role: customer");
  });

})