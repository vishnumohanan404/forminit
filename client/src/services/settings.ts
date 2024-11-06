import { UserProfile } from "@/lib/types";
import axiosClient from ".";

export const fetchUserDetails = async () => {
  const response = await axiosClient.get("/api/user");
  return response.data;
};
export const updateUserDetails = async (userData: UserProfile) => {
  const response = await axiosClient.put("/api/user", userData);
  return response.data;
};
export const updateUserPassword = async (userData: {
  currentPwd?: string;
  newPwd: string;
}) => {
  const response = await axiosClient.put("/api/user/update-password", userData);
  return response.data;
};
