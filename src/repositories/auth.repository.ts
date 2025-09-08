import { prisma } from "@/libs/prisma";
import { ICustomer, IRestaurant } from "@/types/auth.type";

export default class AuthRepository {
  findUserByEmailAndPassword(email: string, password: string) {
    return prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
  }

  findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  createUser(email: string, password: string) {
    return prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async createCustomer(userData: ICustomer) {
    return prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        accepted_term_of_service: userData.accepted_term_of_service || false,
        accepted_pdpa: userData.accepted_pdpa || false,
        accepted_cookie_tracking: userData.accepted_cookie_tracking || false,
        roles: {
          create: {
            role: "customer",
          },
        },
        customer: {
          create: {
            firstname: userData.firstname,
            lastname: userData.lastname,
            tel: userData.tel,
          },
        },
      },
      include: {
        roles: true,
        customer: true,
      },
    });
  }

  async createDriver(userData: {
    email: string;
    password: string;
    firstname: string;
    lastname?: string;
    tel: string;
    vehicle: string;
    licence: string;
    fee_rate?: number;
    accepted_term_of_service?: boolean;
    accepted_pdpa?: boolean;
    accepted_cookie_tracking?: boolean;
  }) {
    return prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        accepted_term_of_service: userData.accepted_term_of_service || false,
        accepted_pdpa: userData.accepted_pdpa || false,
        accepted_cookie_tracking: userData.accepted_cookie_tracking || false,
        roles: {
          create: {
            role: "driver",
          },
        },
        driver: {
          create: {
            firstname: userData.firstname,
            lastname: userData.lastname,
            tel: userData.tel,
            vehicle: userData.vehicle,
            licence: userData.licence,
            fee_rate: userData.fee_rate || 0.1,
          },
        },
      },
      include: {
        roles: true,
        driver: true,
      },
    });
  }

  async createRestaurant(userData: IRestaurant) {
    return prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        accepted_term_of_service: userData.accepted_term_of_service || false,
        accepted_pdpa: userData.accepted_pdpa || false,
        accepted_cookie_tracking: userData.accepted_cookie_tracking || false,
        roles: {
          create: {
            role: "restaurant",
          },
        },
        restaurant: {
          create: {
            name: userData.name,
            tel: userData.tel,
            location: userData.location,
            detail: userData.detail,
            fee_rate: userData.fee_rate || 0.1,
          },
        },
      },
      include: {
        roles: true,
        restaurant: true,
      },
    });
  }
}
