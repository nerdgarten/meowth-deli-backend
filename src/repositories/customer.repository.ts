import { prisma } from "@/libs/prisma";
import { ICustomerProfile } from "@/types/user";

export default class CustomerRepository {
  getCustomerProfile(userId: number) {
    return prisma.customer.findFirst({
      where: {
        id: userId,
      },
      select: {
        firstname: true,
        lastname: true,
        tel: true,
      }
    });
  }

  updateCustomerProfile(userId: number, data: Partial<ICustomerProfile>) {
    return prisma.customer.update({
      where: {
        id: userId,
      },
      data: data,
      select: {
        firstname: true,
        lastname: true,
        tel: true,
      }
    });
  }
}