import mongoose, { Types } from "mongoose";
import Dashboard from "../models/dashboard";
import Form from "../models/form";
import { SubmitFormDataInterface } from "../types/form";
import Submission from "../models/submission";
import { SubmissionInterface } from "../types/submission";
import { FormDataInterface } from "@shared/types";
import {
  BlockAnalyticsItem,
  ChoiceAnalytics,
  FormAnalyticsResponse,
  RatingAnalytics,
  TextAnalytics,
} from "../types/analytics";

export const findForm = async (
  userId: Types.ObjectId,
  formId: string,
): Promise<FormDataInterface | null> => {
  const dashboard = await Dashboard.findOne({
    user_id: userId,
  });
  if (!dashboard) {
    throw new Error("User dashboard not found");
  }

  const formObjectId = new mongoose.Types.ObjectId(formId);
  // Check if the form exists in any of the user's workspaces
  for (const workspace of dashboard.workspaces) {
    const form = workspace.forms?.find(f => f?.form_id.equals(formObjectId));
    if (form) {
      // Fetch the full form details from the Form model
      const fullForm = await Form.findById(form.form_id);
      return fullForm; // Return the full form details
    }
  }
  // If form not found, return null or throw an error
  return null;
};

export const saveNewForm = async (
  formData: FormDataInterface,
): Promise<FormDataInterface | null> => {
  const newForm = new Form(formData);
  const savedForm = await newForm.save();

  await Dashboard.findOneAndUpdate(
    { "workspaces._id": formData.workspaceId }, // Find the workspace by its ID
    {
      $push: {
        "workspaces.$.forms": {
          // Push the new form details into the forms array
          name: formData.title, // Use the title from the form data
          submissions: 0, // Initialize submissions to 0
          created: new Date(), // Set created date
          modified: new Date(), // Set modified date
          url: `/view-form/${savedForm._id}`, // URL for accessing the form
          form_id: savedForm._id, // Reference to the saved form
        },
      },
    },
    { new: true }, // Return the updated document
  );

  return savedForm;
};

export const updateExistingForm = async (
  id: string,
  formData: FormDataInterface,
): Promise<FormDataInterface | null> => {
  const formObjectId = new mongoose.Types.ObjectId(id); // Convert the ID to ObjectId
  const updatedForm = await Form.findByIdAndUpdate(formObjectId, formData, {
    returnDocument: "after", // Return the updated document
    runValidators: true, // Run validation on the updated data
  });
  if (updatedForm) {
    const updatedDashboard = await Dashboard.findOneAndUpdate(
      { "workspaces.forms.form_id": formObjectId }, // Locate the form in any workspace in the dashboard
      {
        $set: {
          "workspaces.$[workspace].forms.$[form].name": updatedForm.title, // Update the form title in dashboard
          "workspaces.$[workspace].forms.$[form].modified": new Date(), // Update the modified date
        },
      },
      {
        returnDocument: "after", // Return the updated document
        arrayFilters: [
          { "workspace.forms.form_id": formObjectId }, // Filter to match the correct form
          { "form.form_id": formObjectId }, // Filter to match the correct workspace form
        ],
      },
    );

    if (!updatedDashboard) {
      throw new Error("Dashboard or form not found");
    }
  }
  return updatedForm; // Return the updated form
};

export const viewFormData = async (formId: string): Promise<FormDataInterface | null> => {
  const fullForm = await Form.findById(formId, {
    blocks: true,
    title: true,
    disabled: true,
  });
  return fullForm;
};

export const submitFormData = async (formData: SubmitFormDataInterface) => {
  const formObjectId = new mongoose.Types.ObjectId(formData._id); // Convert the form ID to ObjectId
  // Step 1: Insert the submission into the Submission collection
  const newSubmission = new Submission({
    title: formData.title,
    blocks: formData.blocks,
    formId: formObjectId,
  });
  await newSubmission.save();
  // Step 2: Update the form's submission count
  const updatedDashboard = await Dashboard.findOneAndUpdate(
    {
      "workspaces.forms.form_id": formObjectId, // Find the correct form in the nested structure
    },
    {
      $inc: { "workspaces.$[].forms.$[form].submissions": 1 }, // Increment the submissions count in the matching form
    },
    {
      returnDocument: "after", // Return the updated document
      arrayFilters: [{ "form.form_id": formObjectId }], // Filter to target the correct form inside the workspace
    },
  );
  if (!updatedDashboard) {
    console.error("Error updating form submissions: Form not found.");
    return null;
  }
  return updatedDashboard; // Return the updated form with updated submissions count
};

