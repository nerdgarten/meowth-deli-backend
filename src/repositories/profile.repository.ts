import { prisma } from "@/libs/prisma";
import { ICustomer, IDriver, IRestaurant } from "@/types/user";

export default class ProfileRepository {
  updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    return prisma.customer.update({
      where: {
        id: userId,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        tel: data.tel,
      },
    });
  }

  updateDriverProfile(userId: number, data: Partial<IDriver>) {
    return prisma.driver.update({
      where: {
        id: userId,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        tel: data.tel,
        vehicle: data.vehicle,
        licence: data.licence,
        fee_rate: data.fee_rate,
      },
    });
  }

  updateRestaurantProfile(userId: number, data: Partial<IRestaurant>) {
    return prisma.restaurant.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        tel: data.tel,
        location: data.location,
        detail: data.detail,
        fee_rate: data.fee_rate,
      },
    });
  }
}
