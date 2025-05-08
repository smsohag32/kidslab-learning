import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mainRoute from "./app/routes";
const app = express();
dotenv.config();
const port = process.env.PORT || 4500;

import { connectDb } from "./app/config/dbConfig";

const corsOptions = {
   origin: "*",
   credentials: true,
   optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

connectDb();

app.get("/", (req, res) => {
   res.send("server is running");
});

// api
app.use(mainRoute);

app.listen(port, async () => {
   console.log("server is running");
});
