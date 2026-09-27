import { Request, Response } from "express";
import { getDashboard } from "./dashboard.service";

export const getDashboardController = async (
  _req: Request,
  res: Response
) => {
  try {
    const dashboard = await getDashboard();

    res.status(200).json({
      data: dashboard,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch dashboard";

    res.status(500).json({
      error: message,
    });
  }
};