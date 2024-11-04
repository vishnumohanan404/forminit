import mongoose, { Document, HydratedDocument } from "mongoose";
import Dashboard from "../models/dashboard";
interface FormInterface {
  submission: number; // Assuming each form contains some data
  created: Date;
  modified: Date;
  url: string;
}
interface WorkspaceInterface {
  name: string;
  forms: FormInterface[]; // Array of Form objects, can be empty
}
export interface DashboardInterface extends Document {
  user_id: mongoose.Types.ObjectId;
  workspaces: WorkspaceInterface[];
}

export const findDashboard = async (
  userId: string
): Promise<HydratedDocument<DashboardInterface> | null> => {
  const dashboard: DashboardInterface | null = await Dashboard.findOne({
    user_id: userId,
  });
  return dashboard;
};

export const addWorkspace = async (
  userId: string,
  name: string
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
