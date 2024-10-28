import { Request, Response } from "express-serve-static-core";
import { errorResponse } from "../helpers";
import {
  addWorkspace,
  DashboardInterface,
  findDashboard,
} from "../services/dashboard";

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const dashboard = await findDashboard(user._id);
    if (!dashboard) {
      res.status(404).send("Dashboard not found");
      return;
    }
    res.status(200).json(dashboard);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const createWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const dashboard: DashboardInterface | null = await addWorkspace(
      user._id,
      req.body.name
    );
    if (!dashboard) {
      res.status(404).send("Dashboard not found");
      return;
    }
    res.status(200).json(dashboard);
  } catch (error) {
    errorResponse(error, res);
  }
};
