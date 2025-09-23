import { User } from "../models/user.model";
import { Request } from "express";
import { Types } from "mongoose";
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
export interface IReqUser extends Request {
  user?: IUserToken;
}
