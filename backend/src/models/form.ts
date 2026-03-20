import { FormDataInterface } from "@shared/types";
import mongoose from "mongoose";

// Define a schema for individual blocks
const BlockSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    type: {
      type: String,
      required: true,
    },
    data: {
      // Use a mixed type to allow flexibility for different block data structures
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);
// Define a schema for the form containing multiple blocks
const FormSchema = new mongoose.Schema<FormDataInterface>({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
  },
  version: {
    type: String,
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
  disabled: {
    type: Boolean,
    default: false,
  },
});
// Add a pre-save hook to update the updatedAt field
FormSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Form = mongoose.model<FormDataInterface>("Form", FormSchema);
export default Form;
