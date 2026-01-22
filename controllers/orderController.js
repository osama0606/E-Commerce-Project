import orderModel from "../models/orderModel.js";

// GET ALL ORDERS (ADMIN)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
      error,
    });
  }
};



// UPDATE ORDER STATUS
export const updateOrderStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Order status update failed",
      error,
    });
  }
};
