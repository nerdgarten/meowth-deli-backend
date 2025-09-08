import request from "supertest";
import express from "express";
import {
  signup,
  signin,
  signupCustomer,
  signupDriver,
  signupRestaurant,
} from "../controllers/auth.controller";

// Mock the auth service
jest.mock("../services/auth.service", () => {
  return jest.fn().mockImplementation(() => ({
    checkUserExists: jest.fn(),
    hashPassword: jest.fn(),
    createUser: jest.fn(),
    signin: jest.fn(),
    createCustomer: jest.fn(),
    createDriver: jest.fn(),
    createRestaurant: jest.fn(),
  }));
});

import AuthService from "../services/auth.service";

const MockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe("Auth Controller", () => {
  let app: express.Application;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    // Setup routes
    app.post("/signup", signup);
    app.post("/signin", signin);
    app.post("/signup/customer", signupCustomer);
    app.post("/signup/driver", signupDriver);
    app.post("/signup/restaurant", signupRestaurant);

    // Create a properly mocked instance
    mockAuthService = {
      checkUserExists: jest.fn(),
      hashPassword: jest.fn(),
      createUser: jest.fn(),
      signin: jest.fn(),
      createCustomer: jest.fn(),
      createDriver: jest.fn(),
      createRestaurant: jest.fn(),
    } as any;

    // Replace the AuthService constructor to return our mock
    (AuthService as jest.MockedClass<typeof AuthService>).mockImplementation(
      () => mockAuthService,
    );
  });

  describe("POST /signup", () => {
    it("should create a new user successfully", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "password123",
      };
      const mockUser = {
        id: 1,
        email: userData.email,
        password: "hashedPassword",
        accepted_term_of_service: false,
        accepted_pdpa: false,
        accepted_cookie_tracking: false,
      };

      mockAuthService.checkUserExists.mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue("hashedPassword");
      mockAuthService.createUser.mockResolvedValue(mockUser);

      // Act & Assert
      const response = await request(app)
        .post("/signup")
        .send(userData)
        .expect(201);

      expect(response.body).toEqual({
        message: "User created successfully",
        user: mockUser,
      });
      expect(mockAuthService.checkUserExists).toHaveBeenCalledWith(
        userData.email,
      );
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith(
        userData.password,
      );
      expect(mockAuthService.createUser).toHaveBeenCalledWith(
        userData.email,
        "hashedPassword",
      );
    });

    it("should return 400 if user already exists", async () => {
      // Arrange
      const userData = {
        email: "existing@example.com",
        password: "password123",
      };
      const existingUser = {
        id: 1,
        email: userData.email,
        password: "hashedPassword",
        accepted_term_of_service: false,
        accepted_pdpa: false,
        accepted_cookie_tracking: false,
      };

      mockAuthService.checkUserExists.mockResolvedValue(existingUser);

      // Act & Assert
      const response = await request(app)
        .post("/signup")
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        message: "User already exists",
      });
      expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
      expect(mockAuthService.createUser).not.toHaveBeenCalled();
    });
  });

  describe("POST /signin", () => {
    it("should sign in user successfully", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "password123",
      };
      const mockUserResponse = {
        id: 1,
        email: userData.email,
        token: "jwt-token",
      };

      mockAuthService.signin.mockResolvedValue(mockUserResponse);

      // Act & Assert
      const response = await request(app)
        .post("/signin")
        .send(userData)
        .expect(200);

      expect(response.body).toEqual(mockUserResponse);
      expect(mockAuthService.signin).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
    });

    it("should return 401 for invalid credentials", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      mockAuthService.signin.mockResolvedValue(null);

      // Act & Assert
      const response = await request(app)
        .post("/signin")
        .send(userData)
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid credentials",
      });
    });
  });

  describe("POST /signup/customer", () => {
    it("should create a new customer successfully", async () => {
      // Arrange
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
      const mockCustomer = {
        id: 1,
        email: customerData.email,
        password: "hashedPassword",
        accepted_term_of_service: false,
        accepted_pdpa: false,
        accepted_cookie_tracking: false,
        roles: [{ role: "customer" as const, user_id: 1 }],
        customer: {
          id: 1,
          firstname: customerData.firstname,
          lastname: customerData.lastname,
          image: null,
          tel: customerData.tel,
        },
      };

      mockAuthService.checkUserExists.mockResolvedValue(null);
      mockAuthService.createCustomer.mockResolvedValue(mockCustomer);

      // Act & Assert
      const response = await request(app)
        .post("/signup/customer")
        .send(customerData)
        .expect(201);

      expect(response.body).toEqual({
        message: "Customer created successfully",
        user: {
          id: mockCustomer.id,
          email: mockCustomer.email,
          roles: mockCustomer.roles,
          customer: mockCustomer.customer,
        },
      });
      expect(mockAuthService.checkUserExists).toHaveBeenCalledWith(
        customerData.email,
      );
      expect(mockAuthService.createCustomer).toHaveBeenCalledWith(customerData);
    });

    it("should return 400 for missing required fields", async () => {
      // Arrange
      const incompleteData = {
        email: "customer@example.com",
        password: "password123",
        // Missing firstname and tel
      };

      mockAuthService.checkUserExists.mockResolvedValue(null);

      // Act & Assert
      const response = await request(app)
        .post("/signup/customer")
        .send(incompleteData)
        .expect(400);

      expect(response.body).toEqual({
        message: "Missing required fields: email, password, firstname, tel",
      });
      expect(mockAuthService.createCustomer).not.toHaveBeenCalled();
    });
  });

  describe("POST /signup/driver", () => {
    it("should create a new driver successfully", async () => {
      // Arrange
      const driverData = {
        email: "driver@example.com",
        password: "password123",
        firstname: "Jane",
        lastname: "Smith",
        tel: "1234567890",
        vehicle: "Honda Civic",
        licence: "DL123456",
        fee_rate: 0.15,
        accepted_term_of_service: true,
        accepted_pdpa: true,
        accepted_cookie_tracking: false,
      };
      const mockDriver = {
        id: 2,
        email: driverData.email,
        password: "hashedPassword",
        accepted_term_of_service: false,
        accepted_pdpa: false,
        accepted_cookie_tracking: false,
        roles: [{ role: "driver" as const, user_id: 2 }],
        driver: {
          id: 2,
          firstname: driverData.firstname,
          lastname: driverData.lastname,
          image: null,
          tel: driverData.tel,
          is_verified: false,
          vehicle: driverData.vehicle,
          licence: driverData.licence,
          fee_rate: driverData.fee_rate,
        },
      };

      mockAuthService.checkUserExists.mockResolvedValue(null);
      mockAuthService.createDriver.mockResolvedValue(mockDriver);

      // Act & Assert
      const response = await request(app)
        .post("/signup/driver")
        .send(driverData)
        .expect(201);

      expect(response.body).toEqual({
        message: "Driver created successfully",
        user: {
          id: mockDriver.id,
          email: mockDriver.email,
          roles: mockDriver.roles,
          driver: mockDriver.driver,
        },
      });
      expect(mockAuthService.checkUserExists).toHaveBeenCalledWith(
        driverData.email,
      );
      expect(mockAuthService.createDriver).toHaveBeenCalledWith(driverData);
    });
  });

  describe("POST /signup/restaurant", () => {
    it("should create a new restaurant successfully", async () => {
      // Arrange
      const restaurantData = {
        email: "restaurant@example.com",
        password: "password123",
        name: "Best Restaurant",
        tel: "1234567890",
        location: "123 Main St",
        detail: "Great food",
        fee_rate: 0.12,
        accepted_term_of_service: true,
        accepted_pdpa: true,
        accepted_cookie_tracking: false,
      };
      const mockRestaurant = {
        id: 3,
        email: restaurantData.email,
        password: "hashedPassword",
        accepted_term_of_service: false,
        accepted_pdpa: false,
        accepted_cookie_tracking: false,
        roles: [{ role: "restaurant" as const, user_id: 3 }],
        restaurant: {
          id: 3,
          name: restaurantData.name,
          image: null,
          tel: restaurantData.tel,
          is_verified: false,
          is_available: false,
          location: restaurantData.location,
          detail: restaurantData.detail,
          fee_rate: restaurantData.fee_rate,
        },
      };

      mockAuthService.checkUserExists.mockResolvedValue(null);
      mockAuthService.createRestaurant.mockResolvedValue(mockRestaurant);

      // Act & Assert
      const response = await request(app)
        .post("/signup/restaurant")
        .send(restaurantData)
        .expect(201);

      expect(response.body).toEqual({
        message: "Restaurant created successfully",
        user: {
          id: mockRestaurant.id,
          email: mockRestaurant.email,
          roles: mockRestaurant.roles,
          restaurant: mockRestaurant.restaurant,
        },
      });
      expect(mockAuthService.checkUserExists).toHaveBeenCalledWith(
        restaurantData.email,
      );
      expect(mockAuthService.createRestaurant).toHaveBeenCalledWith(
        restaurantData,
      );
    });
  });
});
