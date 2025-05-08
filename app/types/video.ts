import { Document, Types } from "mongoose";

export interface IVideo extends Document {
   title: string;
   url: string;
   description?: string;
   image?: string;
   duration: string;
   source?: string;
   isApproved: boolean;
   addedBy: Types.ObjectId;
   status?: boolean;
   createdAt?: Date;
}
