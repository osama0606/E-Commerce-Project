import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// Payment Gateway (Braintree Sandbox)
export const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// ==================== PRODUCT CONTROLLERS ====================

// Create Product
export const createProductController = async (req, res) => {
  try {
    let { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // ✅ ensure numeric types
    price = Number(price);
    quantity = Number(quantity);

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case price == null || Number.isNaN(price):
        return res.status(400).send({ error: "Valid Price is Required" });
      case quantity == null || Number.isNaN(quantity):
        return res.status(400).send({ error: "Valid Quantity is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case photo && photo.size > 5000000:
        return res
          .status(400)
          .send({ error: "Photo should be less than 5MB" });
    }

    const products = new productModel({
      ...req.fields,
      price,
      quantity,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Get All Products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
  }
};

// Get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res
      .status(200)
      .send({ success: true, message: "Product Fetched", product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Error fetching product",
        error: error.message,
      });
  }
};

// Get Product Photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("photo");

    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).send({
        success: false,
        message: "Product photo not found",
      });
    }

    res.set("Content-Type", product.photo.contentType);
    return res.status(200).send(product.photo.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting product photo",
      error: error.message,
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res
      .status(200)
      .send({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Error deleting product",
        error: error.message,
      });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    let { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // ✅ ensure numeric types
    price = Number(price);
    quantity = Number(quantity);

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case price == null || Number.isNaN(price):
        return res.status(400).send({ error: "Valid Price is Required" });
      case quantity == null || Number.isNaN(quantity):
        return res.status(400).send({ error: "Valid Quantity is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case photo && photo.size > 5000000:
        return res
          .status(400)
          .send({ error: "Photo should be less than 5MB" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        price,
        quantity,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
  }
};

// ==================== FILTERS & SEARCH ====================

// Product Filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({
        success: false,
        message: "Error filtering products",
        error: error.message,
      });
  }
};

// Product Count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({
        success: false,
        message: "Error counting products",
        error: error.message,
      });
  }
};

// Products List (Pagination)
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? parseInt(req.params.page) : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({
        success: false,
        message: "Error in pagination",
        error: error.message,
      });
  }
};

// Search Products
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.status(200).send({ success: true, results });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({
        success: false,
        message: "Error searching products",
        error: error.message,
      });
  }
};

// Related Products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({
        success: false,
        message: "Error fetching related products",
        error: error.message,
      });
  }
};

// Products by Category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({
        success: false,
        message: "Error fetching category products",
        error: error.message,
      });
  }
};

// ==================== BRAINTREE PAYMENT ====================

// Generate Token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res.status(500).send({ success: false, error: err });
      }
      res.send({ success: true, token: response.clientToken });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Error generating token",
        error: error.message,
      });
  }
};

// Process Payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;

    if (!nonce) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Payment nonce is required",
        });
    }

    if (!cart || cart.length === 0) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Cart is empty",
        });
    }

    let total = cart.reduce((acc, item) => acc + item.price, 0);

    gateway.transaction.sale(
      {
        amount: total.toFixed(2),
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      async (error, result) => {
        if (error) {
          console.error("❌ Braintree Error:", error);
          return res.status(500).send({
            success: false,
            message: "Payment processing error",
            error: error.message,
          });
        }

        if (!result) {
          console.error("❌ No result from Braintree");
          return res.status(500).send({
            success: false,
            message: "Payment processing failed - no response",
          });
        }

        if (!result.success) {
          console.error("❌ Transaction Failed:", result.message);
          return res.status(402).send({
            success: false,
            message: result.message || "Payment declined by bank",
            result,
          });
        }

        const validStatuses = [
          "authorized",
          "submitted_for_settlement",
          "settling",
          "settled",
        ];

        if (
          !result.transaction ||
          !validStatuses.includes(result.transaction.status)
        ) {
          console.error(
            "❌ Invalid Transaction Status:",
            result.transaction?.status
          );
          return res.status(402).send({
            success: false,
            message: `Payment failed - Status: ${
              result.transaction?.status || "unknown"
            }`,
          });
        }

        try {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          });

          await order.save();

          console.log("✅ Order Created:", order._id);

          return res.status(200).send({
            success: true,
            message: "Payment successful and order created",
            order,
          });
        } catch (dbError) {
          console.error("❌ Database Error:", dbError);
          return res.status(500).send({
            success: false,
            message: "Payment successful but order creation failed",
            error: dbError.message,
          });
        }
      }
    );
  } catch (error) {
    console.error("❌ Payment Controller Error:", error);
    res.status(500).send({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};
