import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET environment variable is not set");
      return res.status(500).json({
        message: "Server configuration error - JWT_SECRET not set",
        error: "Missing environment variable",
      });
    }

    const token = req.cookies.jwt || req.cookies.token;
    console.log("Auth middleware - token exists:", !!token);
    console.log(
      "Auth middleware - cookie names:",
      Object.keys(req.cookies || {}),
    );

    if (!token) {
      console.log("Auth middleware - no token found");
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    console.log("Auth middleware - token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - token verified, userId:", decoded.userId);

    if (!decoded) {
      console.log("Auth middleware - invalid decoded token");
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Auth middleware - finding user:", decoded.userId);
    const user = await User.findById(decoded.userId).select("-password");
    console.log("Auth middleware - user found:", !!user);

    if (!user) {
      console.log("Auth middleware - user not found in database");
      return res.status(404).json({ message: "User not found in database" });
    }

    req.user = user;
    console.log("Auth middleware - user attached to request, calling next()");
    next();
  } catch (error) {
    console.error("Error in protected route middleware:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Authentication error",
      error: error.message,
      errorType: error.name,
    });
  }
};
