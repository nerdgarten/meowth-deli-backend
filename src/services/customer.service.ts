import { StatusCodes } from "http-status-codes";
import CustomerRepository from "@/repositories/customer.repository";
import { Allergy } from "@/types/allergy";
import { AppError } from "@/types/error";
import {
  GetCustomerResponseDTO,
  UpdateCustomerProfileRequestDTO,
} from "@/types/dto/customer";
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
    const data = await this.customerRepository.getCustomers();
    return data.map((customer) => ({ ...customer }) as GetCustomerResponseDTO);
  }

  async getCustomerProfileById(userId: number) {
    const profile =
      await this.customerRepository.getCustomerProfileById(userId);
    if (!profile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async updateCustomerProfileById(
    userId: number,
    body: UpdateCustomerProfileRequestDTO
  ) {
    const data = customerUpdateProfileSchema.parse(body);
    const updatedProfile =
      await this.customerRepository.updateCustomerProfileById(userId, data);
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return updatedProfile;
  }

  async getAllergies(userId: number): Promise<Allergy[]> {
    const result = await this.customerRepository.getAllergies(userId);
    if (!result) {
      return [];
    }
    return result.allergy ?? [];
  }

  async updateAllergies(
    userId: number,
    allergies: Allergy[]
  ): Promise<Allergy[]> {
    const validAllergies = allergyUpdateSchema.parse({ allergies }).allergies;
    return (
      await this.customerRepository.updateAllergies(userId, validAllergies)
    ).allergy;
  }
}
