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
const CLIENT_URL = process.env.CLIENT_URL || "https://medicare-rmg3.onrender.com";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/ai", airouter);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

// Diagnostic endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: {
      jwt_secret_set: !!process.env.JWT_SECRET,
      gemini_url_set: !!process.env.GEMINI_URL,
      gemini_api_key_set: !!process.env.GEMINI_API_KEY,
      mongo_uri_set: !!process.env.MONGO_URI,
      port: port,
      client_url: CLIENT_URL,
    },
  });
});

app.listen(port, () => {
  ConnectDb();
  console.log(`server is listening on PORT:${port}`);
});
