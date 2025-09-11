import request from "supertest";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { AuthController } from "@/controllers/auth.controller";
import AuthService from "@/services/auth.service";
import { AppError } from "@/types/error";
import { UserRole } from "@/types/role";

// Mock the auth service
jest.mock("@/services/auth.service");

const MockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe("AuthController Integration Tests", () => {
  let app: express.Application;
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock service instance
    mockAuthService = {
      signIn: jest.fn(),
      createCustomerUser: jest.fn(),
      createDriverUser: jest.fn(),
      createRestaurantUser: jest.fn(),
      verifyAdminStatus: jest.fn(),
      hashPassword: jest.fn(),
    } as any;

    // Mock the constructor
    MockAuthService.mockImplementation(() => mockAuthService);

    authController = new AuthController();

    // Setup Express app
    app = express();
    app.use(express.json());

    // Simple cookie parser middleware for testing
    app.use((req, res, next) => {
      const cookieHeader = req.headers.cookie;
      req.cookies = {};
      if (cookieHeader) {
        cookieHeader.split(";").forEach((cookie) => {
          const [name, value] = cookie.trim().split("=");
          if (name && value) {
            req.cookies[name] = value;
          }
        });
      }
      next();
    });

    // Setup routes
    app.post("/auth/signin", (req, res) => authController.signIn(req, res));
    app.post("/auth/signup/customer", (req, res) =>
      authController.signUpCustomer(req, res)
    );
    app.post("/auth/signup/driver", (req, res) =>
      authController.signUpDriver(req, res)
    );
    app.post("/auth/signup/restaurant", (req, res) =>
      authController.signUpRestaurant(req, res)
    );
    app.get("/auth/verify-admin", (req, res) =>
      authController.verifyAdminStatus(req, res)
    );
  });

  describe("POST /auth/signin", () => {
    const signInData = {
      email: "test@example.com",
      password: "password123",
      role: UserRole.Customer,
      tel: "1234567890",
    };

    it("should successfully sign in and set cookie", async () => {
      const mockResponse = {
        id: 1,
        email: "test@example.com",
        token: "mock-jwt-token",
      };

      mockAuthService.signIn.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockResponse);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain(
        "token=mock-jwt-token"
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInData);
    });

    it("should return 404 when user not found", async () => {
      mockAuthService.signIn.mockRejectedValue(
        new AppError("User not found", StatusCodes.NOT_FOUND)
      );

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toEqual({ message: "User not found" });
      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInData);
    });

    it("should return 401 when credentials are invalid", async () => {
      mockAuthService.signIn.mockRejectedValue(
        new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED)
      );

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body).toEqual({ message: "Invalid credentials" });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.signIn.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });

    it("should handle missing request body", async () => {
      const response = await request(app)
        .post("/auth/signin")
        .send({})
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /auth/signup/customer", () => {
    const customerData = {
      email: "customer@example.com",
      password: "password123",
      firstname: "John",
      lastname: "Doe",
      tel: "1234567890",
      accepted_term_of_service: true,
      accepted_pdpa: true,
      accepted_cookie_tracking: false,
    };

    it("should successfully create customer user", async () => {
      const mockResponse = {
        id: 1,
        email: "customer@example.com",
        role: UserRole.Customer,
      };

      mockAuthService.createCustomerUser.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/auth/signup/customer")
        .send(customerData)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.createCustomerUser).toHaveBeenCalledWith(
        customerData
      );
    });

    it("should handle duplicate email error", async () => {
      mockAuthService.createCustomerUser.mockRejectedValue(
        new AppError("Email already exists", StatusCodes.CONFLICT)
      );

      const response = await request(app)
        .post("/auth/signup/customer")
        .send(customerData)
        .expect(StatusCodes.CONFLICT);

      expect(response.body).toEqual({ message: "Email already exists" });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.createCustomerUser.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/auth/signup/customer")
        .send(customerData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });

    it("should handle invalid request data", async () => {
      const invalidData = {
        email: "invalid-email",
        // missing required fields
      };

      // Mock service to reject invalid data
      mockAuthService.createCustomerUser.mockRejectedValue(
        new AppError("Invalid email format", StatusCodes.BAD_REQUEST)
      );

      const response = await request(app)
        .post("/auth/signup/customer")
        .send(invalidData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({ message: "Invalid email format" });
    });
  });

  describe("POST /auth/signup/driver", () => {
    const driverData = {
      email: "driver@example.com",
      password: "password123",
      firstname: "Jane",
      lastname: "Smith",
      tel: "1234567890",
      vehicle: "Toyota Camry",
      licence: "ABC123",
      fee_rate: 0.15,
      accepted_term_of_service: true,
      accepted_pdpa: true,
      accepted_cookie_tracking: true,
    };

    it("should successfully create driver user", async () => {
      const mockResponse = {
        id: 2,
        email: "driver@example.com",
        role: UserRole.Driver,
      };

      mockAuthService.createDriverUser.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/auth/signup/driver")
        .send(driverData)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.createDriverUser).toHaveBeenCalledWith(driverData);
    });

    it("should handle service errors", async () => {
      mockAuthService.createDriverUser.mockRejectedValue(
        new AppError("Validation failed", StatusCodes.BAD_REQUEST)
      );

      const response = await request(app)
        .post("/auth/signup/driver")
        .send(driverData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({ message: "Validation failed" });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.createDriverUser.mockRejectedValue(
        new Error("Unexpected error")
      );

      const response = await request(app)
        .post("/auth/signup/driver")
        .send(driverData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /auth/signup/restaurant", () => {
    const restaurantData = {
      email: "restaurant@example.com",
      password: "password123",
      name: "Test Restaurant",
      tel: "1234567890",
      location: "123 Main St",
      detail: "Best food in town",
      fee_rate: 0.2,
      accepted_term_of_service: true,
      accepted_pdpa: true,
      accepted_cookie_tracking: false,
    };

    it("should successfully create restaurant user", async () => {
      const mockResponse = {
        id: 3,
        email: "restaurant@example.com",
        role: UserRole.Restaurant,
      };

      mockAuthService.createRestaurantUser.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/auth/signup/restaurant")
        .send(restaurantData)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.createRestaurantUser).toHaveBeenCalledWith(
        restaurantData
      );
    });

    it("should handle service errors", async () => {
      mockAuthService.createRestaurantUser.mockRejectedValue(
        new AppError("Invalid location", StatusCodes.BAD_REQUEST)
      );

      const response = await request(app)
        .post("/auth/signup/restaurant")
        .send(restaurantData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toEqual({ message: "Invalid location" });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.createRestaurantUser.mockRejectedValue(
        new Error("Database connection lost")
      );

      const response = await request(app)
        .post("/auth/signup/restaurant")
        .send(restaurantData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /auth/verify-admin", () => {
    it("should successfully verify admin status with valid token", async () => {
      const mockResponse = {
        isAdmin: true,
        userId: 1,
        email: "admin@example.com",
      };

      mockAuthService.verifyAdminStatus.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get("/auth/verify-admin")
        .set("Cookie", "token=valid-admin-token")
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.verifyAdminStatus).toHaveBeenCalledWith(
        "valid-admin-token"
      );
    });

    it("should return 401 when token is missing", async () => {
      mockAuthService.verifyAdminStatus.mockRejectedValue(
        new AppError("Unauthorized", StatusCodes.UNAUTHORIZED)
      );

      const response = await request(app)
        .get("/auth/verify-admin")
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body).toEqual({ message: "Unauthorized" });
      expect(mockAuthService.verifyAdminStatus).toHaveBeenCalledWith(undefined);
    });

    it("should return 403 when user is not admin", async () => {
      mockAuthService.verifyAdminStatus.mockRejectedValue(
        new AppError("Forbidden", StatusCodes.FORBIDDEN)
      );

      const response = await request(app)
        .get("/auth/verify-admin")
        .set("Cookie", "token=customer-token")
        .expect(StatusCodes.FORBIDDEN);

      expect(response.body).toEqual({ message: "Forbidden" });
      expect(mockAuthService.verifyAdminStatus).toHaveBeenCalledWith(
        "customer-token"
      );
    });

    it("should return 401 for invalid tokens", async () => {
      mockAuthService.verifyAdminStatus.mockRejectedValue(
        new AppError("Unauthorized", StatusCodes.UNAUTHORIZED)
      );

      const response = await request(app)
        .get("/auth/verify-admin")
        .set("Cookie", "token=invalid-token")
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 500 for unexpected errors", async () => {
      mockAuthService.verifyAdminStatus.mockRejectedValue(
        new Error("JWT library error")
      );

      const response = await request(app)
        .get("/auth/verify-admin")
        .set("Cookie", "token=some-token")
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });
});
