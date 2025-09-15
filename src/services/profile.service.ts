import { StatusCodes } from "http-status-codes";

import ProfileRepository from "@/repositories/profile.repository";
import { ICustomer, IDriver, IRestaurant } from "@/types/user";
import { AppError } from "@/types/error";

export default class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    const updatedProfile = await this.profileRepository.updateCustomerProfile(
      userId,
      data,
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return updatedProfile;
  }

  async updateRestaurantProfile(userId: number, data: Partial<IRestaurant>) {
    const updatedProfile = await this.profileRepository.updateRestaurantProfile(
      userId,
      data,
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return updatedProfile;
  }

  async updateDriverProfile(userId: number, data: Partial<IDriver>) {
    const updatedProfile = await this.profileRepository.updateDriverProfile(
      userId,
      data,
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return updatedProfile;
  }
}
