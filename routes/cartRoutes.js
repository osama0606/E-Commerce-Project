// routes/cartRoutes.js
import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { getCartController, saveCartController } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", requireSignIn, getCartController);
router.post("/", requireSignIn, saveCartController);

export default router;
