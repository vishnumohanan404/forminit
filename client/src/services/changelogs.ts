import axiosClient from ".";

export const fetchChangelogs = async (): Promise<string> => {
  const response = await axiosClient.get("/api/changelogs");
  return response.data;
};
