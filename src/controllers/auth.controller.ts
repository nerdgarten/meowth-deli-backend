import { Request, Response } from "express";
import AuthService from "../services/auth.service.js";

const authService = new AuthService();

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const existingUser = await authService.checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await authService.hashPassword(password);

    const newUser = await authService.createUser(email, hashedPassword);
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await authService.signin(email, password);

    console.log(user);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupCustomer(req: Request, res: Response) {
  const {
    email,
    password,
    firstname,
    lastname,
    tel,
    accepted_term_of_service,
    accepted_pdpa,
    accepted_cookie_tracking,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await authService.checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate required fields
    if (!email || !password || !firstname || !tel) {
      return res.status(400).json({
        message: "Missing required fields: email, password, firstname, tel",
      });
    }

    const newCustomer = await authService.createCustomer({
      email,
      password,
      firstname,
      lastname,
      tel,
      accepted_term_of_service,
      accepted_pdpa,
      accepted_cookie_tracking,
    });

    res.status(201).json({
      message: "Customer created successfully",
      user: {
        id: newCustomer.id,
        email: newCustomer.email,
        roles: newCustomer.roles,
        customer: newCustomer.customer,
      },
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupDriver(req: Request, res: Response) {
  const {
    email,
    password,
    firstname,
    lastname,
    tel,
    vehicle,
    licence,
    fee_rate,
    accepted_term_of_service,
    accepted_pdpa,
    accepted_cookie_tracking,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await authService.checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate required fields
    if (!email || !password || !firstname || !tel || !vehicle || !licence) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, firstname, tel, vehicle, licence",
      });
    }

    const newDriver = await authService.createDriver({
      email,
      password,
      firstname,
      lastname,
      tel,
      vehicle,
      licence,
      fee_rate,
      accepted_term_of_service,
      accepted_pdpa,
      accepted_cookie_tracking,
    });

    res.status(201).json({
      message: "Driver created successfully",
      user: {
        id: newDriver.id,
        email: newDriver.email,
        roles: newDriver.roles,
        driver: newDriver.driver,
      },
    });
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupRestaurant(req: Request, res: Response) {
  const {
    email,
    password,
    name,
    tel,
    location,
    detail,
    fee_rate,
    accepted_term_of_service,
    accepted_pdpa,
    accepted_cookie_tracking,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await authService.checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate required fields
    if (!email || !password || !name || !tel || !location) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, name, tel, location",
      });
    }

    const newRestaurant = await authService.createRestaurant({
      email,
      password,
      name,
      tel,
      location,
      detail,
      fee_rate,
      accepted_term_of_service,
      accepted_pdpa,
      accepted_cookie_tracking,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      user: {
        id: newRestaurant.id,
        email: newRestaurant.email,
        roles: newRestaurant.roles,
        restaurant: newRestaurant.restaurant,
      },
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
