import mongoose from "mongoose";
import Dashboard from "../models/dashboard";
import Submission from "../models/submission";
import { DashboardInterface } from "../types/dashboard";

export const findDashboard = async (userId: string): Promise<DashboardInterface | null> => {
  const dashboard: DashboardInterface | null = await Dashboard.findOne({ user_id: userId });
  if (!dashboard) return null;

  // Backfill lastSubmission for forms that have submissions recorded but the field is missing.
  // Writes the value back to the DB so subsequent loads skip this work.
  const updates: Promise<unknown>[] = [];
  for (const workspace of dashboard.workspaces) {
    for (const form of workspace.forms) {
      if (form.submissions > 0 && !form.lastSubmission) {
        const formObjectId = new mongoose.Types.ObjectId(form.form_id);
        updates.push(
          Submission.findOne({ formId: formObjectId })
            .sort({ createdAt: -1 })
            .select("createdAt")
            .lean()
            .then(last => {
              if (!last) return;
              const lastDate = (last as unknown as { createdAt: Date }).createdAt;
              form.lastSubmission = lastDate;
              return Dashboard.updateOne(
                { "workspaces.forms._id": form._id },
                { $set: { "workspaces.$[].forms.$[f].lastSubmission": lastDate } },
                { arrayFilters: [{ "f._id": form._id }] },
              );
            }),
        );
      }
    }
  }
  if (updates.length) await Promise.all(updates);

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
