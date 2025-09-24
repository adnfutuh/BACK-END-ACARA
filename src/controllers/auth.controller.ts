import { Request, Response } from "express";
import * as yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = yup.object({
  fullName: yup.string().required(),
  userName: yup.string().required(),
  email: yup.string().required(),
  password: yup
    .string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test("at-least-one-uppercase-letter", "Contains at least one uppercase letter", (value) => {
      if (!value) return false;
      const regex = /^(?=.*[A-Z])/;
      return regex.test(value);
    })
    .test("at-least-one-number-letter", "Contains at least one number letter", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "Password not match"),
  //oneof =nilai field ini harus salah satu dari daftar yang diberikan didalam array bisa banyak
});

export default {
  async register(req: Request, res: Response) {
    const { fullName, userName, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        userName,
        email,
        password,
      });
      response.success(res, result, "Registration Success!");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },

  async login(req: Request, res: Response) {
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
        isActive: true,
      });
      if (!userByIdentifier) {
        return response.unauthorized(res, "User Not found");
      }

      const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
      if (!validatePassword) {
        return response.unauthorized(res, "Passwrod wrong");
      }
      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });
      response.success(res, token, "Login Success!");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;

      const result = await UserModel.findById(user?.id);
      response.success(res, result, "Success get user profile");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },

  async activation(req: Request, res: Response) {
    const { code } = req.body as { code: string };
    const user = await UserModel.findOneAndUpdate(
      { activationCode: code },
      { isActive: true },
      { new: true }
    );
    response.success(res, user, "User successfully activated");

    try {
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
