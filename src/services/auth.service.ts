import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import AuthRepository from "@/repositories/auth.repository";
import {
  CustomerSignUpBody,
  DriverSignUpBody,
  RestaurantSignUpBody,
  SignInBody,
} from "@/types/auth/post";
import { AppError } from "@/types/error";
import { UserRole } from "@/types/role";

export default class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async signIn(body: SignInBody) {
    const { email, password, role } = body;

    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  async createCustomerUser(body: CustomerSignUpBody) {
    const createdUser = await this.authRepository.createCustomerUser({
      ...body,
      password: await this.hashPassword(body.password),
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: UserRole.Customer,
    };
  }

  async createDriverUser(body: DriverSignUpBody) {
    const createdUser = await this.authRepository.createDriverUser({
      ...body,
      password: await this.hashPassword(body.password),
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: UserRole.Driver,
    };
  }

  async createRestaurantUser(body: RestaurantSignUpBody) {
    const createdUser = await this.authRepository.createRestaurantUser({
      ...body,
      password: await this.hashPassword(body.password),
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: UserRole.Restaurant,
    };
  }

  async verifyAdminStatus(token: string | undefined) {
    if (!token) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      role?: string;
      iat?: number;
      exp?: number;
    };

    if (decoded.role !== "admin") {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN);
    }

    return { isAdmin: true, userId: decoded.id, email: decoded.email };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
