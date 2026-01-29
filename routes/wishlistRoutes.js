// routes/wishlistRoutes.js
import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getWishlistController,
  saveWishlistController,
} from "../controllers/wishlistController.js";

const router = express.Router(); // <- yahan sirf () hoga, koi 'a' nahi

router.get("/", requireSignIn, getWishlistController);
router.post("/", requireSignIn, saveWishlistController);

export default router; // <- default export zaroori
