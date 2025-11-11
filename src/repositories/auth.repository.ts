import { prisma } from "@/libs/prisma";
import { ICustomer, IDriver, IRestaurant } from "@/types/user";

export default class AuthRepository {
  findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  createCustomerUser(customer: ICustomer) {
    return prisma.user.create({
      data: {
        email: customer.email,
        password: customer.password,
        accepted_term_of_service: customer.accepted_term_of_service || false,
        accepted_pdpa: customer.accepted_pdpa || false,
        role: "customer",
        customer: {
          create: {
            firstname: customer.firstname,
            lastname: customer.lastname,
            tel: customer.tel,
          },
        },
      },
      include: {
        customer: true,
      },
    });
  }

  createDriverUser(driver: IDriver) {
    return prisma.user.create({
      data: {
        email: driver.email,
        password: driver.password,
        accepted_term_of_service: driver.accepted_term_of_service || false,
        accepted_pdpa: driver.accepted_pdpa || false,
        role: "driver",
        driver: {
          create: {
            firstname: driver.firstname,
            lastname: driver.lastname,
            tel: driver.tel,
            vehicle: driver.vehicle,
            licence: driver.licence,
            fee_rate: driver.fee_rate || 0.1,
          },
        },
      },
      include: {
        driver: true,
      },
    });
  }

  createRestaurantUser(restaurant: IRestaurant) {
    return prisma.user.create({
      data: {
        email: restaurant.email,
        password: restaurant.password,
        accepted_term_of_service: restaurant.accepted_term_of_service || false,
        accepted_pdpa: restaurant.accepted_pdpa || false,
        role: "restaurant",
        restaurant: {
          create: {
            name: restaurant.name,
            tel: restaurant.tel,
            location: restaurant.location,
            detail: restaurant.detail,
            fee_rate: restaurant.fee_rate || 0.1,
          },
        },
      },
      include: {
        restaurant: true,
      },
    });
  }

  async findRestaurantByUserId(userId: number) {
    return prisma.restaurant.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
  async updateUserPassword(userId: number, hashedPassword: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }
}
