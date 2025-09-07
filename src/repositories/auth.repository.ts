import database from "../config/db.js";
import { Restaurant } from "../generated/prisma/index.js";
import { CustomerType, RestaurantType } from "../types/auth.type.js";

export default class AuthRepository {
  findUserByEmailAndPassword(email: string, password: string) {
    console.log(email, password);
    return database.user.findFirst({
      where: {
        email,
        password,
      },
    });
  }

  findUserByEmail(email: string) {
    return database.user.findFirst({
      where: {
        email,
      },
    });
  }

  createUser(email: string, password: string) {
    return database.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async createCustomer(userData: CustomerType) {
    return database.user.create({
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
    accpeted_cookie_tracking?: boolean;
  }) {
    return database.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        accepted_term_of_service: userData.accepted_term_of_service || false,
        accepted_pdpa: userData.accepted_pdpa || false,
        accepted_cookie_tracking: userData.accpeted_cookie_tracking || false,
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

  async createRestaurant(userData: RestaurantType) {
    return database.user.create({
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
