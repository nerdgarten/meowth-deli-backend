import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import AuthService from "@/services/auth.service";
import AuthRepository from "@/repositories/auth.repository";
import { AppError } from "@/types/error";
import { UserRole } from "@/types/role";
import {
  CustomerSignUpBody,
  DriverSignUpBody,
  RestaurantSignUpBody,
  SignInBody,
} from "@/types/auth/post";

// Mock dependencies
jest.mock("@/repositories/auth.repository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockAuthRepository = AuthRepository as jest.MockedClass<
  typeof AuthRepository
>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe("AuthService", () => {
  let authService: AuthService;
  let mockRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock repository instance
    mockRepository = {
      findUserByEmail: jest.fn(),
      createCustomerUser: jest.fn(),
      createDriverUser: jest.fn(),
      createRestaurantUser: jest.fn(),
      findUserByEmailAndPassword: jest.fn(),
    } as any;

    // Mock the constructor
    mockAuthRepository.mockImplementation(() => mockRepository);

    authService = new AuthService();

    // Set up environment variable
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    // Clean up environment variable
    if ("JWT_SECRET" in process.env) {
      delete (process.env as any).JWT_SECRET;
    }
  });

  describe("signIn", () => {
    const signInData: SignInBody = {
      email: "test@example.com",
      password: "password123",
      role: UserRole.Customer,
      tel: "1234567890",
    };

    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
      accepted_term_of_service: true,
      accepted_pdpa: true,
      accepted_cookie_tracking: false,
    };

    it("should successfully sign in a user with valid credentials", async () => {
      mockRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue("mock-token" as never);

      const result = await authService.signIn(signInData);

      expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(mockJwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          email: "test@example.com",
          role: UserRole.Customer,
        },
        "test-secret",
        { expiresIn: "1h" }
      );
      expect(result).toEqual({
        id: 1,
        email: "test@example.com",
        token: "mock-token",
      });
    });

    it("should throw error when user is not found", async () => {
      mockRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.signIn(signInData)).rejects.toThrow(
        new AppError("User not found", StatusCodes.NOT_FOUND)
      );

      expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it("should throw error when password is invalid", async () => {
      mockRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(authService.signIn(signInData)).rejects.toThrow(
        new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED)
      );

      expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
  });

  describe("createCustomerUser", () => {
    const customerData: CustomerSignUpBody = {
      email: "customer@example.com",
      password: "password123",
      firstname: "John",
      lastname: "Doe",
      tel: "1234567890",
      accepted_term_of_service: true,
      accepted_pdpa: true,
      accepted_cookie_tracking: false,
    };

    const mockCreatedUser = {
      id: 1,
      email: "customer@example.com",
    };

    it("should successfully create a customer user", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockRepository.createCustomerUser.mockResolvedValue(
        mockCreatedUser as any
      );

      const result = await authService.createCustomerUser(customerData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockRepository.createCustomerUser).toHaveBeenCalledWith({
        ...customerData,
        password: "hashedPassword",
      });
      expect(result).toEqual({
        id: 1,
        email: "customer@example.com",
        role: UserRole.Customer,
      });
    });

    it("should handle repository errors", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockRepository.createCustomerUser.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        authService.createCustomerUser(customerData)
      ).rejects.toThrow("Database error");

      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockRepository.createCustomerUser).toHaveBeenCalledWith({
        ...customerData,
        password: "hashedPassword",
      });
    });
  });

  describe("createDriverUser", () => {
    const driverData: DriverSignUpBody = {
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

    const mockCreatedUser = {
      id: 2,
      email: "driver@example.com",
    };

    it("should successfully create a driver user", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockRepository.createDriverUser.mockResolvedValue(mockCreatedUser as any);

      const result = await authService.createDriverUser(driverData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockRepository.createDriverUser).toHaveBeenCalledWith({
        ...driverData,
        password: "hashedPassword",
      });
      expect(result).toEqual({
        id: 2,
        email: "driver@example.com",
        role: UserRole.Driver,
      });
    });

    it("should handle repository errors", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockRepository.createDriverUser.mockRejectedValue(
        new Error("Database error")
      );

      await expect(authService.createDriverUser(driverData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("createRestaurantUser", () => {
    const restaurantData: RestaurantSignUpBody = {
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

    const mockCreatedUser = {
      id: 3,
      email: "restaurant@example.com",
    };

    it("should successfully create a restaurant user", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockRepository.createRestaurantUser.mockResolvedValue(
        mockCreatedUser as any
      );

      const result = await authService.createRestaurantUser(restaurantData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockRepository.createRestaurantUser).toHaveBeenCalledWith({
        ...restaurantData,
        password: "hashedPassword",
      });
      expect(result).toEqual({
        id: 3,
        email: "restaurant@example.com",
        role: UserRole.Restaurant,
      });
    });

    it("should handle repository errors", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockRepository.createRestaurantUser.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        authService.createRestaurantUser(restaurantData)
      ).rejects.toThrow("Database error");
    });
  });

  describe("verifyAdminStatus", () => {
    const mockDecodedToken = {
      id: 1,
      email: "admin@example.com",
      role: "admin",
      iat: 1234567890,
      exp: 1234567890,
    };

    it("should successfully verify admin status with valid token", async () => {
      mockJwt.verify.mockReturnValue(mockDecodedToken as never);

      const result = await authService.verifyAdminStatus("valid-token");

      expect(mockJwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
      expect(result).toEqual({
        isAdmin: true,
        userId: 1,
        email: "admin@example.com",
      });
    });

    it("should throw error when token is not provided", async () => {
      await expect(authService.verifyAdminStatus(undefined)).rejects.toThrow(
        new AppError("Unauthorized", StatusCodes.UNAUTHORIZED)
      );

      expect(mockJwt.verify).not.toHaveBeenCalled();
    });

    it("should throw error when token is empty string", async () => {
      await expect(authService.verifyAdminStatus("")).rejects.toThrow(
        new AppError("Unauthorized", StatusCodes.UNAUTHORIZED)
      );

      expect(mockJwt.verify).not.toHaveBeenCalled();
    });

    it("should throw error when user is not admin", async () => {
      const nonAdminToken = {
        ...mockDecodedToken,
        role: "customer",
      };
      mockJwt.verify.mockReturnValue(nonAdminToken as never);

      await expect(
        authService.verifyAdminStatus("valid-token")
      ).rejects.toThrow(new AppError("Forbidden", StatusCodes.FORBIDDEN));

      expect(mockJwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    });

    it("should throw error when JWT verification fails", async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(
        authService.verifyAdminStatus("invalid-token")
      ).rejects.toThrow(new AppError("Unauthorized", StatusCodes.UNAUTHORIZED));

      expect(mockJwt.verify).toHaveBeenCalledWith(
        "invalid-token",
        "test-secret"
      );
    });

    it("should re-throw AppError when JWT verification throws AppError", async () => {
      const customError = new AppError("Custom error", StatusCodes.BAD_REQUEST);
      mockJwt.verify.mockImplementation(() => {
        throw customError;
      });

      await expect(
        authService.verifyAdminStatus("invalid-token")
      ).rejects.toThrow(customError);
    });
  });

  describe("hashPassword", () => {
    it("should hash password with correct salt rounds", async () => {
      const password = "testPassword123";
      const hashedPassword = "hashedPassword123";

      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await authService.hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it("should handle bcrypt errors", async () => {
      const password = "testPassword123";
      (mockBcrypt.hash as jest.Mock).mockRejectedValue(
        new Error("Hashing failed")
      );

      await expect(authService.hashPassword(password)).rejects.toThrow(
        "Hashing failed"
      );
    });
  });
});
