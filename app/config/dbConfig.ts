import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbLink = `mongodb+srv://sohagsheik32:${process.env.DB_PASSWORD}@kidslab.luzis4o.mongodb.net/kidslab_db?retryWrites=true&w=majority&appName=kidslab`;

export const connectDb = async () => {
   try {
      await mongoose.connect(dbLink);
      console.log("database connected");
   } catch (error: any) {
      console.log("database is not connected");
      console.log(error.message);
   }
};
