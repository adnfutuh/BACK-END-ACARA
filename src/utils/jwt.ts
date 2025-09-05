import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET } from "./env";

export interface IUserToken
  extends Omit<
    User,
    | "password"
    | "activationCode"
    | "isActive"
    | "profilePicture"
    | "email"
    | "fullName"
    | "userName"
  > {
  id?: Types.ObjectId;
}
//"|" union (atau) Jadi kamu bisa buang lebih dari satu field sekaligus..

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
