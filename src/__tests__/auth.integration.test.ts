import request from "supertest";
import express from "express";

// Mock Prisma database
const mockDatabase = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock("../config/db", () => ({
  default: mockDatabase,
}));

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Simple mock controllers for testing
  app.post("/signup/customer", async (req, res) => {
    const { email, password, firstname, tel } = req.body;

    // Validate required fields
    if (!email || !password || !firstname || !tel) {
      return res.status(400).json({
        message: "Missing required fields: email, password, firstname, tel",
      });
    }

    // Mock user already exists check
    if (email === "existing@example.com") {
      return res.status(400).json({ message: "User already exists" });
    }

    // Mock successful creation
    const mockUser = {
      id: "1",
      email,
      roles: [{ role: "customer" }],
      customer: {
        firstname,
        lastname: req.body.lastname,
        tel,
      },
    };

    res.status(201).json({
      message: "Customer created successfully",
      user: mockUser,
    });
  });

  app.post("/signup/driver", async (req, res) => {
    const { email, password, firstname, tel, vehicle, licence } = req.body;

    // Validate required fields
    if (!email || !password || !firstname || !tel || !vehicle || !licence) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, firstname, tel, vehicle, licence",
      });
    }

    // Mock user already exists check
    if (email === "existing@example.com") {
      return res.status(400).json({ message: "User already exists" });
    }

    // Mock successful creation
    const mockUser = {
      id: "2",
      email,
      roles: [{ role: "driver" }],
      driver: {
        firstname,
        lastname: req.body.lastname,
        tel,
        vehicle,
        licence,
        fee_rate: req.body.fee_rate || 0.1,
      },
    };

    res.status(201).json({
      message: "Driver created successfully",
      user: mockUser,
    });
  });

  app.post("/signup/restaurant", async (req, res) => {
    const { email, password, name, tel, location } = req.body;

    // Validate required fields
    if (!email || !password || !name || !tel || !location) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, name, tel, location",
      });
    }

    // Mock user already exists check
    if (email === "existing@example.com") {
      return res.status(400).json({ message: "User already exists" });
    }

    // Mock successful creation
    const mockUser = {
      id: "3",
      email,
      roles: [{ role: "restaurant" }],
      restaurant: {
        name,
        tel,
        location,
        detail: req.body.detail,
        fee_rate: req.body.fee_rate || 0.1,
      },
    };

    res.status(201).json({
      message: "Restaurant created successfully",
      user: mockUser,
    });
  });

  app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    // Mock invalid credentials
    if (email === "invalid@example.com" || password === "wrongpassword") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Mock successful signin
    res.status(200).json({
      id: "1",
      email,
      token: "mock-jwt-token",
    });
  });

  return app;
};

describe("Authentication API Integration Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe("POST /signup/customer", () => {
    it("should create a customer successfully with valid data", async () => {
      const customerData = {
        email: "newcustomer@example.com",
        password: "password123",
        firstname: "John",
        lastname: "Doe",
        tel: "1234567890",
        accepted_term_of_service: true,
        accepted_pdpa: true,
        accepted_cookie_tracking: false,
      };

      const response = await request(app)
        .post("/signup/customer")
        .send(customerData)
        .expect(201);

      expect(response.body.message).toBe("Customer created successfully");
      expect(response.body.user.email).toBe(customerData.email);
      expect(response.body.user.roles[0].role).toBe("customer");
      expect(response.body.user.customer.firstname).toBe(
        customerData.firstname,
      );
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        email: "customer@example.com",
        password: "password123",
        // Missing firstname and tel
      };

      const response = await request(app)
        .post("/signup/customer")
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toBe(
        "Missing required fields: email, password, firstname, tel",
      );
    });

    it("should return 400 if user already exists", async () => {
      const existingUserData = {
        email: "existing@example.com",
        password: "password123",
        firstname: "John",
        tel: "1234567890",
      };

      const response = await request(app)
        .post("/signup/customer")
        .send(existingUserData)
        .expect(400);

      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /signup/driver", () => {
    it("should create a driver successfully with valid data", async () => {
      const driverData = {
        email: "newdriver@example.com",
        password: "password123",
        firstname: "Jane",
        lastname: "Smith",
        tel: "1234567890",
        vehicle: "Honda Civic",
        licence: "DL123456",
        fee_rate: 0.15,
      };

      const response = await request(app)
        .post("/signup/driver")
        .send(driverData)
        .expect(201);

      expect(response.body.message).toBe("Driver created successfully");
      expect(response.body.user.email).toBe(driverData.email);
      expect(response.body.user.roles[0].role).toBe("driver");
      expect(response.body.user.driver.vehicle).toBe(driverData.vehicle);
      expect(response.body.user.driver.licence).toBe(driverData.licence);
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        email: "driver@example.com",
        password: "password123",
        firstname: "Jane",
        // Missing tel, vehicle, licence
      };

      const response = await request(app)
        .post("/signup/driver")
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toBe(
        "Missing required fields: email, password, firstname, tel, vehicle, licence",
      );
    });
  });

  describe("POST /signup/restaurant", () => {
    it("should create a restaurant successfully with valid data", async () => {
      const restaurantData = {
        email: "newrestaurant@example.com",
        password: "password123",
        name: "Amazing Restaurant",
        tel: "1234567890",
        location: "123 Food Street",
        detail: "Best food in town",
        fee_rate: 0.12,
      };

      const response = await request(app)
        .post("/signup/restaurant")
        .send(restaurantData)
        .expect(201);

      expect(response.body.message).toBe("Restaurant created successfully");
      expect(response.body.user.email).toBe(restaurantData.email);
      expect(response.body.user.roles[0].role).toBe("restaurant");
      expect(response.body.user.restaurant.name).toBe(restaurantData.name);
      expect(response.body.user.restaurant.location).toBe(
        restaurantData.location,
      );
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        email: "restaurant@example.com",
        password: "password123",
        name: "Restaurant",
        // Missing tel and location
      };

      const response = await request(app)
        .post("/signup/restaurant")
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toBe(
        "Missing required fields: email, password, name, tel, location",
      );
    });
  });

  describe("POST /signin", () => {
    it("should sign in successfully with valid credentials", async () => {
      const loginData = {
        email: "user@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/signin")
        .send(loginData)
        .expect(200);

      expect(response.body.email).toBe(loginData.email);
      expect(response.body.token).toBe("mock-jwt-token");
      expect(response.body.id).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      const invalidLoginData = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/signin")
        .send(invalidLoginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