export const getSubmissionsByFormId = async (
  formId: string,
  page: number,
  limit: number,
): Promise<{ submissions: SubmissionInterface[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const [submissions, total] = await Promise.all([
      Submission.find({ formId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Submission.countDocuments({ formId }),
    ]);
    return { submissions, total };
  } catch {
    throw new Error(`Error fetching submissions for formId: ${formId}`);
  }
};

export const deleteFormById = async (formId: string) => {
  try {
    // Step 1: Check if there are any submissions for the form
    const submissionsCount = await Submission.countDocuments({ formId });

    if (submissionsCount > 0) {
      // If there are submissions, delete the form and its submissions

      // Step 2: Delete the form from the Submission collection
      const submissionDeleteResult = await Submission.deleteMany({ formId });

      // Step 3: Delete the form from the Form collection
      const formDeleteResult = await Form.findByIdAndDelete(formId);

      // Step 4: Delete references of the form from the Dashboard collection
      await Dashboard.updateMany(
        { "workspaces.forms.form_id": formId },
        {
          $pull: { "workspaces.$[].forms": { form_id: formId } },
        },
      );

      // If deletion was successful, return success
      if (formDeleteResult && submissionDeleteResult.deletedCount > 0) {
        return {
          success: true,
          message: "Form, submissions, and references deleted successfully.",
        };
      } else {
        return {
          success: false,
          message: "Form, submissions, or references not found.",
        };
      }
    } else {
      // If there are no submissions, delete the references and form only

      // Step 2: Delete references of the form from the Dashboard collection
      const dashboardUpdateResult = await Dashboard.updateMany(
        { "workspaces.forms.form_id": formId },
        {
          $pull: { "workspaces.$[].forms": { form_id: formId } },
        },
      );

      // Step 3: Delete the form from the Form collection
      const formDeleteResult = await Form.findByIdAndDelete(formId);

      if (formDeleteResult && dashboardUpdateResult.modifiedCount > 0) {
        return {
          success: true,
          message: "Form and its references deleted successfully (no submissions).",
        };
      } else {
        return { success: false, message: "Form or references not found." };
      }
    }
  } catch (error) {
    console.error("Error deleting form:", error);
    throw new Error("Error deleting form and its references.");
  }
};

export const getFormAnalytics = async (formId: string): Promise<FormAnalyticsResponse | null> => {
  const form = await Form.findById(formId, { blocks: 1 }).lean();
  if (!form) return null;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const [
    totalSubmissions,
    submissionsOverTime,
    lastSubmission,
    thisWeekSubmissions,
    lastWeekSubmissions,
    allSubs,
  ] = await Promise.all([
    Submission.countDocuments({ formId }),
    Submission.aggregate([
      { $match: { formId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]),
    Submission.findOne({ formId }).sort({ createdAt: -1 }).select("createdAt").lean(),
    Submission.countDocuments({ formId, createdAt: { $gte: sevenDaysAgo } }),
    Submission.countDocuments({ formId, createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
    Submission.find({ formId }, "blocks").lean(),
  ]);

  // Completion rate: % of submissions where every block has a non-empty answer
  const completedCount = allSubs.filter(sub =>
    sub.blocks.every((block: { data?: { value?: unknown; selectedOption?: unknown } }) => {
      const v = block.data?.value;
      const s = block.data?.selectedOption;
      return (v != null && v !== "") || (s != null && s !== "");
    }),
  ).length;
  const completionRate =
    totalSubmissions > 0 ? Math.round((completedCount / totalSubmissions) * 100) : 0;
  const lastSubmissionAt = lastSubmission
    ? (lastSubmission as unknown as { createdAt: Date }).createdAt.toISOString()
    : null;

  const blockAnalytics: BlockAnalyticsItem[] = [];

  for (let index = 0; index < form.blocks.length; index++) {
    const block = form.blocks[index];
    const type = block.type;
    const title = block.data?.title || `Block ${index + 1}`;

    if (type === "ratingTool") {
      const rows = await Submission.aggregate([
        { $match: { formId } },
        {
          $project: {
            blockValue: {
              $let: {
                vars: { blk: { $arrayElemAt: ["$blocks", index] } },
                in: "$$blk.data.value",
              },
            },
          },
        },
        { $match: { blockValue: { $nin: [null, ""] } } },
      ]);

      const dist: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
      let sum = 0;
      let validCount = 0;

      for (const row of rows) {
        const val = Number(row.blockValue);
        if (!isNaN(val) && val >= 1 && val <= 5) {
          const key = String(Math.round(val));
          dist[key] = (dist[key] || 0) + 1;
          sum += val;
          validCount++;
        }
      }

      const analytics: RatingAnalytics = {
        average: validCount > 0 ? Math.round((sum / validCount) * 10) / 10 : 0,
        distribution: dist,
      };
      const responseRate =
        totalSubmissions > 0 ? Math.round((validCount / totalSubmissions) * 100) : 0;
      blockAnalytics.push({ blockIndex: index, type, title, analytics, responseRate });
    } else if (type === "multipleChoiceTool" || type === "dropdownTool") {
      const options: Array<{ optionValue: string; optionMarker: string }> =
        block.data?.options || [];

      const rows = await Submission.aggregate([
        { $match: { formId } },
        {
          $project: {
            blockValue: {
              $let: {
                vars: { blk: { $arrayElemAt: ["$blocks", index] } },
                in: "$$blk.data.selectedOption",
              },
            },
          },
        },
        { $match: { blockValue: { $nin: [null, ""] } } },
        { $group: { _id: "$blockValue", count: { $sum: 1 } } },
      ]);

      const markerToLabel = Object.fromEntries(options.map(o => [o.optionMarker, o.optionValue]));

      const analytics: ChoiceAnalytics = {
        options: rows.map(r => ({
          label: markerToLabel[r._id] || r._id,
          count: r.count,
        })),
      };
      const totalResponses = rows.reduce((acc: number, r: { count: number }) => acc + r.count, 0);
      const responseRate =
        totalSubmissions > 0 ? Math.round((totalResponses / totalSubmissions) * 100) : 0;
      blockAnalytics.push({ blockIndex: index, type, title, analytics, responseRate });
    } else {
      const responseCount = await Submission.countDocuments({
        formId,
        [`blocks.${index}.data.value`]: { $ne: "" },
      });

      const analytics: TextAnalytics = { responseCount };
      const responseRate =
        totalSubmissions > 0 ? Math.round((responseCount / totalSubmissions) * 100) : 0;
      blockAnalytics.push({ blockIndex: index, type, title, analytics, responseRate });
    }
  }

  return {
    totalSubmissions,
    lastSubmissionAt,
    thisWeekSubmissions,
    lastWeekSubmissions,
    completionRate,
    submissionsOverTime,
    blockAnalytics,
  };
};

export const toggleFormDisabled = async (formId: string) => {
  try {
    const formObjectId = new mongoose.Types.ObjectId(formId);

    // Find the form in the Form collection
    const form = await Form.findById(formObjectId);
    if (!form) {
      throw new Error("Form not found");
    }

    // Toggle the disabled field in the Form collection
    form.disabled = !form.disabled;
    await form.save();

    // Update the disabled field in the Dashboard collection (forms inside workspaces)
    const dashboardUpdateResult = await Dashboard.updateMany(
      { "workspaces.forms.form_id": formObjectId },
      {
        $set: {
          "workspaces.$[].forms.$[form].disabled": form.disabled,
        },
      },
      {
        arrayFilters: [{ "form.form_id": formObjectId }],
      },
    );

    if (!dashboardUpdateResult) {
      throw new Error("Dashboard not updated successfully");
    }

    return {
      success: true,
      message: `Form disabled status toggled successfully. Now: ${form.disabled}`,
    };
  } catch (error) {
    console.error("Error toggling form disabled status:", error);
    throw new Error("Error toggling form disabled status");
  }
};
