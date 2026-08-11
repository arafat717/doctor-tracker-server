import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getDashboardSummary = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getDashboardSummary();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard summary fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardSummary,
};
