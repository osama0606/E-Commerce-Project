import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ==========================
// PROTECTED ROUTE (JWT CHECK)
// ==========================
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Header missing
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token missing",
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ==========================
// ADMIN ACCESS
// ==========================
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN MIDDLEWARE ERROR:", error);
    res.status(500).send({
      success: false,
      message: "Error in admin middleware",
    });
  }
};
