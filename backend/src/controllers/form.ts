import { Request, Response } from "express-serve-static-core";
import { errorResponse } from "../helpers";
import { FormDataInterface } from "../types/form";
import {
  findForm,
  getSubmissionsByFormId,
  saveNewForm,
  submitFormData,
  updateExistingForm,
  viewFormData,
  deleteFormById,
  toggleFormDisabled,
} from "../services/form";

export const fetchForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req;
    const { formId } = req.params;
    const form = await findForm(user._id, formId);
    if (!form) {
      res.status(404).send("form not found");
      return;
    }
    res.status(200).json(form);
  } catch (error) {
    errorResponse(error, res);
  }
};
export const viewForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;
    const form = await viewFormData(formId);
    if (!form) {
      res.status(404).send("form not found");
      return;
    }
    res.status(200).json(form);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const createNewForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body } = req;
    console.log("body :>> ", body);
    const newForm: FormDataInterface | null = await saveNewForm(body);
    res.status(200).json(newForm);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const updateForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Get the form ID from the request parameters
    const formData = req.body; // Get the updated form data from the request body
    const updatedForm = await updateExistingForm(id, formData); // Call the service function to update the form

    if (!updatedForm) {
      res.status(404).send("Form not found");
      return;
    }

    res.status(200).json(updatedForm); // Return the updated form data
  } catch (error) {
    errorResponse(error, res);
  }
};

export const submitForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const formData = req.body; // Get the updated form data from the request body
    const updatedForm = await submitFormData(formData); // Call the service function to update the form
    if (!updatedForm) {
      res.status(404).send("Form not found");
      return;
    }
    res.status(200).json(updatedForm); // Return the updated form data
  } catch (error) {
    errorResponse(error, res);
  }
};

export const fetchSubmissions = async (req: Request, res: Response) => {
  const { formId } = req.params; // Extract formId from URL parameters

  try {
    const submissions = await getSubmissionsByFormId(formId);
    res.status(200).json(submissions); // Return the submissions as JSON
  } catch (error) {
    errorResponse(error, res);
  }
};

export const deleteForm = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Call the service to delete the form and its references
    const result = await deleteFormById(id);

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    errorResponse(error, res);
  }
};

export const toggleFormDisabledStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400).json({ success: false, message: "Form ID is required" });
      return;
    }

    const result = await toggleFormDisabled(id);

    res.status(200).json(result);
  } catch (error) {
    errorResponse(error, res);
  }
};
