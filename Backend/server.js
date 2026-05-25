import express from "express";
import "dotenv/config";
import ConnectDb from "./config/Db.js";
import authRouter from "./routes/authRoutes.js";
import airouter from "./routes/aiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRouter);
app.use("/api/ai", airouter);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  ConnectDb();
  console.log(`server is listening on PORT:${port}`);
});
