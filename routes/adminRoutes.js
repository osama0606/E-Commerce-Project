// routes/adminRoutes.js
import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAdminStatsController,
  getRecentOrdersController,
  getRecentUsersController,
} from "../controllers/adminController.js";

const router = express.Router();

// OVERVIEW STATS
router.get("/stats", requireSignIn, isAdmin, getAdminStatsController);

// RECENT ORDERS
router.get("/recent-orders", requireSignIn, isAdmin, getRecentOrdersController);

// RECENT USERS
router.get("/recent-users", requireSignIn, isAdmin, getRecentUsersController);

export default router;
