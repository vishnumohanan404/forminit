import mongoose from "mongoose";

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
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  forms: [formSchema], // Array of forms
});

const dashboardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User model
  workspaces: [workspaceSchema],
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
