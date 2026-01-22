// controllers/adminController.js
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

// GET OVERALL STATS
export const getAdminStatsController = async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount, revenueAgg] =
      await Promise.all([
        userModel.countDocuments(),
        productModel.countDocuments(),
        orderModel.countDocuments(),
        orderModel.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$payment.transaction.amount" },
            },
          },
        ]),
      ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.status(200).send({
      success: true,
      stats: {
        usersCount,
        productsCount,
        ordersCount,
        totalRevenue: Number(totalRevenue),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to load admin stats",
      error,
    });
  }
};

// RECENT ORDERS (LAST 5)
export const getRecentOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("buyer", "name email")
      .populate("products", "price")
      .sort({ createdAt: -1 })
      .limit(5);

    const mapped = orders.map((o) => {
      const totalAmount = o.products.reduce((sum, p) => sum + (p.price || 0), 0);
      return {
        _id: o._id,
        buyer: o.buyer,
        products: o.products,
        status: o.status,
        createdAt: o.createdAt,
        totalAmount,
      };
    });

    res.status(200).send({
      success: true,
      orders: mapped,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to load recent orders",
      error,
    });
  }
};

// RECENT USERS (LAST 5)
export const getRecentUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to load recent users",
      error,
    });
  }
};
