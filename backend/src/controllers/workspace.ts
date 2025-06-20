import { Request, Response } from "express";
import mongoose from "mongoose";
import { deleteWorkspaceAndForms } from "../services/workspace";
import { errorResponse } from "../helpers";

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { workspaceId } = req.params;

    // Validate workspaceId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      res.status(400).json({ message: "Invalid workspace ID." });
      return;
    }

    // Call the service to delete the workspace and its associated forms
    const result = await deleteWorkspaceAndForms(String(user._id), workspaceId);

    res.status(200).json(result);
  } catch (error) {
    errorResponse(error, res);
  }
};
