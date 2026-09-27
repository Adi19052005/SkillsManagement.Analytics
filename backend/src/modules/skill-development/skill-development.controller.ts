import { Request, Response } from "express";
import * as service from "./skill-development.service";

export const createPlan = async (req: Request, res: Response) => {
  try {
    const plan = await service.createSkillDevelopmentPlan(req.body);

    res.status(201).json({
      message: "Skill development plan created successfully",
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create plan",
    });
  }
};

export const getEmployeePlans = async (req: Request, res: Response) => {
  try {
    const employeeId = String(req.params.employeeId);

    const plans = await service.getEmployeeSkillDevelopmentPlans(employeeId);

    res.status(200).json({
      data: plans,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch development plans",
    });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const plan = await service.getSkillDevelopmentPlanById(id);

    if (!plan) {
      res.status(404).json({
        error: "Skill development plan not found",
      });
      return;
    }

    res.status(200).json({
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch development plan",
    });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const plan = await service.updateSkillDevelopmentPlan(id, req.body);

    res.status(200).json({
      message: "Skill development plan updated successfully",
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to update development plan",
    });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const result = await service.deleteSkillDevelopmentPlan(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete development plan",
    });
  }
};