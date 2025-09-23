import { Request, Response } from "express";
import * as yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";

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
    /**
     #swagger.tags=['Auth']
     #swagger.requestBody = {
      required:true,
      schema:{$ref:"#/components/schemas/RegisterRequest"}
     }
     */
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
    /**
     #swagger.tags=['Auth']
     #swagger.requestBody = {
      required:true,
      schema:{$ref:"#/components/schemas/LoginRequest"}
     }
     */
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
        isActive: true,
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
      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });
      res.status(200).json({
        message: "Login Success!",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags=['Auth']
     #swagger.security = [
      {
       "bearerAuth": []
      }
     ]
     */
    try {
      const user = req.user;

      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },

  async activation(req: Request, res: Response) {
    /**
     #swagger.tags=['Auth']
     #swagger.requestBody = {
      required: true,
      schema:{$ref:"#/components/schemas/ActivationRequest"}
     }
     #swagger.security = [
      {
       "bearerAuth": []
      }
     ]
     */
    const { code } = req.body as { code: string };
    const user = await UserModel.findOneAndUpdate(
      { activationCode: code },
      { isActive: true },
      { new: true }
    );
    res.status(200).json({
      meassage: "User successfully activated",
      data: user,
    });
    try {
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },
};
