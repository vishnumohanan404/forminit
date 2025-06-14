import Dashboard from "../models/dashboard";
import Form from "../models/form";

export const deleteWorkspaceAndForms = async (
  userId: string,
  workspaceId: string
) => {
  console.log("dashboard :>> ", workspaceId);
  const dashboard = await Dashboard.findOne({
    user_id: userId,
    "workspaces._id": workspaceId,
  });
  if (!dashboard) {
    throw new Error("Workspace not found or access denied.");
  }

  // Find the index of the workspace in the dashboard
  const workspaceIndex = dashboard.workspaces.findIndex(
    (workspace) => workspace._id.toString() === workspaceId
  );
  if (workspaceIndex === -1) {
    throw new Error("Workspace not found.");
  }

  // Delete associated forms from the Form collection
  await Form.deleteMany({ workspaceId });

  // Remove the workspace from the dashboard
  dashboard.workspaces.splice(workspaceIndex, 1);

  // Save the updated dashboard after removing the workspace
  await dashboard.save();

  return { message: "Workspace and associated forms deleted successfully." };
};
