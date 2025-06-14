import mongoose from "mongoose";
import Dashboard from "../models/dashboard";
import Form from "../models/form";
import { FormDataInterface, SubmitFormDataInterface } from "../types/form";
import Submission from "../models/submission";

export const findForm = async (
  userId: string,
  formId: string
): Promise<any> => {
  const dashboard = await Dashboard.findOne({
    user_id: userId,
  });
  if (!dashboard) {
    throw new Error("User dashboard not found");
  }

  const formObjectId = new mongoose.Types.ObjectId(formId);
  // Check if the form exists in any of the user's workspaces
  for (const workspace of dashboard.workspaces) {
    const form = workspace.forms?.find((f) => f?.form_id.equals(formObjectId));
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
  formData: FormDataInterface
): Promise<FormDataInterface | null> => {
  console.log("formData :>> ", formData);
  const newForm = new Form(formData);
  const savedForm = await newForm.save();

  const dashboardUpdate = await Dashboard.findOneAndUpdate(
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
    { new: true } // Return the updated document
  );
  if (dashboardUpdate) {
    console.log("Form added to dashboard successfully:", dashboardUpdate);
  } else {
    console.error("Error updating dashboard: Workspace not found.");
  }
  console.log("Form saved successfully:", savedForm);
  return savedForm;
};

export const updateExistingForm = async (
  id: string,
  formData: FormDataInterface
): Promise<any> => {
  const formObjectId = new mongoose.Types.ObjectId(id); // Convert the ID to ObjectId
  const updatedForm = await Form.findByIdAndUpdate(formObjectId, formData, {
    new: true, // Return the updated document
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
        new: true, // Return the updated document
        arrayFilters: [
          { "workspace.forms.form_id": formObjectId }, // Filter to match the correct form
          { "form.form_id": formObjectId }, // Filter to match the correct workspace form
        ],
      }
    );

    if (!updatedDashboard) {
      throw new Error("Dashboard or form not found");
    }
  }
  return updatedForm; // Return the updated form
};

export const viewFormData = async (formId: string): Promise<any> => {
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
  console.log("formObjectId :>> ", formObjectId);
  const updatedDashboard = await Dashboard.findOneAndUpdate(
    {
      "workspaces.forms.form_id": formObjectId, // Find the correct form in the nested structure
    },
    {
      $inc: { "workspaces.$[].forms.$[form].submissions": 1 }, // Increment the submissions count in the matching form
    },
    {
      new: true, // Return the updated document
      arrayFilters: [{ "form.form_id": formObjectId }], // Filter to target the correct form inside the workspace
    }
  );
  if (!updatedDashboard) {
    console.error("Error updating form submissions: Form not found.");
    return null;
  }

  console.log(
    "Dashboard form submissions updated successfully:",
    updatedDashboard
  );
  return updatedDashboard; // Return the updated form with updated submissions count
};

export const getSubmissionsByFormId = async (formId: string) => {
  try {
    // Find all submissions with the matching formId
    const submissions = await Submission.find({ formId });
    return submissions;
  } catch (error) {
    throw new Error(`Error fetching submissions for formId: ${formId}`);
  }
};

export const deleteFormById = async (formId: string) => {
  try {
    // Step 1: Check if there are any submissions for the form
    const submissionsCount = await Submission.countDocuments({ formId });

    if (submissionsCount > 0) {
      // If there are submissions, delete the form and its submissions

      console.log(
        `Form has ${submissionsCount} submissions. Proceeding with deletion...`
      );

      // Step 2: Delete the form from the Submission collection
      const submissionDeleteResult = await Submission.deleteMany({ formId });

      // Step 3: Delete the form from the Form collection
      const formDeleteResult = await Form.findByIdAndDelete(formId);

      // Step 4: Delete references of the form from the Dashboard collection
      const dashboardUpdateResult = await Dashboard.updateMany(
        { "workspaces.forms.form_id": formId },
        {
          $pull: { "workspaces.$[].forms": { form_id: formId } },
        }
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
      console.log(
        "Form has no submissions. Deleting references from Dashboard and Form."
      );

      // Step 2: Delete references of the form from the Dashboard collection
      const dashboardUpdateResult = await Dashboard.updateMany(
        { "workspaces.forms.form_id": formId },
        {
          $pull: { "workspaces.$[].forms": { form_id: formId } },
        }
      );

      // Step 3: Delete the form from the Form collection
      const formDeleteResult = await Form.findByIdAndDelete(formId);

      if (formDeleteResult && dashboardUpdateResult.modifiedCount > 0) {
        return {
          success: true,
          message:
            "Form and its references deleted successfully (no submissions).",
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
        new: true,
        arrayFilters: [{ "form.form_id": formObjectId }],
      }
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
