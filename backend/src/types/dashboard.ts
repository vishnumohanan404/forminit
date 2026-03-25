import mongoose, { Types } from "mongoose";

export interface DashboardForm {
  _id: mongoose.Types.ObjectId;
  name: string;
  submissions: number;
  created: Date;
  modified: Date;
  url: string;
  form_id: mongoose.Types.ObjectId;
  disabled?: boolean;
  published?: boolean;
  lastSubmission?: Date | null;
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
