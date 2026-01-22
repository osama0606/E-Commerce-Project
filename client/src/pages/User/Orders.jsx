import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "../../utils/axios";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getStatusClasses = (status) => {
    const s = status?.toLowerCase();
    if (s === "processing") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
    if (s === "shipped") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (s === "delivered") {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
    if (s === "cancelled" || s === "canceled") {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
  };

  const getPaymentClasses = (success) =>
    success
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

  const getOrderTotalINR = (order) => {
    const total =
      order?.products?.reduce(
        (sum, p) => sum + Number(p.price || 0) * (p.quantity || 1),
        0
      ) || 0;
    return total.toLocaleString("en-IN");
  };

  return (
    <Layout title="My Orders - Ecommerce App">
      <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white rounded-2xl p-8 shadow-lg transition-colors">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📦 My Orders</h1>
          <p className="text-blue-100 dark:text-blue-200">
            View and track all your orders in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <UserMenu />
          </div>

          {/* Orders section */}
          <div className="md:col-span-3">
            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 font-semibold">
                    Loading your orders...
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && orders?.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-12 text-center border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="text-6xl mb-4">📭</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No orders yet
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You have not placed any orders yet. Start shopping to see your
                  orders here.
                </p>
                <a
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Continue shopping
                </a>
              </div>
            )}

            {/* Orders list */}
            {!loading && orders?.length > 0 && (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div
                    key={order._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all"
                  >
                    {/* Order header */}
                    <button
                      type="button"
                      className="w-full text-left bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order._id ? null : order._id
                        )
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              Order #{index + 1}
                            </h3>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                                order?.status
                              )}`}
                            >
                              {order?.status || "Pending"}
                            </span>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentClasses(
                                order?.payment?.success
                              )}`}
                            >
                              {order?.payment?.success
                                ? "✅ Paid"
                                : "❌ Pending"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                                Order date
                              </p>
                              <p className="text-slate-900 dark:text-white font-semibold">
                                {order?.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                                Items
                              </p>
                              <p className="text-slate-900 dark:text-white font-semibold">
                                {order?.products?.length || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                                Total
                              </p>
                              <p className="text-emerald-600 dark:text-emerald-300 font-bold">
                                ₹{getOrderTotalINR(order)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                                Customer
                              </p>
                              <p className="text-slate-900 dark:text-white font-semibold text-sm">
                                {order?.buyer?.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expand icon */}
                        <svg
                          className={`w-6 h-6 text-slate-600 dark:text-slate-400 transition-transform flex-shrink-0 ${
                            expandedOrder === order._id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Order details */}
                    {expandedOrder === order._id && (
                      <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-800 transition-colors">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                          📦 Order items
                        </h4>

                        <div className="space-y-4">
                          {order?.products?.map((product) => (
                            <div
                              key={product._id}
                              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400 transition-all"
                            >
                              <div className="flex gap-4">
                                {/* Product image */}
                                <div className="flex-shrink-0 w-24 h-24">
                                  <img
                                    src={`/api/v1/product/product-photo/${product._id}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.src = "/placeholder.jpg";
                                    }}
                                  />
                                </div>

                                {/* Product info */}
                                <div className="flex-1">
                                  <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                                    {product.name}
                                  </h5>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {product.description?.substring(0, 60)}...
                                  </p>
                                  <div className="flex justify-between items-center text-sm">
                                    <div className="space-y-1">
                                      <p className="text-slate-600 dark:text-slate-400">
                                        <span className="font-semibold">
                                          Price:
                                        </span>{" "}
                                        ₹
                                        {Number(
                                          product.price || 0
                                        ).toLocaleString("en-IN")}
                                      </p>
                                      <p className="text-slate-600 dark:text-slate-400">
                                        <span className="font-semibold">
                                          Quantity:
                                        </span>{" "}
                                        {product.quantity || 1}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-emerald-600 dark:text-emerald-300">
                                        ₹
                                        {(
                                          Number(product.price || 0) *
                                          (product.quantity || 1)
                                        ).toLocaleString("en-IN")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order summary */}
                        <div className="mt-6 p-4 bg-white dark:bg-slate-900 rounded-xl border-l-4 border-emerald-600 dark:border-emerald-500 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              Order total:
                            </span>
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                              ₹{getOrderTotalINR(order)}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors">
                            📍 Track order
                          </button>
                          <button className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors">
                            💬 Support
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
