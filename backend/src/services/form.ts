import mongoose from "mongoose";
import Dashboard from "../models/dashboard";
import Form from "../models/form";
import { FormDataInterface } from "../types/form";

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
          url: `/forms/${savedForm._id}`, // URL for accessing the form
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
