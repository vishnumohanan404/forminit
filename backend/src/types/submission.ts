import { BlockData } from "@shared/types";
import mongoose from "mongoose";

export interface SubmissionInterface extends mongoose.Document {
  title: string;
  formId: string;
  blocks: BlockData[];
  createdAt?: Date;
  updatedAt?: Date;
}
