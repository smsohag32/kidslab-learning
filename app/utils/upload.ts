import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const uploadDir = path.resolve("/tmp/uploads");

if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
   destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
   ) => {
      cb(null, uploadDir);
   },
   filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
   ) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   },
});

export const upload = multer({ storage });
