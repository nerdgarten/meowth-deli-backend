import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role, VerificationStatus } from "@/generated/prisma/client";
import { AdminController } from "@/controllers/admin.controller";
import AdminService from "@/services/admin.service";
import { AdminVerificationStatus } from "@/types/admin/verification";
import { AppError } from "@/types/error";

// Mock the AdminService
jest.mock("@/services/admin.service");
const MockAdminService = AdminService as jest.MockedClass<typeof AdminService>;

describe("AdminController", () => {
  let adminController: AdminController;
  let mockAdminService: jest.Mocked<AdminService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  const mockUserRole = {
    user_id: 1,
    role: Role.restaurant,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRestaurantBase = {
    id: 1,
    name: "Restaurant 1",
    verification_status: VerificationStatus.pending,
    is_available: false,
    location: "123 Main St",
    detail: "Great food",
    tel: "555-0001",
    image: null,
    fee_rate: 0.1,
    created_at: new Date(),
    updated_at: new Date(),
    user: {
      id: 1,
      email: "restaurant1@test.com",
      roles: [mockUserRole],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    mockRequest = {
      params: {},
      query: {},
      body: {},
    };

    mockAdminService = {
      listRestaurants: jest.fn(),
      verifyRestaurant: jest.fn(),
      listDrivers: jest.fn(),
      verifyDriver: jest.fn(),
    } as any;

    MockAdminService.mockImplementation(() => mockAdminService);
    adminController = new AdminController();
  });

  describe("verifyRestaurant", () => {
    it("should verify restaurant with approved status", async () => {
      const mockSuccessResponse = {
        success: true,
        message: "Restaurant verification status updated to approved",
        data: {
          ...mockRestaurantBase,
          verification_status: VerificationStatus.approved,
          is_available: true,
          status: VerificationStatus.approved  // Add the status field
        },
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = { status: AdminVerificationStatus.APPROVED };
      mockAdminService.verifyRestaurant.mockResolvedValue(mockSuccessResponse);

      await adminController.verifyRestaurant(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockAdminService.verifyRestaurant).toHaveBeenCalledWith(
        1,
        AdminVerificationStatus.APPROVED
      );
      expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(mockSuccessResponse);
    });

    it("should handle restaurant not found error", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = { status: AdminVerificationStatus.APPROVED };
      
      const error = new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
      mockAdminService.verifyRestaurant.mockRejectedValue(error);

      await adminController.verifyRestaurant(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: "Restaurant not found"
      });
    });
  });
});