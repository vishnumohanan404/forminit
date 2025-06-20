import mongoose, { Types } from "mongoose";

export interface DashboardForm {
  name: string;
  submissions: number;
  created: Date;
  modified: Date;
  url: string;
  form_id: mongoose.Types.ObjectId;
  disabled?: boolean;
}

export interface Workspace {
  name: string;
  forms: DashboardForm[];
  _id?: Types.ObjectId;
}

export interface DashboardInterface extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  workspaces: Workspace[];
}
