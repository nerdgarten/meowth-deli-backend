import AuthRepository from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import {
  CustomerType,
  DriverType,
  RestaurantType,
  UserRole,
} from "../types/auth.type.js";

export default class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async signin(email: string, password: string, role: UserRole = "customer") {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return { id: user.id, email: user.email, token };
  }

  checkUserExists(email: string) {
    return this.authRepository.findUserByEmail(email);
  }

  createUser(email: string, password: string) {
    return this.authRepository.createUser(email, password);
  }

  encryptPassword(password: string): string {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET as string
    ).toString();

    return encryptedPassword;
  }

  decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.PASSWORD_SECRET as string
    );
    const decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedPassword;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt
      .hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10)
      .then((hash) => {
        return hash;
      });
  }

  async createCustomer(customerData: CustomerType) {
    const hashedPassword = await this.hashPassword(customerData.password);
    return this.authRepository.createCustomer({
      ...customerData,
      password: hashedPassword,
    });
  }

  async createDriver(driverData: DriverType) {
    const hashedPassword = await this.hashPassword(driverData.password);
    return this.authRepository.createDriver({
      ...driverData,
      password: hashedPassword,
    });
  }

  async createRestaurant(restaurantData: RestaurantType) {
    const hashedPassword = await this.hashPassword(restaurantData.password);
    return this.authRepository.createRestaurant({
      ...restaurantData,
      password: hashedPassword,
    });
  }
}
