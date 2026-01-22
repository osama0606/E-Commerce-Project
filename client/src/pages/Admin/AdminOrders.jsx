// src/pages/Admin/AdminOrders.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const STATUS_OPTIONS = [
  "Not Process",
  "Processing",
  "Shipped",
  "deliverd",
  "cancel",
];

const AdminOrders = () => {
  const [status] = useState(STATUS_OPTIONS);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch all orders
  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/order/all-orders");
      if (data?.success) {
        setOrders(data.orders || []);
      } else {
        toast.error("Failed to fetch orders");
      }
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

  // Update order status
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/order/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  // Filtered orders (by status)
  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // Compute total amount per order (from product prices)
  const getOrderTotal = (order) => {
    if (!order?.products) return 0;
    return order.products.reduce((sum, p) => sum + (p.price || 0), 0);
  };

  // Badge color based on status
  const getStatusClasses = (s) => {
    if (s === "deliverd")
      return "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
    if (s === "Processing")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
    if (s === "Shipped")
      return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
    if (s === "cancel")
      return "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
    return "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Admin Menu */}
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          {/* Orders Section */}
          <div className="md:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                All Orders
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Total: {orders.length}
                </span>
                <Select
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  className="w-44 dark:!bg-slate-800 dark:!border-slate-600 dark:!text-slate-100"
                  size="middle"
                  bordered={false}
                >
                  <Option value="All">
                    <span className="text-slate-800 dark:text-slate-100">
                      All Status
                    </span>
                  </Option>
                  {status.map((s) => (
                    <Option key={s} value={s}>
                      <span className="text-slate-800 dark:text-slate-100">
                        {s}
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {loading && (
              <p className="text-center text-slate-500 dark:text-slate-400 mb-4">
                Loading orders...
              </p>
            )}

            {!loading && filteredOrders.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400">
                No orders found for selected filter.
              </p>
            )}

            {filteredOrders.map((o, i) => (
              <div
                key={o._id}
                className="border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm mb-8 overflow-hidden bg-white dark:bg-slate-900 transition-colors"
              >
                {/* Order header + summary */}
                <div className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Order ID:{" "}
                      <span className="font-mono text-slate-900 dark:text-slate-100">
                        #{o._id.slice(-6)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Placed{" "}
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        {moment(o?.createdAt).fromNow()}
                      </span>{" "}
                      • Buyer:{" "}
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {o?.buyer?.name}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={
                        "px-3 py-1 text-xs font-semibold rounded-full " +
                        getStatusClasses(o.status)
                      }
                    >
                      {o.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Total: ₹ {getOrderTotal(o)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        o?.payment?.success
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {o?.payment?.success ? "Paid" : "Payment Failed"}
                    </span>
                  </div>
                </div>

                {/* Order table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Buyer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900">
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            defaultValue={o?.status}
                            onChange={(value) => handleChange(o._id, value)}
                            className="w-40 dark:!bg-slate-800 dark:!border-slate-600 dark:!text-slate-100"
                            size="small"
                            bordered={false}
                          >
                            {status.map((s, idx) => (
                              <Option
                                key={idx}
                                value={s}
                                className="dark:bg-slate-800 dark:text-slate-100"
                              >
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                          {o?.buyer?.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                          {moment(o?.createdAt).format("DD MMM YYYY")}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                          {o?.payment?.success ? "Success" : "Failed"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                          {o?.products?.length}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Products */}
                <div className="p-4 space-y-4">
                  {o?.products?.map((p) => (
                    <div
                      key={p._id}
                      className="flex flex-col md:flex-row gap-4 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm bg-slate-50 dark:bg-slate-800/50 transition-colors"
                    >
                      <div className="md:w-1/4 flex items-center justify-center">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-3/4 space-y-1">
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {p.name}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">
                          {p.description?.substring(0, 60)}...
                        </p>
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          Price: ₹ {p.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
