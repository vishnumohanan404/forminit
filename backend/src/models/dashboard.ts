import mongoose from "mongoose";
import { DashboardInterface } from "../types/dashboard";

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  submissions: { type: Number, required: true },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  url: { type: String, required: true },
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  forms: [formSchema], // Array of forms
  created: { type: Date, default: Date.now },
});

const dashboardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User model
  workspaces: [workspaceSchema],
});

const Dashboard = mongoose.model<DashboardInterface>("Dashboard", dashboardSchema);

export default Dashboard;
