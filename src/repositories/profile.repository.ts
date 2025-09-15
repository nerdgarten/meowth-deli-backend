import { prisma } from "@/libs/prisma";
import { ICustomer, IDriver, IRestaurant } from "@/types/user";

export default class ProfileRepository {
  updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    return prisma.customer.update({
      where: {
        id: userId,
      },
      data: data,
    });
  }

  updateDriverProfile(userId: number, data: Partial<IDriver>) {
    return prisma.driver.update({
      where: {
        id: userId,
      },
      data: data,
    });
  }

  updateRestaurantProfile(userId: number, data: Partial<IRestaurant>) {
    return prisma.restaurant.update({
      where: {
        id: userId,
      },
      data: data,
    });
  }
}
