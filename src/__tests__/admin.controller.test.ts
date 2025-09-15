import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role, VerificationStatus } from "@/generated/prisma/client";
import { AdminController } from "@/controllers/admin.controller";
import AdminService from "@/services/admin.service";
import { AppError } from "@/types/error";

jest.mock("@/services/admin.service");
const MockAdminService = AdminService as jest.MockedClass<typeof AdminService>;

describe("AdminController", () => {
  let adminController: AdminController;
  let mockAdminService: jest.Mocked<AdminService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  // Base mock data
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

  const mockDriverBase = {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    verification_status: VerificationStatus.pending,
    is_available: false,
    image: null,
    vehicle: "Car",
    fee_rate: 0.1,
    licence: "123456",
    tel: "555-0002",
    created_at: new Date(),
    updated_at: new Date(),
    user: {
      id: 1,
      email: "driver1@test.com",
      roles: [{ ...mockUserRole, role: Role.driver }],
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

  describe("Restaurant Management", () => {
    describe("GET /restaurants", () => {
      it("should list all restaurants", async () => {
        mockAdminService.listRestaurants.mockResolvedValue([mockRestaurantBase]);
        
        await adminController.listRestaurants(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
        expect(responseJson).toHaveBeenCalledWith([mockRestaurantBase]);
      });

      it("should filter restaurants by status", async () => {
        mockRequest.query = { status: VerificationStatus.pending };
        mockAdminService.listRestaurants.mockResolvedValue([mockRestaurantBase]);

        await adminController.listRestaurants(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockAdminService.listRestaurants).toHaveBeenCalledWith(VerificationStatus.pending);
        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
      });
    });

    describe("PATCH /restaurants/verify", () => {
      it("should verify restaurant with approved status", async () => {
        const mockSuccessResponse = {
          success: true,
          message: "Restaurant verification status updated to approved",
          data: {
            ...mockRestaurantBase,
            verification_status: VerificationStatus.approved,
            is_available: true,
            status: VerificationStatus.approved
          },
        };

        mockRequest.body = { 
          id: 1,
          status: VerificationStatus.approved 
        };
        
        mockAdminService.verifyRestaurant.mockResolvedValue(mockSuccessResponse);

        await adminController.verifyRestaurant(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockAdminService.verifyRestaurant).toHaveBeenCalledWith(
          1,
          VerificationStatus.approved
        );
        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
        expect(responseJson).toHaveBeenCalledWith(mockSuccessResponse);
      });

      it("should handle restaurant not found error", async () => {
        mockRequest.body = { 
          id: 999,
          status: VerificationStatus.approved 
        };
        
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

  describe("Driver Management", () => {
    describe("GET /drivers", () => {
      it("should list all drivers", async () => {
        mockAdminService.listDrivers.mockResolvedValue([mockDriverBase]);
        
        await adminController.listDrivers(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
        expect(responseJson).toHaveBeenCalledWith([mockDriverBase]);
      });

      it("should filter drivers by status", async () => {
        mockRequest.query = { status: VerificationStatus.pending };
        mockAdminService.listDrivers.mockResolvedValue([mockDriverBase]);

        await adminController.listDrivers(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockAdminService.listDrivers).toHaveBeenCalledWith(VerificationStatus.pending);
        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
      });
    });

    describe("PATCH /drivers/verify", () => {
      it("should verify driver with approved status", async () => {
        const mockDriverResponse = {
          success: true,
          message: "Driver verification status updated to approved",
          data: {
            ...mockDriverBase,
            verification_status: VerificationStatus.approved,
            is_available: true,
            status: VerificationStatus.approved
          },
        };

        mockRequest.body = { 
          id: 1,
          status: VerificationStatus.approved 
        };
        
        mockAdminService.verifyDriver.mockResolvedValue(mockDriverResponse);

        await adminController.verifyDriver(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockAdminService.verifyDriver).toHaveBeenCalledWith(
          1,
          VerificationStatus.approved
        );
        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.OK);
        expect(responseJson).toHaveBeenCalledWith(mockDriverResponse);
      });

      it("should handle driver not found error", async () => {
        mockRequest.body = { 
          id: 999,
          status: VerificationStatus.pending 
        };
        
        const error = new AppError("Driver not found", StatusCodes.NOT_FOUND);
        mockAdminService.verifyDriver.mockRejectedValue(error);

        await adminController.verifyDriver(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(responseStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(responseJson).toHaveBeenCalledWith({
          success: false,
          message: "Driver not found"
        });
      });
    });
  });
});