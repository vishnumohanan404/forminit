import axiosClient from ".";

export const fetchWorkspace = async (id: string) => {
  const response = await axiosClient.get("/api/workspace", {
    params: { id: id },
  });
  return response.data;
};
export const createWorkspace = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await axiosClient.post("/api/workspace", data);
  return response.data;
};

export const deleteWorkspace = async (workspaceId: string) => {
  const response = await axiosClient.delete(`/api/workspace/${workspaceId}`);
  return response.data;
};

export const updateWorkspace = async (id: string, data: any) => {
  const response = await axiosClient.put(`/api/workspace/${id}`, data);
  return response.data;
};
