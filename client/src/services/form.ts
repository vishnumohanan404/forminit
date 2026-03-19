import { FormDataInterface } from "@shared/types";
import axiosClient from ".";

export interface BlockData {
  type: string;
  data: {
    title?: string;
    required?: boolean;
    placeholder?: string;
    options?: Array<{ optionValue: string; optionMarker: string }>;
  };
}

export interface EditorJSData {
  title: string;
  time?: number; // Timestamp when the data was saved
  blocks: BlockData[]; // Array of block data
  workspaceId: string; // ID of the workspace
  version?: string;
}

export interface SubmitFormData {
  title: string;
  blocks: BlockData[];
  _id: string;
}
export const fetchForm = async (id: string | undefined): Promise<FormDataInterface> => {
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
export const fetchSubmissions = async (formId: string, page = 1, limit = 10) => {
  const response = await axiosClient.get(
    `/api/form/submissions/${formId}?page=${page}&limit=${limit}`,
  );
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

export interface SubmissionTimePoint {
  date: string;
  count: number;
}

export interface BlockAnalyticsItem {
  blockIndex: number;
  type: string;
  title: string;
  analytics: {
    average?: number;
    distribution?: Record<string, number>;
    options?: Array<{ label: string; count: number }>;
    responseCount?: number;
  };
  responseRate: number;
}

export interface FormAnalyticsData {
  totalSubmissions: number;
  lastSubmissionAt: string | null;
  thisWeekSubmissions: number;
  lastWeekSubmissions: number;
  completionRate: number;
  submissionsOverTime: SubmissionTimePoint[];
  blockAnalytics: BlockAnalyticsItem[];
}

export const fetchFormAnalytics = async (formId: string): Promise<FormAnalyticsData> => {
  const response = await axiosClient.get(`/api/form/analytics/${formId}`);
  return response.data;
};
