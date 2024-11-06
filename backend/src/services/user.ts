import User, { UserInterface } from "../models/user";
import bcrypt from "bcrypt";

export const findUser = async (
  userId: string
): Promise<Partial<UserInterface> | null> => {
  const user: UserInterface | null = await User.findById(userId);
  return user;
};
export const findUserAndUpdate = async (
  userId: string,
  usedData: Partial<UserInterface>
): Promise<Partial<UserInterface> | null> => {
  const user: UserInterface | null = await User.findByIdAndUpdate(
    userId,
    usedData,
    { new: true, runValidators: true }
  );
  return user;
};
export const findUserAndUpdatePassword = async (
  userId: string,
  currentPassword: string | null,
  newPassword: string
): Promise<Partial<UserInterface> | null> => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found");
  }
  // If googleId is present, update the password without checking the current one
  if (user.googleId) {
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user;
  }
  if (user.password && currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return null; // Current password does not match
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user;
  }
  return null;
};
