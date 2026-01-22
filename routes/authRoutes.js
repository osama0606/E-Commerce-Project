import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  createOrderController,
  getAllUsersController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

// Test
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user/admin routes
router.get("/user-auth", requireSignIn, (req, res) =>
  res.status(200).send({ ok: true })
);
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) =>
  res.status(200).send({ ok: true })
);

// Profile update
router.put("/profile", requireSignIn, updateProfileController);

// Orders
router.post("/create-order", requireSignIn, createOrderController);
router.get("/orders", requireSignIn, getOrdersController);
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

// Users (Admin only)
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

export default router;
