// controllers/wishlistController.js
import Wishlist from "../models/wishlistModel.js";

export const getWishlistController = async (req, res) => {
  try {
    console.log("Wishlist GET - req.user:", req.user);

    if (!req.user?._id) {
      return res.status(200).send({
        success: true,
        wishlist: [],
        message: "No user in request",
      });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    // Filter null products
    const validItems = (wishlist?.items || []).filter(item => item.product);

    return res.status(200).send({
      success: true,
      wishlist: validItems,
    });
  } catch (error) {
    console.error("Get wishlist error (server):", error);
    return res.status(500).send({
      success: false,
      message: "Failed to load wishlist",
      error: error.message,
    });
  }
};

export const saveWishlistController = async (req, res) => {
  try {
    console.log("Wishlist SAVE - req.user:", req.user, "body:", req.body);

    if (!req.user?._id) {
      return res.status(400).send({
        success: false,
        message: "User not authenticated",
      });
    }

    const { items } = req.body; // [{ product }]

    if (!Array.isArray(items)) {
      return res.status(400).send({
        success: false,
        message: "Items must be an array",
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        items,
      });
    } else {
      wishlist.items = items;
    }

    await wishlist.save();

    return res.status(200).send({
      success: true,
      message: "Wishlist saved",
    });
  } catch (error) {
    console.error("Save wishlist error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to save wishlist",
      error: error.message,
    });
  }
};
