import express from "express";
import AuthController from "../controllers/auth.controller";

const authRoute = express.Router();

authRoute.post("/auth/sign-in", AuthController.signIn);
authRoute.post("/auth/sign-up", AuthController.signUp);
authRoute.post("/auth/reset-password", AuthController.requestRestOtp);
authRoute.post("/auth/send-otp", AuthController.sendOtp);
authRoute.post("/auth/otp-verify", AuthController.verifyOtpReq);
authRoute.post("/auth/new-password", AuthController.setNewPassword);

export default authRoute;
