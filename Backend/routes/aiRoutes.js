import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getHomeRemedy } from "../controllers/aiControllers.js";

const airouter = express.Router();

airouter.post("/homeremedies", protectedRoute, getHomeRemedy);

export default airouter;
