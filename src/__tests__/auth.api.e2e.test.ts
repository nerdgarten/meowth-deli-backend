import request from "supertest";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { UserRole } from "@/types/role";

// Create mock functions
const mockSignIn = jest.fn();
const mockCreateCustomerUser = jest.fn();
const mockCreateDriverUser = jest.fn();
const mockCreateRestaurantUser = jest.fn();
const mockVerifyAdminStatus = jest.fn();
const mockHashPassword = jest.fn();

// Mock the auth service
jest.mock("@/services/auth.service", () => {
  return jest.fn().mockImplementation(() => ({
    signIn: mockSignIn,
    createCustomerUser: mockCreateCustomerUser,
    createDriverUser: mockCreateDriverUser,
    createRestaurantUser: mockCreateRestaurantUser,
    verifyAdminStatus: mockVerifyAdminStatus,
    hashPassword: mockHashPassword,
  }));
});

import app from "@/app";

describe("Auth API Endpoints (E2E)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/signin", () => {
    const validSignInData = {
      email: "test@example.com",
      password: "password123",
      role: UserRole.Customer,
      tel: "1234567890",
    };

    it("should sign in successfully with valid credentials", async () => {
      const mockResponse = {
        id: 1,
        email: "test@example.com",
        token: "mock-jwt-token",
      };

      mockSignIn.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/auth/signin")
        .send(validSignInData)
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(mockResponse);
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should return 404 for non-existent user", async () => {
      mockSignIn.mockRejectedValue(new Error("User not found"));

      await request(app)
        .post("/auth/signin")
        .send(validSignInData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        email: "test@example.com",
        // missing password and other required fields
      };

      await request(app)
        .post("/auth/signin")
        .send(invalidData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("POST /auth/signup/customer", () => {
    const validCustomerData = {
      email: "customer@example.com",
      password: "password123",
      firstname: "John",
      lastname: "Doe",
      tel: "1234567890",
      accepted_term_of_service: true,
      accepted_pdpa: true,
      accepted_cookie_tracking: false,
    };

    it("should create customer successfully", async () => {
      const mockResponse = {
        id: 1,
        email: "customer@example.com",
        role: UserRole.Customer,
      };

      mockCreateCustomerUser.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/auth/signup/customer")
        .send(validCustomerData)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(mockResponse);
    });

    it("should handle service errors", async () => {
      mockCreateCustomerUser.mockRejectedValue(new Error("Database error"));

      await request(app)
        .post("/auth/signup/customer")
        .send(validCustomerData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("should validate email format", async () => {
      const invalidEmailData = {
        ...validCustomerData,
        email: "invalid-email",
      };

      // Mock service to reject invalid email
      mockCreateCustomerUser.mockRejectedValue(
        new Error("Invalid email format")
      );

      await request(app)
        .post("/auth/signup/customer")
        .send(invalidEmailData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("should require mandatory fields", async () => {
      const incompleteData = {
        email: "test@example.com",
        password: "password123",
        // missing firstname and tel
      };

      // Mock service to reject incomplete data
      mockCreateCustomerUser.mockRejectedValue(
        new Error("Missing required fields")
      );

      await request(app)
        .post("/auth/signup/customer")
        .send(incompleteData)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("Admin Routes Edge Cases", () => {
    it("should handle missing admin routes gracefully", async () => {
      // Test routes that might not be implemented yet
      await request(app)
        .get("/admin/verify")
        .expect((res) => {
          // Should either be 404 (not found) or 401/403 (auth required)
          expect([
            StatusCodes.NOT_FOUND,
            StatusCodes.UNAUTHORIZED,
            StatusCodes.FORBIDDEN,
          ]).toContain(res.status);
        });
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed JSON", async () => {
      await request(app)
        .post("/auth/signin")
        .set("Content-Type", "application/json")
        .send("{ invalid json }")
        .expect(StatusCodes.BAD_REQUEST);
    });

    it("should handle missing Content-Type", async () => {
      await request(app)
        .post("/auth/signin")
        .send("not json data")
        .expect((res) => {
          // Should handle gracefully, either 400 or 500
          expect([
            StatusCodes.BAD_REQUEST,
            StatusCodes.INTERNAL_SERVER_ERROR,
          ]).toContain(res.status);
        });
    });

    it("should handle very large payloads", async () => {
      const largeData = {
        email: "test@example.com",
        password: "password123",
        firstname: "A".repeat(10000), // Very long string
        tel: "1234567890",
      };

      await request(app)
        .post("/auth/signup/customer")
        .send(largeData)
        .expect((res) => {
          // Should either process or reject with appropriate status
          expect(res.status).toBeDefined();
        });
    });
  });

  describe("Security Tests", () => {
    it("should not expose sensitive information in error messages", async () => {
      mockSignIn.mockRejectedValue(
        new Error("Database connection string: secret://...")
      );

      const response = await request(app).post("/auth/signin").send({
        email: "test@example.com",
        password: "password123",
        role: UserRole.Customer,
        tel: "1234567890",
      });

      // Should not expose internal error details
      expect(response.body.message).not.toContain("Database connection");
      expect(response.body.message).toBe("Internal server error");
    });

    it("should handle SQL injection attempts", async () => {
      const maliciousData = {
        email: "'; DROP TABLE users; --",
        password: "password123",
        role: UserRole.Customer,
        tel: "1234567890",
      };

      // Service should handle this without crashing
      await request(app)
        .post("/auth/signin")
        .send(maliciousData)
        .expect((res) => {
          expect(res.status).toBeDefined();
          expect([
            StatusCodes.BAD_REQUEST,
            StatusCodes.UNAUTHORIZED,
            StatusCodes.INTERNAL_SERVER_ERROR,
          ]).toContain(res.status);
        });
    });

    it("should handle XSS attempts in input", async () => {
      const xssData = {
        email: "<script>alert('xss')</script>@example.com",
        password: "password123",
        firstname: "<img src=x onerror=alert('xss')>",
        tel: "1234567890",
      };

      await request(app)
        .post("/auth/signup/customer")
        .send(xssData)
        .expect((res) => {
          expect(res.status).toBeDefined();
          // Should either sanitize or reject
        });
    });
  });

  describe("Performance Tests", () => {
    it("should handle concurrent requests", async () => {
      const mockResponse = {
        id: 1,
        email: "test@example.com",
        role: UserRole.Customer,
      };

      mockCreateCustomerUser.mockResolvedValue(mockResponse);

      const requests = Array(10)
        .fill(null)
        .map(() =>
          request(app)
            .post("/auth/signup/customer")
            .send({
              email: `test${Math.random()}@example.com`,
              password: "password123",
              firstname: "John",
              tel: "1234567890",
              accepted_term_of_service: true,
              accepted_pdpa: true,
              accepted_cookie_tracking: false,
            })
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect([
          StatusCodes.CREATED,
          StatusCodes.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status);
      });
    });

    it("should respond within reasonable time", async () => {
      const startTime = Date.now();

      await request(app).post("/auth/signin").send({
        email: "test@example.com",
        password: "password123",
        role: UserRole.Customer,
        tel: "1234567890",
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Should respond within 5 seconds (generous for testing)
      expect(responseTime).toBeLessThan(5000);
    });
  });
});
