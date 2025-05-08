import mongoose from "mongoose";
export interface IUser extends mongoose.Document {
   _id: string;
   email: string;
   password: string;
   role?: string;
   last_login?: Date;
   is_active: boolean;
   is_verified: boolean;
   comparePassword(candidatePassword: string): Promise<boolean>;
}
