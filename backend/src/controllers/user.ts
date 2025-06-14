import { Request, Response } from "express";
import { errorResponse } from "../helpers";
import {
  findUser,
  findUserAndUpdate,
  findUserAndUpdatePassword,
} from "../services/user";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const userData = await findUser(user._id);
    if (!userData) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json(userData);
  } catch (error) {
    errorResponse(error, res);
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { user, body } = req;
    const updatedUserData = await findUserAndUpdate(user._id, body);
    if (!updatedUserData) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json(updatedUserData);
  } catch (error) {
    errorResponse(error, res);
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const { currentPwd, newPwd } = req.body;

    if (!newPwd || newPwd.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
      return;
    }

    const updatedUser = await findUserAndUpdatePassword(
      user._id,
      currentPwd,
      newPwd
    );
    if (updatedUser) {
      res.status(200).json({ message: "Password updated successfully." });
      return;
    } else {
      res.status(400).json({ message: "Current password is incorrect." });
      return;
    }
  } catch (error) {
    errorResponse(error, res);
  }
};
