import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/orderController.js";

const router = express.Router();

// ADMIN - ALL ORDERS
router.get(
  "/all-orders",
  requireSignIn,
  isAdmin,
  getAllOrdersController
);

// ADMIN - UPDATE STATUS
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatusController
);

export default router;
