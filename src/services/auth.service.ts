import AuthRepository from "@/repositories/auth.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  CustomerSignUpBody,
  DriverSignUpBody,
  RestaurantSignUpBody,
  SignInBody,
} from "@/types/auth/post";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes";
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
    const createdUser = await this.authRepository.createCustomerUser(body);

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: UserRole.Customer,
    };
  }

  async createDriverUser(body: DriverSignUpBody) {
    const createdUser = await this.authRepository.createDriverUser(body);

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: UserRole.Driver,
    };
  }

  async createRestaurantUser(body: RestaurantSignUpBody) {
    const createdUser = await this.authRepository.createRestaurantUser(body);

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: UserRole.Restaurant,
    };
  }

  // checkUserExists(email: string) {
  //   return this.authRepository.findUserByEmail(email);
  // }

  // createUser(email: string, password: string) {
  //   return this.authRepository.createUser(email, password);
  // }

  // encryptPassword(password: string): string {
  //   const encryptedPassword = CryptoJS.AES.encrypt(
  //     password,
  //     process.env.PASSWORD_SECRET as string
  //   ).toString();

  //   return encryptedPassword;
  // }

  // decryptPassword(encryptedPassword: string): string {
  //   const bytes = CryptoJS.AES.decrypt(
  //     encryptedPassword,
  //     process.env.PASSWORD_SECRET as string
  //   );
  //   const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

  //   return decryptedPassword;
  // }

  // async hashPassword(password: string): Promise<string> {
  //   return await bcrypt.hash(
  //     password,
  //     Number(process.env.BCRYPT_SALT_ROUNDS) || 10
  //   );
  // }

  // async createCustomer(customerData: ICustomer) {
  //   const hashedPassword = await this.hashPassword(customerData.password);
  //   return this.authRepository.createCustomer({
  //     ...customerData,
  //     password: hashedPassword,
  //   });
  // }

  // async createDriver(driverData: IDriver) {
  //   const hashedPassword = await this.hashPassword(driverData.password);
  //   return this.authRepository.createDriver({
  //     ...driverData,
  //     password: hashedPassword,
  //   });
  // }

  // async createRestaurant(restaurantData: IRestaurant) {
  //   const hashedPassword = await this.hashPassword(restaurantData.password);
  //   return this.authRepository.createRestaurant({
  //     ...restaurantData,
  //     password: hashedPassword,
  //   });
  // }
}
