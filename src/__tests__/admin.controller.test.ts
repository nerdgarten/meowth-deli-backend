import request from "supertest";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { AdminController } from "@/controllers/admin.controller";
import AdminService from "@/services/admin.service";
import { AppError } from "@/types/error";
import { AdminVerificationStatus } from "@/types/admin/verification";

// Mock the admin service
jest.mock("@/services/admin.service");

const MockAdminService = AdminService as jest.MockedClass<typeof AdminService>;

describe("AdminController", () => {
  let app: express.Application;
  let adminController: AdminController;
  let mockAdminService: jest.Mocked<AdminService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock service instance
    mockAdminService = {
      listRestaurants: jest.fn(),
      verifyRestaurant: jest.fn(),
      listDrivers: jest.fn(),
      verifyDriver: jest.fn(),
    } as any;

    // Mock the constructor
    MockAdminService.mockImplementation(() => mockAdminService);

    adminController = new AdminController();

    // Setup Express app
    app = express();
    app.use(express.json());

    // Setup routes
    app.get("/admin/restaurants", (req, res) =>
      adminController.listRestaurants(req, res)
    );
    app.put("/admin/restaurants/:id/verify", (req, res) =>
      adminController.verifyRestaurant(req, res)
    );
    app.get("/admin/drivers", (req, res) =>
      adminController.listDrivers(req, res)
    );
    app.put("/admin/drivers/:id/verify", (req, res) =>
      adminController.verifyDriver(req, res)
    );
  });

  describe("GET /admin/restaurants", () => {
    it("should list all restaurants successfully", async () => {
      const mockRestaurants = [
        {
          id: 1,
          verification_status: "pending" as const,
          is_available: false,
          name: "Test Restaurant 1",
          location: "Location 1",
          detail: "Detail 1",
          fee_rate: 0.1,
          tel: "1234567890",
          user: {
            id: 1,
            email: "restaurant1@example.com",
            roles: [{ user_id: 1, role: "restaurant" as const }],
          },
        },
        {
          id: 2,
          verification_status: "success" as const,
          is_available: true,
          name: "Test Restaurant 2",
          location: "Location 2",
          detail: "Detail 2",
          fee_rate: 0.15,
          tel: "0987654321",
          user: {
            id: 2,
            email: "restaurant2@example.com",
            roles: [{ user_id: 2, role: "restaurant" as const }],
          },
        },
      ];

      mockAdminService.listRestaurants.mockResolvedValue(
        mockRestaurants as any
      );

      const response = await request(app)
        .get("/admin/restaurants")
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockRestaurants);
      expect(mockAdminService.listRestaurants).toHaveBeenCalledWith(undefined);
    });

    it("should list restaurants with status filter", async () => {
      const mockRestaurants = [
        {
          id: 1,
          verification_status: "pending" as const,
          is_available: false,
          name: "Pending Restaurant",
          location: "Location 1",
          detail: "Detail 1",
          fee_rate: 0.1,
          tel: "1234567890",
          user: {
            id: 1,
            email: "pending@example.com",
            roles: [{ user_id: 1, role: "restaurant" as const }],
          },
        },
      ];

      mockAdminService.listRestaurants.mockResolvedValue(
        mockRestaurants as any
      );

      const response = await request(app)
        .get("/admin/restaurants?status=pending")
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockRestaurants);
      expect(mockAdminService.listRestaurants).toHaveBeenCalledWith(
        AdminVerificationStatus.PENDING
      );
    });

    it("should handle service errors", async () => {
      mockAdminService.listRestaurants.mockRejectedValue(
        new AppError("Database error", StatusCodes.INTERNAL_SERVER_ERROR)
      );

      const response = await request(app)
        .get("/admin/restaurants")
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Database error" });
    });

    it("should handle unexpected errors", async () => {
      mockAdminService.listRestaurants.mockRejectedValue(
        new Error("Unexpected error")
      );

      const response = await request(app)
        .get("/admin/restaurants")
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PUT /admin/restaurants/:id/verify", () => {
    it("should verify restaurant successfully", async () => {
      const mockResult = {
        id: 1,
        name: "Test Restaurant",
        status: AdminVerificationStatus.APPROVED,
      };

      mockAdminService.verifyRestaurant.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .put("/admin/restaurants/1/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.OK);

      expect(response.body).toEqual({
        message: `Restaurant status updated to ${AdminVerificationStatus.APPROVED} successfully`,
        data: mockResult,
      });
      expect(mockAdminService.verifyRestaurant).toHaveBeenCalledWith(
        1,
        AdminVerificationStatus.APPROVED
      );
    });

    it("should reject restaurant successfully", async () => {
      const mockResult = {
        id: 1,
        name: "Test Restaurant",
        status: AdminVerificationStatus.REJECTED,
      };

      mockAdminService.verifyRestaurant.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .put("/admin/restaurants/1/verify")
        .send({ status: AdminVerificationStatus.REJECTED })
        .expect(StatusCodes.OK);

      expect(response.body).toEqual({
        message: `Restaurant status updated to ${AdminVerificationStatus.REJECTED} successfully`,
        data: mockResult,
      });
      expect(mockAdminService.verifyRestaurant).toHaveBeenCalledWith(
        1,
        AdminVerificationStatus.REJECTED
      );
    });

    it("should handle invalid restaurant ID", async () => {
      mockAdminService.verifyRestaurant.mockRejectedValue(
        new AppError("Restaurant not found", StatusCodes.NOT_FOUND)
      );

      const response = await request(app)
        .put("/admin/restaurants/999/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toEqual({ message: "Restaurant not found" });
      expect(mockAdminService.verifyRestaurant).toHaveBeenCalledWith(
        999,
        AdminVerificationStatus.APPROVED
      );
    });

    it("should handle invalid status", async () => {
      // Mock service to throw AppError for invalid status
      mockAdminService.verifyRestaurant.mockRejectedValue(
        new AppError(
          "Invalid status. Allowed: pending, approved, rejected",
          StatusCodes.BAD_REQUEST
        )
      );

      const response = await request(app)
        .put("/admin/restaurants/1/verify")
        .send({ status: "invalid_status" })
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({
        message: "Invalid status. Allowed: pending, approved, rejected",
      });
    });

    it("should handle missing status in request body", async () => {
      // Mock service to handle undefined status gracefully
      const mockResult = {
        id: 1,
        name: "Test Restaurant",
        image: null,
        tel: "1234567890",
        verification_status: "pending" as const,
        is_available: false,
        fee_rate: 10,
        location: "Test Location",
        detail: null,
        user: {
          id: 1,
          email: "test@restaurant.com",
          roles: [{ role: "restaurant" as const, user_id: 1 }],
        },
      };

      mockAdminService.verifyRestaurant.mockResolvedValue(mockResult);

      const response = await request(app)
        .put("/admin/restaurants/1/verify")
        .send({})
        .expect(StatusCodes.OK);

      expect(response.body.message).toContain("Restaurant status updated");
    });

    it("should handle non-numeric ID", async () => {
      // Mock service to handle NaN ID gracefully or throw an error
      mockAdminService.verifyRestaurant.mockRejectedValue(
        new AppError("Invalid restaurant ID", StatusCodes.BAD_REQUEST)
      );

      const response = await request(app)
        .put("/admin/restaurants/abc/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({ message: "Invalid restaurant ID" });
    });
  });

  describe("GET /admin/drivers", () => {
    it("should list all drivers successfully", async () => {
      const mockDrivers = [
        {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          email: "driver1@example.com",
          status: AdminVerificationStatus.PENDING,
        },
        {
          id: 2,
          firstname: "Jane",
          lastname: "Smith",
          email: "driver2@example.com",
          status: AdminVerificationStatus.APPROVED,
        },
      ];

      mockAdminService.listDrivers.mockResolvedValue(mockDrivers as any);

      const response = await request(app)
        .get("/admin/drivers")
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockDrivers);
      expect(mockAdminService.listDrivers).toHaveBeenCalledWith(undefined);
    });

    it("should list drivers with status filter", async () => {
      const mockDrivers = [
        {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          email: "driver@example.com",
          status: AdminVerificationStatus.REJECTED,
        },
      ];

      mockAdminService.listDrivers.mockResolvedValue(mockDrivers as any);

      const response = await request(app)
        .get("/admin/drivers?status=rejected")
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockDrivers);
      expect(mockAdminService.listDrivers).toHaveBeenCalledWith(
        AdminVerificationStatus.REJECTED
      );
    });

    it("should handle service errors", async () => {
      mockAdminService.listDrivers.mockRejectedValue(
        new AppError("Access denied", StatusCodes.FORBIDDEN)
      );

      const response = await request(app)
        .get("/admin/drivers")
        .expect(StatusCodes.FORBIDDEN);

      expect(response.body).toEqual({ message: "Access denied" });
    });

    it("should handle unexpected errors", async () => {
      mockAdminService.listDrivers.mockRejectedValue(
        new Error("Network error")
      );

      const response = await request(app)
        .get("/admin/drivers")
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PUT /admin/drivers/:id/verify", () => {
    it("should verify driver successfully", async () => {
      const mockResult = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        status: AdminVerificationStatus.APPROVED,
      };

      mockAdminService.verifyDriver.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .put("/admin/drivers/1/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.OK);

      expect(response.body).toEqual({
        message: `Driver status updated to ${AdminVerificationStatus.APPROVED} successfully`,
        data: mockResult,
      });
      expect(mockAdminService.verifyDriver).toHaveBeenCalledWith(
        1,
        AdminVerificationStatus.APPROVED
      );
    });

    it("should reject driver successfully", async () => {
      const mockResult = {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        status: AdminVerificationStatus.REJECTED,
      };

      mockAdminService.verifyDriver.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .put("/admin/drivers/2/verify")
        .send({ status: AdminVerificationStatus.REJECTED })
        .expect(StatusCodes.OK);

      expect(response.body).toEqual({
        message: `Driver status updated to ${AdminVerificationStatus.REJECTED} successfully`,
        data: mockResult,
      });
      expect(mockAdminService.verifyDriver).toHaveBeenCalledWith(
        2,
        AdminVerificationStatus.REJECTED
      );
    });

    it("should handle invalid driver ID", async () => {
      mockAdminService.verifyDriver.mockRejectedValue(
        new AppError("Driver not found", StatusCodes.NOT_FOUND)
      );

      const response = await request(app)
        .put("/admin/drivers/999/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toEqual({ message: "Driver not found" });
      expect(mockAdminService.verifyDriver).toHaveBeenCalledWith(
        999,
        AdminVerificationStatus.APPROVED
      );
    });

    it("should handle validation errors", async () => {
      mockAdminService.verifyDriver.mockRejectedValue(
        new AppError("Invalid verification status", StatusCodes.BAD_REQUEST)
      );

      const response = await request(app)
        .put("/admin/drivers/1/verify")
        .send({ status: "invalid" })
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({ message: "Invalid verification status" });
    });

    it("should handle missing request body", async () => {
      const response = await request(app)
        .put("/admin/drivers/1/verify")
        .send()
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });

    it("should handle concurrent verification attempts", async () => {
      mockAdminService.verifyDriver.mockRejectedValue(
        new AppError("Driver is already being processed", StatusCodes.CONFLICT)
      );

      const response = await request(app)
        .put("/admin/drivers/1/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.CONFLICT);

      expect(response.body).toEqual({
        message: "Driver is already being processed",
      });
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle malformed JSON in request body", async () => {
      await request(app)
        .put("/admin/restaurants/1/verify")
        .set("Content-Type", "application/json")
        .send("{ invalid json")
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("should handle very large IDs", async () => {
      const largeId = Number.MAX_SAFE_INTEGER;

      mockAdminService.verifyRestaurant.mockRejectedValue(
        new AppError("Restaurant not found", StatusCodes.NOT_FOUND)
      );

      const response = await request(app)
        .put(`/admin/restaurants/${largeId}/verify`)
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toEqual({ message: "Restaurant not found" });
    });

    it("should handle negative IDs", async () => {
      // Mock service to handle negative ID
      mockAdminService.verifyRestaurant.mockRejectedValue(
        new AppError("Invalid restaurant ID", StatusCodes.BAD_REQUEST)
      );

      const response = await request(app)
        .put("/admin/restaurants/-1/verify")
        .send({ status: AdminVerificationStatus.APPROVED })
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({ message: "Invalid restaurant ID" });
    });

    it("should handle empty query parameters gracefully", async () => {
      mockAdminService.listRestaurants.mockResolvedValue([]);

      const response = await request(app)
        .get("/admin/restaurants?status=")
        .expect(StatusCodes.OK);

      expect(response.body).toEqual([]);
    });
  });
});
