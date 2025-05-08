import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVideo extends Document {
   title: string;
   url: string;
   description: string;
   image?: string;
   category?: string;
   publicationDate?: Date;
   isApproved: boolean;
   duration: string;
   addedBy?: string;
   status: boolean;
   tags: string[];
   createdAt: Date;
}

const VideoSchema: Schema<IVideo> = new Schema(
   {
      title: {
         type: String,
         required: true,
      },
      url: {
         type: String,
         required: true,
         unique: true,
      },
      description: {
         type: String,
         default: "",
      },
      image: {
         type: String,
         default: "",
      },
      category: {
         type: String,
         default: "",
      },
      publicationDate: {
         type: Date,
      },
      isApproved: {
         type: Boolean,
         default: false,
      },
      addedBy: {
         type: String,
      },
      status: {
         type: Boolean,
         default: true,
      },
      duration: {
         type: String,
      },
      tags: {
         type: [String],
         default: [],
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
   {
      versionKey: false,
   }
);

const Video: Model<IVideo> = mongoose.model<IVideo>("Video", VideoSchema);

export default Video;
