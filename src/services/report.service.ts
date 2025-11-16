import ReportRepository from "@/repositories/report.repository";
import { FilePaginationQuery } from "@/types/file/file";

export default class ReportService {
  private reportRepository: ReportRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async getReports(paging: FilePaginationQuery) {
    const limit = Math.min(Number(paging.limit) || 10, 100);
    const offset = Math.max(Number(paging.offset) || 0, 0);
    const result = await this.reportRepository.getReports(limit, offset);
    return {
      success: true,
      message: "Reports retrieved successfully",
      data: result.data,
      total: result.total,
      offset,
      limit,
    };
  }

  async resolveReport(id: number) {
    const report = await this.reportRepository.getReportById(id);
    if (!report) {
      return {
        success: false,
        message: "Report not found",
      };
    }
    await this.reportRepository.resolveReport(id);
    return {
      success: true,
      message: "Report resolved successfully",
    };
  }
}
