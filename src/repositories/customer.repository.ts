import { Allergy, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
export default class CustomerRepository {
  async getCustomers(onlyActive = true) {
    return prisma.customer.findMany({
      where: {
        user: {
          is_deleted: onlyActive ? false : undefined,
        },
      },
      orderBy: { id: "asc" },
    });
  }

  async getCustomerProfileById(userId: number) {
    return prisma.customer.findFirst({
      where: { id: userId },
      include: {
        user: true,
      },
    });
  }

  async updateCustomerProfileById(
    userId: number,
    data: Prisma.CustomerUpdateInput
  ) {
    return prisma.customer.update({
      where: { id: userId },
      data: data,
    });
  }

  async getAllergies(userId: number) {
    return await prisma.customer.findUnique({
      where: { id: userId },
      select: { allergy: true },
    });
  }

  async updateAllergies(userId: number, allergies: Allergy[]) {
    return await prisma.customer.update({
      where: { id: userId },
      data: { allergy: allergies },
      select: { allergy: true },
    });
  }

  async getDefaultLocationByCustomerId(customerId: number) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { default_location_id: true },
    });
    if (!customer || !customer.default_location_id) {
      return null;
    }
    return prisma.location.findUnique({
      where: { id: customer.default_location_id },
    });
  }

  async setDefaultLocation(customerId: number, locationId: number) {
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: { default_location_id: locationId },
      select: { default_location: true },
    });
    return updated.default_location;
  }
}
