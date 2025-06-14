import mongoose from "mongoose";
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
const SubmissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  formId: {
    type: String,
    required: true,
  },
  blocks: {
    type: [BlockSchema], // Array of blocks
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
SubmissionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
