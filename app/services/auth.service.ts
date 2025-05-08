import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Profile from "../models/profile.model";
import dotenv from "dotenv";
import { AuthResponse } from "../types/auth.type";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/emailSending";
import mongoose from "mongoose";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error("JWT_SECRET environment variable is not defined");
}

const OTP_EXPIRATION_TIME = 2 * 60 * 1000;
let otpStorage: { [key: string]: { otp: string; expiresAt: number } } = {};

interface singUpInterface {
   email: string;
   password: string;
   first_name?: string;
   last_name?: string;
   phone?: string;
   last_donation_date?: string;
   blood_group?: string;
   address?: string;
}

interface SingUpResponse {
   message: string;
   user: {
      _id: string;
      email: string;
      is_active: boolean;
      phone: string;
      blood_group: string;
   };
}

export class AuthService {
   // ✅ Register a new user (SignUp)
   public static async signUp(newUserData: singUpInterface): Promise<SingUpResponse> {
      try {
         const {
            email,
            password,
            first_name,
            last_name,
            phone,
            blood_group,
            last_donation_date,
            address,
         } = newUserData;

         // Validate email format
         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
         }

         // Check if the email is already in use
         const existingUser = await User.findOne({ email });
         if (existingUser) {
            throw new Error("Email is already registered.");
         }

         // Create new user
         const newUser = new User({ email, password });
         const userData = await newUser.save();
         console.log("userData._id:", userData._id);

         // Prepare user response data
         const userResponseData = {
            _id: newUser._id.toString(),
            email: newUser.email,
            is_active: newUser.is_active,
            is_verified: newUser.is_verified,
            phone: phone || "",
            blood_group: blood_group || "",
         };

         // Optional: Create user profile
         try {
            const existingProfile = await Profile.findOne({ user_id: userData._id.toString() });

            if (!existingProfile) {
               console.log("Creating new profile for user_id:", userData._id);
               const newProfile = new Profile({
                  user_id: new mongoose.Types.ObjectId(userData._id),
                  // Ensure user_id is set correctly
                  first_name: first_name || "",
                  last_name: last_name || "",
                  phone: phone || "",
                  blood_group: blood_group || "",
                  last_donation_date: last_donation_date || "",
                  address: address || "",
               });
               await newProfile.save();
               userResponseData.phone = newProfile.phone;
               userResponseData.blood_group = newProfile.blood_group;

               // Mark the user as active after profile creation
               newUser.is_active = true;
               await newUser.save(); // Update the user's active status
               userResponseData.is_active = true;
            } else {
               // Update only non-existing fields in the profile
               if (!existingProfile.first_name && first_name)
                  existingProfile.first_name = first_name;
               if (!existingProfile.last_name && last_name) existingProfile.last_name = last_name;
               if (!existingProfile.phone && phone) existingProfile.phone = phone;
               if (!existingProfile.blood_group && blood_group)
                  existingProfile.blood_group = blood_group;
               if (!existingProfile.address && address) existingProfile.address = address;

               await existingProfile.save();
            }
         } catch (profileError: any) {
            console.error("Profile creation failed:", profileError.message);
            // Proceed without failing the user registration
         }

         // Return the successful registration response
         return {
            message: "User registered successfully",
            user: userResponseData,
         };
      } catch (error: any) {
         throw new Error(error.message || "Error during sign up");
      }
   }

   // send otp
   // ✅ Send OTP to user email
   public static async sendOtp(email: string): Promise<{ message: string }> {
      try {
         const user = await User.findOne({ email });
         if (!user) {
            throw new Error("User not found.");
         }

         // Generate OTP
         const otp = crypto.randomInt(100000, 999999).toString();
         const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

         // Store OTP and expiration time
         otpStorage[email] = { otp, expiresAt };

         // Send OTP email
         await sendOtpEmail(email, otp);

         return { message: "OTP sent successfully." };
      } catch (error: any) {
         throw new Error(error.message || "Error sending OTP");
      }
   }

   // ✅ Login user (SignIn)
   public static async signIn(email: string, password: string): Promise<AuthResponse> {
      try {
         const user = await User.findOne({ email });
         if (!user) {
            throw new Error("Invalid email or password");
         }

         // Compare password
         const isMatch = await user.comparePassword(password);
         if (!isMatch) {
            throw new Error("Invalid credentials.");
         }

         // Fetch user profile data
         const profile = await Profile.findOne({ user_id: user._id });

         // Generate JWT token
         const token = jwt.sign({ user_id: user._id, email: user.email }, JWT_SECRET as string, {
            expiresIn: "1d",
         });

         return {
            token,
            user: {
               _id: user._id.toString(),
               email: user.email,
               is_active: user.is_active,
               is_verified: user.is_verified,
               phone: profile?.phone || "",
               role: user?.role || "",
               blood_group: profile?.blood_group || "",
               profile_image: profile?.profile_image || "",
            },
         };
      } catch (error: any) {
         throw new Error(error.message || "Error during sign in");
      }
   }

   public static async requestPasswordReset(email: string): Promise<{ message: string }> {
      try {
         const user = await User.findOne({ email });
         if (!user) {
            throw new Error("User not found.");
         }

         // Generate OTP
         const otp = crypto.randomInt(100000, 999999).toString();
         const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

         // Store OTP and expiration time
         otpStorage[email] = { otp, expiresAt };

         // Send OTP email
         await sendOtpEmail(email, otp);

         return { message: "OTP sent successfully for password reset." };
      } catch (error: any) {
         throw new Error(error.message || "Error sending OTP for password reset");
      }
   }

   // ✅ Verify OTP for Password Reset
   public static async verifyResetOtp(email: string, otp: string): Promise<{ message: string }> {
      try {
         const otpRecord = otpStorage[email];

         if (!otpRecord) {
            throw new Error("OTP not found. Please request a new OTP.");
         }

         if (Date.now() > otpRecord.expiresAt) {
            throw new Error("OTP has expired. Please request a new OTP.");
         }

         if (otpRecord.otp !== otp) {
            throw new Error("Invalid OTP.");
         }

         return { message: "OTP verified successfully. You can now reset your password." };
      } catch (error: any) {
         throw new Error(error.message || "Error verifying OTP");
      }
   }

   // ✅ Reset Password After OTP Verification
   public static async resetPassword(
      email: string,
      new_password: string
   ): Promise<{ message: string }> {
      try {
         const user = await User.findOne({ email });
         if (!user) {
            throw new Error("User not found.");
         }
         user.password = new_password;
         await user.save();

         delete otpStorage[email];

         return {
            message: "Password reset successfully. You can now log in with the new password.",
         };
      } catch (error: any) {
         throw new Error(error.message || "Error resetting password");
      }
   }
}

export default AuthService;
