// controllers/cartController.js
import Cart from "../models/cartModel.js";

export const getCartController = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    // Filter out items where product is null (deleted products)
    const validItems = (cart?.items || []).filter(item => item.product);
    res.status(200).send({
      success: true,
      cart: validItems,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to load cart" });
  }
};

export const saveCartController = async (req, res) => {
  try {
    const { items } = req.body; // [{ product: productId, quantity }]
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { new: true, upsert: true }
    );
    res.status(200).send({ success: true, message: "Cart saved" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to save cart" });
  }
};
