import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  onBoard,
  register,
  VerifyEmail,
  updateConditions,
} from "../controllers/auth.Controllers.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/Register", register);
authRouter.post("/verifyemail", VerifyEmail);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/onboard", protectedRoute, onBoard);
authRouter.get("/me", protectedRoute, getCurrentUser);
authRouter.put("/update-conditions", protectedRoute, updateConditions);

export default authRouter;
