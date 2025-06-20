import Dashboard from "../models/dashboard";
import { DashboardInterface } from "../types/dashboard";

export const findDashboard = async (userId: string): Promise<DashboardInterface | null> => {
  const dashboard: DashboardInterface | null = await Dashboard.findOne({
    user_id: userId,
  });
  return dashboard;
};

export const addWorkspace = async (
  userId: string,
  name: string,
): Promise<DashboardInterface | null> => {
  const dashboard: DashboardInterface | null = await Dashboard.findOne({
    user_id: userId,
  });
  if (!dashboard) {
    return null;
  }
  // Add new workspace to dashboard
  dashboard.workspaces.push({
    name,
    forms: [],
  });
  await dashboard.save();
  return dashboard;
};
