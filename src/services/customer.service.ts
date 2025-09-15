import { StatusCodes } from "http-status-codes";

import { ICustomer, IDriver, IRestaurant } from "@/types/user";
import { AppError } from "@/types/error";
import CustomerRepository from "@/repositories/customer.repository";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomerProfile(userId: number) {
    const profile = await this.customerRepository.getCustomerProfile(userId);
    if(!profile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    const updatedProfile = await this.customerRepository.updateCustomerProfile(userId, data);
    if(!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return updatedProfile;
  }
}
