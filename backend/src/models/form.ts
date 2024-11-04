import mongoose from "mongoose";
import { workerData } from "worker_threads";
// Define a schema for individual blocks
const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  data: {
    // Use a mixed type to allow flexibility for different block data structures
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});
// Define a schema for the form containing multiple blocks
const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  blocks: {
    type: [BlockSchema], // Array of blocks
    required: true,
  },
  workspaceId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// Add a pre-save hook to update the updatedAt field
FormSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Form = mongoose.model("Form", FormSchema);
export default Form;
