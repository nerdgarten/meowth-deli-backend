import { StatusCodes } from "http-status-codes";

import CustomerRepository from "@/repositories/customer.repository";
import { Allergy } from "@/types/allergy";
import {
  GetCustomerResponseDTO,
  UpdateCustomerProfileRequestDTO,
} from "@/types/dto/customer";
import { AppError } from "@/types/error";
import {
  allergyUpdateSchema,
  customerUpdateProfileSchema,
} from "@/validators/profile.schema";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomers(): Promise<GetCustomerResponseDTO[]> {
    return await this.customerRepository.getCustomers();
  }

  async getCustomerProfileById(userId: number) {
    const data = await this.customerRepository.getCustomerProfileById(userId);
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return data;
  }

  async updateCustomerProfileById(
    userId: number,
    body: UpdateCustomerProfileRequestDTO
  ) {
    const dto = customerUpdateProfileSchema.parse(body);
    const data = await this.customerRepository.updateCustomerProfileById(
      userId,
      dto
    );
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return data;
  }

  async getAllergies(userId: number): Promise<Allergy[]> {
    const result = await this.customerRepository.getAllergies(userId);
    if (!result) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return result.allergy ?? [];
  }

  async updateAllergies(
    userId: number,
    allergies: Allergy[]
  ): Promise<Allergy[]> {
    const validAllergies = allergyUpdateSchema.parse({ allergies }).allergies;
    const data = await this.customerRepository.updateAllergies(
      userId,
      validAllergies
    );
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return data.allergy;
  }
}
