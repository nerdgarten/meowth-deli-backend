import { prisma } from "@/libs/prisma";

export default class ReportRepository {
  async getReports(limit?: number, offset?: number) {
    const take = typeof limit === "number" && limit > 0 ? limit : undefined;
    const skip = typeof offset === "number" && offset >= 0 ? offset : undefined;
    const data = await prisma.report.findMany({
      include: {
        customer: {
          include: { user: true },
        },
        reported: {
          include: { driver: true, restaurant: true },
        },
      },
      orderBy: { created_at: "desc" },
      take,
      skip,
    });
    const total = await prisma.report.count();
    return { data, total };
  }

  async getReportById(id: number) {
    return await prisma.report.findUnique({
      where: { id },
      include: {
        customer: {
          include: { user: true },
        },
        reported: {
          include: { driver: true, restaurant: true },
        },
      },
    });
  }

  async resolveReport(id: number) {
    // Since there's no status field, perhaps delete or mark as resolved
    // For now, assume we delete the report when resolved
    return await prisma.report.delete({
      where: { id },
    });
  }
}
