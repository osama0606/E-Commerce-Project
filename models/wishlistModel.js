// models/wishlistModel.js
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // yahan tumhare user model ka exact name
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products", // <-- yahin change: capital P, same as model
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
