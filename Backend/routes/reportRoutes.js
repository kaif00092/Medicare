import express from "express";
import { analyzeMedicalReport } from "../controllers/reportControllers.js";
import { uploadReport } from "../middleware/upload.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/analyzer",
  protectedRoute,
  uploadReport.single("report"),
  analyzeMedicalReport,
);

export default router;
