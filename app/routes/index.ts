import express from "express";
const mainRoute = express.Router();
import authRoute from "./auth.routes";
import videoRoute from "./video.route";
mainRoute.use("/api/v1", authRoute);
mainRoute.use("/api/v1", videoRoute);

export default mainRoute;
