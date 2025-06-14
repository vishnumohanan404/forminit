import axiosClient from ".";

interface BlockData {
  type: string; // Type of the block (e.g., 'header', 'paragraph', etc.)
  data: any; // Data specific to the block type
}

export interface EditorJSData {
  title: string;
  time: number; // Timestamp when the data was saved
  blocks: BlockData[]; // Array of block data
  workspaceId: string; // ID of the workspace
  version: string;
}

export interface SubmitFormData {
  title: string;
  blocks: BlockData[];
  _id: string;
}
export const fetchForm = async (id: string | undefined) => {
  const response = await axiosClient.get(`/api/form/${id}`);
  return response.data;
};
export const viewForm = async (id: string | undefined) => {
  const response = await axiosClient.get(`/api/form/view-form/${id}`);
  return response.data;
};
export const createForm = async (formData: EditorJSData) => {
  const response = await axiosClient.post("/api/form", formData);
  return response.data;
};
export const updateForm = async (id: string, formData: EditorJSData) => {
  const response = await axiosClient.put(`/api/form/${id}`, formData);
  return response.data;
};
export const submitForm = async (formData: SubmitFormData) => {
  const response = await axiosClient.post(`/api/form/submit-form`, formData);
  return response.data;
};
export const fetchSubmissions = async (formId: string) => {
  const response = await axiosClient.get(`/api/form/submissions/${formId}`);
  return response.data;
};
export const deleteForm = async (id: string | undefined) => {
  const response = await axiosClient.delete(`/api/form/${id}`);
  return response.data;
};
export const disableForm = async (id: string | undefined) => {
  const response = await axiosClient.put(`/api/form/disable/${id}`);
  return response.data;
};
