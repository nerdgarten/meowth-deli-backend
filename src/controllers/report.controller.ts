import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ReportService from "@/services/report.service";
import { FilePaginationQuery } from "@/types/file/file";
import { handleError } from "@/utils/handleError";

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  async getReports(req: Request, res: Response) {
    try {
      const paging = req.query as FilePaginationQuery;
      const result = await this.reportService.getReports(paging);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async resolveReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.reportService.resolveReport(Number(id));
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
}
