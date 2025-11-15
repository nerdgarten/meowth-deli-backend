import crypto from "crypto";

import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import emailConfig from "@/config/email";
import urlConfig from "@/config/url";
import ResetTokenRepository from "@/repositories/resettoken.repository";
import UserRepository from "@/repositories/user.repository";
import EmailService from "@/services/email.service";
import { ResetToken } from "@/types/auth/token";
import {
  CreateCustomerRequestDTO,
  CreateCustomerResponseDTO,
  CreateDriverRequestDTO,
  CreateDriverResponseDTO,
  CreateRestaurantRequestDTO,
  CreateRestaurantResponseDTO,
  ResetPasswordRequestDTO,
  SignInRequestDTO,
  GetUserResponseDTO,
} from "@/types/dto/user";
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

export default class UserService {
  private userRepository: UserRepository;
  private emailService: EmailService;
  private resetTokenRepository: ResetTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.resetTokenRepository = new ResetTokenRepository();
    this.emailService = new EmailService();
  }

  async getUsers(): Promise<GetUserResponseDTO[]> {
    return await this.userRepository.getUsers();
  }

  async signIn(body: SignInRequestDTO): Promise<string> {
    const { email, password } = body;
    signInSchema.parse(body);

    const user = await this.userRepository.getUserByEmail(email);
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

  async createCustomerUser(
    body: CreateCustomerRequestDTO
  ): Promise<CreateCustomerResponseDTO> {
    const dto = signUpCustomerSchema.parse(body);
    const data = await this.userRepository.createCustomerUser({
      email: dto.email,
      password: await this.hashPassword(dto.password),
      role: Role.customer,
      customer: {
        create: {
          firstname: dto.firstname,
          lastname: dto.lastname,
          tel: dto.tel,
        },
      },
    });

    return {
      id: data.id,
      role: data.role,
      email: data.email,
      firstname: data.customer!.firstname,
      lastname: data.customer!.lastname,
      tel: data.customer!.tel,
    };
  }

  async createDriverUser(
    body: CreateDriverRequestDTO
  ): Promise<CreateDriverResponseDTO> {
    const dto = signUpDriverSchema.parse(body);
    const data = await this.userRepository.createDriverUser({
      email: dto.email,
      password: await this.hashPassword(dto.password),
      role: Role.driver,
      driver: {
        create: {
          firstname: dto.firstname,
          lastname: dto.lastname,
          tel: dto.tel,
        },
      },
    });

    return {
      id: data.id,
      role: data.role,
      email: data.email,
      firstname: data.driver!.firstname,
      lastname: data.driver!.lastname,
      tel: data.driver!.tel,
    };
  }

  async createRestaurantUser(
    body: CreateRestaurantRequestDTO
  ): Promise<CreateRestaurantResponseDTO> {
    const dto = signUpRestaurantSchema.parse(body);
    const data = await this.userRepository.createRestaurantUser({
      email: dto.email,
      role: Role.restaurant,
      password: await this.hashPassword(dto.password),
      restaurant: {
        create: {
          name: dto.name,
          tel: dto.tel,
        },
      },
    });
    return {
      id: data.id,
      role: data.role,
      email: data.email,
      name: data.restaurant!.name,
      tel: data.restaurant!.tel,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async requestResetPassword(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
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

  async resetPassword(resetBody: ResetPasswordRequestDTO): Promise<void> {
    const data = await this.resetTokenRepository.findResetTokenByToken(
      resetBody.token
    );
    if (!data) {
      throw new AppError("Invalid or expired token", StatusCodes.BAD_REQUEST);
    }
    const user = data.user;

    const hashedPassword = await this.hashPassword(resetBody.password);
    await this.userRepository.updateUserPassword(user.id, hashedPassword);
    await this.resetTokenRepository.deleteResetToken(resetBody.token);
    return;
  }

  async deleteUserById(userId: number): Promise<void> {
    await this.userRepository.deleteUserById(userId);
  }
}
