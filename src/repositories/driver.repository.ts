import { prisma } from "@/libs/prisma";

export default class DriverRepository {
  getDriverById(driverId: number) {
    return prisma.driver.findFirst({
      where: {
        id: driverId,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        tel: true,
        vehicle: true,
        licence: true,
        fee_rate: true,
        verification_status: true,
        is_available: true,
        image: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
