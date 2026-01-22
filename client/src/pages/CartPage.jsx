import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropInLib from "braintree-web-drop-in-react";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const DropIn = DropInLib.default || DropInLib;

const CartPage = () => {
  const [auth] = useAuth();
  const { cart, removeCartItem, updateCartItemQuantity, clearCart } = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;

  // ✅ Total in pure INR (no conversion)
  const totalPrice = () => {
    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0
    );
    return total.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  // ✅ Backend amount bhi INR me
  const getTotalAmount = () => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0
    );
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.token || "");
    } catch (error) {
      console.error("Token error:", error);
      toast.error("Failed to load payment gateway");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getToken();
    } else {
      clearCart();
    }
  }, [auth?.token]);

  const handlePayment = async () => {
    if (!instance) {
      toast.error("❌ Payment form not ready. Please refresh.");
      return;
    }

    if (!auth?.user?.address) {
      toast.error("⚠️ Please add delivery address before payment");
      return;
    }

    if (cart.length === 0) {
      toast.error("❌ Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      let nonce;
      try {
        const result = await instance.requestPaymentMethod();
        if (!result || !result.nonce) {
          toast.error(
            "❌ Invalid card details.\nPlease fill card number, expiry and CVV."
          );
          setLoading(false);
          return;
        }
        nonce = result.nonce;
      } catch (formError) {
        console.error("Form validation error:", formError);
        toast.error(
          "❌ Please enter valid card number, expiry date and CVV (3–4 digits)."
        );
        setLoading(false);
        return;
      }

      const processingToast = toast.loading("⏳ Processing your payment...");
      const totalAmount = getTotalAmount();

      const { data } = await axios.post(
        "/api/v1/product/braintree/payment",
        {
          nonce,
          cart,
          amount: totalAmount,
        }
      );

      toast.dismiss(processingToast);

      if (data?.success) {
        const finalOrderId = data?.order?._id || "ORDER";

        toast.success(
          (t) => (
            <div className="text-sm">
              <p className="font-bold text-green-700 mb-2">
                ✅ Order Placed Successfully!
              </p>
              <p className="text-green-600 mb-1">
                Order ID:{" "}
                <span className="font-mono font-bold">
                  {finalOrderId.slice(-8)}
                </span>
              </p>
              <p className="text-green-600 mb-1">
                Amount: <span className="font-bold">{totalPrice()}</span>
              </p>
              <p className="text-green-600 text-xs mt-2">
                Redirecting to orders...
              </p>
            </div>
          ),
          { duration: 4000 }
        );

        clearCart();
        setTimeout(() => {
          navigate("/dashboard/user/orders");
        }, 2500);
      } else {
        toast.error(`❌ Payment failed: ${data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Payment error:", error);

      if (error.response?.status === 400) {
        toast.error("❌ Invalid payment details.\nPlease check card and CVV.");
      } else if (error.response?.status === 402) {
        toast.error("❌ Payment declined by bank.\nPlease try another card.");
      } else {
        toast.error("❌ Payment failed.\nPlease try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!Array.isArray(cart)) {
    return (
      <Layout title="Cart">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600 font-semibold">
            Cart error, please refresh.
          </p>
        </div>
      </Layout>
    );
  }

  if (!auth?.token) {
    return (
      <Layout title="Cart">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-12 text-center transition-colors">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Login Required</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              Please login to view your cart and continue shopping.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cart">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-center text-3xl font-bold mb-2">
          {auth?.user ? `Shopping Cart - ${auth.user.name}` : "Shopping Cart"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 transition-colors">
          {cart.length
            ? `You have ${cart.length} item${
                cart.length !== 1 ? "s" : ""
              } in your cart`
            : "Your cart is empty"}
        </p>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-4">
              {cart.map((item) => {
                const itemTotal =
                  Number(item.price) * (item.quantity || 1);
                return (
                  <div
                    key={item._id}
                    className="flex gap-4 border border-slate-200 dark:border-slate-700 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all transition-colors"
                  >
                    <img
                      src={`${API}/api/v1/product/product-photo/${item._id}`}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">
                        {item.description?.substring(0, 50)}...
                      </p>
                      <div className="flex justify-between mt-4 items-center">
                        <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 transition-colors">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(
                                item._id,
                                Math.max((item.quantity || 1) - 1, 1)
                              )
                            }
                            className="px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
                          >
                            −
                          </button>
                          <span className="px-3 font-semibold text-slate-900 dark:text-white">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              updateCartItemQuantity(
                                item._id,
                                (item.quantity || 1) + 1
                              )
                            }
                            className="px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-lg">
                          ₹
                          {itemTotal.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <button
                          onClick={() => removeCartItem(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="md:col-span-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-lg sticky top-24 transition-colors">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Order Summary</h2>
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-400 transition-colors">Subtotal:</span>
                    <span className="font-semibold">{totalPrice()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-400 transition-colors">Shipping:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400 transition-colors">Tax:</span>
                    <span className="font-semibold">
                      Calculated at checkout
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-2xl font-bold mb-6">
                  <span>Total:</span>
                  <span className="text-green-600">{totalPrice()}</span>
                </div>

                {auth?.user?.address ? (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      📍 Delivery Address
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {auth.user.address}
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="text-blue-600 text-sm hover:underline font-semibold"
                    >
                      ✏️ Change Address
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/dashboard/user/profile")}
                    className="w-full border-2 border-red-300 text-red-600 px-4 py-3 mb-6 rounded-lg hover:bg-red-50 font-semibold transition"
                  >
                    ⚠️ Add Delivery Address (Required)
                  </button>
                )}

                {clientToken && cart.length > 0 && (
                  <>
                    <div className="my-6 p-4 bg-blue-50 rounded border border-blue-200">
                      <h3 className="font-semibold text-sm mb-3">
                        💳 Payment Method
                      </h3>
                      <p className="text-xs text-red-600 font-bold mb-3">
                        ⚠️ CVV IS MANDATORY - All fields MUST be filled
                      </p>
                      <DropIn
                        options={{ authorization: clientToken }}
                        onInstance={(inst) => {
                          setInstance(inst);
                        }}
                        onError={(err) => {
                          console.error("DropIn error:", err);
                          toast.error(
                            "Payment form error - Please try refreshing"
                          );
                        }}
                      />
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                      className={`w-full py-3 rounded-lg font-semibold transition mb-2 ${
                        loading || !instance || !auth?.user?.address
                          ? "bg-gray-400 cursor-not-allowed text-gray-600"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {loading ? (
                        <span>⏳ Processing Payment...</span>
                      ) : (
                        <span>💰 Place Order</span>
                      )}
                    </button>

                    <button
                      onClick={() => navigate("/")}
                      className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Continue Shopping
                    </button>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      <strong>Test Card:</strong> 4111 1111 1111 1111 |{" "}
                      <strong>Expiry:</strong> 12/25 | <strong>CVV:</strong> 123
                      (Required!)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
