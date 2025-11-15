import crypto from "crypto";

import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import emailConfig from "@/config/email";
import urlConfig from "@/config/url";
import AuthRepository from "@/repositories/auth.repository";
import ResetTokenRepository from "@/repositories/resettoken.repository";
import {
  CustomerSignUpBody,
  DriverSignUpBody,
  RestaurantSignUpBody,
  SignInBody,
  ResetPasswordBody,
} from "@/types/auth/post";
import { ResetToken } from "@/types/auth/token";
import { IEmail } from "@/types/email/email";
import { AppError } from "@/types/error";
import { Role } from "@/types/role";
import { signJwt } from "@/utils/jwt";
import {
  signInSchema,
  signUpCustomerSchema,
  signUpRestaurantSchema,
  signUpDriverSchema,
} from "@/validators/auth.schema";

import EmailService from "./email.service";

export default class AuthService {
  private authRepository: AuthRepository;
  private emailService: EmailService;
  private resetTokenRepository: ResetTokenRepository;

  constructor() {
    this.authRepository = new AuthRepository();
    this.resetTokenRepository = new ResetTokenRepository();
    this.emailService = new EmailService();
  }

  async signIn(body: SignInBody) {
    const { email, password } = body;
    signInSchema.parse(body);

    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const token = signJwt(user.id, user.email, user.role);

    return token;
  }

  async createCustomerUser(body: CustomerSignUpBody) {
    signUpCustomerSchema.parse(body);
    const createdUser = await this.authRepository.createCustomerUser({
      ...body,
      password: await this.hashPassword(body.password),
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: Role.customer,
    };
  }

  async createDriverUser(body: DriverSignUpBody) {
    signUpDriverSchema.parse(body);
    const createdUser = await this.authRepository.createDriverUser({
      ...body,
      password: await this.hashPassword(body.password),
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: Role.driver,
    };
  }

  async createRestaurantUser(body: RestaurantSignUpBody) {
    signUpRestaurantSchema.parse(body);
    const createdUser = await this.authRepository.createRestaurantUser({
      ...body,
      password: await this.hashPassword(body.password),
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: Role.restaurant,
    };
  }

  async verifyAdminStatus(token: string | undefined) {
    if (!token) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      role: string;
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
  async requestResetPassword(email: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);
    await this.resetTokenRepository.createResetToken(user.id, {
      token,
      expires,
    } as ResetToken);

    const resetUrl = `${urlConfig.front_end}/reset?token=${token}`;
    const from = `"Meowth Deli" <${emailConfig.user}>`;

    await this.emailService.sendEmail(from, {
      to: email,
      subject: "Reset Your Password",
      text: `Click the link to reset your password: ${resetUrl}`,
      html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}"> Reset Password</a>
        `,
    } as IEmail);
  }

  async resetPassword(resetBody: ResetPasswordBody) {
    const data = await this.resetTokenRepository.findResetTokenByToken(
      resetBody.token
    );
    if (!data) {
      throw new AppError("Invalid or expired token", StatusCodes.BAD_REQUEST);
    }
    const user = data.user;

    const hashedPassword = await this.hashPassword(resetBody.password);
    await this.authRepository.updateUserPassword(user.id, hashedPassword);
    await this.resetTokenRepository.deleteResetToken(resetBody.token);
    return;
  }
}
