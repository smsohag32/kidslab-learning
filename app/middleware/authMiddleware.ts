import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
   throw new Error("JWT_SECRET is required.");
}

// Extend Express Request Type
declare module "express-serve-static-core" {
   interface Request {
      user?: any;
   }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
   const token = req.headers["authorization"]?.split(" ")[1];

   if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
   }

   try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
   } catch (error) {
      res.status(400).json({ message: "Invalid token" });
   }
};
