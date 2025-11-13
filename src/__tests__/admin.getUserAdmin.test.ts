jest.mock("@/services/admin.service", () => {
  return jest.fn().mockImplementation(() => ({
    getUserAdmin: jest.fn(),
  }));
});

import { AdminController } from "@/controllers/admin.controller";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/types/error";

// Utility type and helper for mocking Express response
type MockRes = {
  status: jest.Mock<any, any>;
  json: jest.Mock<any, any>;
};

function createMockRes(): MockRes {
  const res: Partial<MockRes> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as MockRes;
}

describe("AdminController.getUserAdmin (fast isolated test)", () => {
  let controller: AdminController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdminController();

    // Replace the service inside controller with mock
    (controller as any).adminService = {
      getUserAdmin: jest.fn(),
    };
  });

  it("should respond 200 with admin users on success", async () => {
    const now = new Date();
    const mockData = [
      {
        id: 1,
        email: "admin@example.com",
        created_at: now,
        updated_at: now,
        roles: [
          {
            created_at: now,
            updated_at: now,
            role: "admin",
            user_id: 1,
          },
        ],
      },
    ];

    (controller as any).adminService.getUserAdmin.mockResolvedValue({
      success: true,
      message: "Admin users retrieved successfully",
      data: mockData,
    });

    const res = createMockRes();
    await controller.getUserAdmin({} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Admin users retrieved successfully",
      data: mockData,
    });
  });

  it("should respond 404 when AppError is thrown", async () => {
    // ✅ Use real AppError so instanceof AppError works
    const appError = new AppError("No admin users found", 404);
    (controller as any).adminService.getUserAdmin.mockRejectedValue(appError);

    const res = createMockRes();
    await controller.getUserAdmin({} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No admin users found",
    });
  });

  it("should respond 500 on unexpected error", async () => {
    (controller as any).adminService.getUserAdmin.mockRejectedValue(
      new Error("Unexpected crash")
    );

    const res = createMockRes();
    await controller.getUserAdmin({} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});
