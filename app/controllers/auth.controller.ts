import { Request, Response } from "express";
import AuthService from "../services/auth.service";

export class AuthController {
   // Sign up user
   public static async signUp(req: Request, res: Response): Promise<void> {
      const newUserData = req.body;
      try {
         // Call signUp service to register the user
         const newUser = await AuthService.signUp(newUserData);
         res.status(201).json({
            message: "User registered successfully",
            httpStatusCode: 201,
            user: {
               _id: newUser.user._id,
               email: newUser.user.email,
               is_active: newUser.user.is_active,
               phone: newUser.user.phone,
               blood_group: newUser.user.blood_group,
            },
         });
      } catch (error: any) {
         res.status(400).json({
            message: error.message || "Error during sign up",
            httpStatusCode: 400,
         });
      }
   }

   // Sign in user
   public static async signIn(req: Request, res: Response): Promise<void> {
      const { email, password } = req.body;

      try {
         // Call signIn service to authenticate and generate JWT
         const { token, user } = await AuthService.signIn(email, password);
         res.status(200).json({
            message: "User logged in successfully",
            httpStatusCode: 200,
            token, 
            user,
         });
      } catch (error: any) {
         res.status(400).json({
            message: error.message || "Error during sign in",
            httpStatusCode: 400,
         });
      }
   }
   // send otp
   public static async sendOtp(req: Request, res: Response): Promise<void> {
      const { email } = req.body;

      try {
         const response = await AuthService.sendOtp(email);
         res.status(200).json({
            message: response.message,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            message: error.message || "Error sending OTP",
         });
      }
   }

   public static async requestRestOtp(req: Request, res: Response): Promise<void> {
      const { email } = req.body;

      try {
         const response = await AuthService.requestPasswordReset(email);
         res.status(200).json({
            message: response.message,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            message: error.message || "Error sending OTP",
         });
      }
   }

   public static async verifyOtpReq(req: Request, res: Response): Promise<void> {
      const { email, otp } = req.body;

      try {
         const { message } = await AuthService.verifyResetOtp(email, otp);
         res.status(200).json({
            message: message,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            message: error.message || "Error during sign in",
            httpStatusCode: 400,
         });
      }
   }

   public static async setNewPassword(req: Request, res: Response): Promise<void> {
      const { email, new_password } = req.body;

      try {
         const { message } = await AuthService.resetPassword(email, new_password);
         res.status(200).json({
            message: message,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            message: error.message || "Error during sign in",
            httpStatusCode: 400,
         });
      }
   }
}

export default AuthController;
