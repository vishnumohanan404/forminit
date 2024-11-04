import { Request, Response } from "express-serve-static-core";
import { errorResponse } from "../helpers";
import { FormDataInterface } from "../types/form";
import { findForm, saveNewForm, updateExistingForm } from "../services/form";

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
