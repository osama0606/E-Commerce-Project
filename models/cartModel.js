// models/cartModel.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.ObjectId, ref: "users", unique: true, required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
