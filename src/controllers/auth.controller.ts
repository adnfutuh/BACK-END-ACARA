import { Request, Response } from "express";
import * as yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";

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
  password: yup.string().required(),
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

      res.status(200).json({
        message: "Registration Success!",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
      });
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
      if (!validatePassword) {
        return res.status(403).json({
          message: "Passwrod wrong",
          data: null,
        });
      }
      res.status(200).json({
        message: "Login Success!",
        data: userByIdentifier,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },
};
