import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      const p = data.product;
      setName(p.name);
      setId(p._id);
      setDescription(p.description);
      setPrice(p.price);
      setQuantity(p.quantity);
      setShipping(p.shipping?.toString?.() ?? "0");
      setCategory(p.category?._id || "");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch product");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data.category || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Valid quantity is required");
      return false;
    }
    if (!category) {
      toast.error("Category is required");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const productData = new FormData();
      productData.append("name", name.trim());
      productData.append("description", description.trim());
      productData.append("price", String(Number(price)));
      productData.append("quantity", String(Number(quantity)));
      productData.append("category", category);
      productData.append("shipping", shipping);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Update Failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Something went wrong while updating"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          <div className="lg:col-span-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300">
            <h1 className="text-4xl font-playfair font-bold text-slate-900 dark:text-white mb-12 text-center">
              Update Product
            </h1>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Category Select */}
              <div>
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Select Category
                </label>
                <Select
                  bordered={false}
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  className="w-full dark:!bg-slate-800 dark:!border-slate-600 dark:!text-slate-200"
                  onChange={(value) => setCategory(value)}
                  value={category || undefined}
                  disabled={loading || deleting}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl hover:border-slate-900 dark:hover:border-slate-200 transition-all duration-300 cursor-pointer bg-slate-50 dark:bg-slate-800 group hover:bg-slate-100 dark:hover:bg-slate-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhoto(file);
                      }
                      e.target.value = null;
                    }}
                    className="hidden"
                    disabled={loading || deleting}
                  />
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="preview"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    id && (
                      <img
                        src={`${
                          import.meta.env.VITE_API
                        }/api/v1/product/product-photo/${id}`}
                        alt="product_photo"
                        className="h-full w-full object-cover rounded-xl"
                      />
                    )
                  )}
                </label>
              </div>

              {/* Product Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Product Name"
                    disabled={loading || deleting}
                    className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    placeholder="Price"
                    disabled={loading || deleting}
                    className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Description
                </label>
                <textarea
                  value={description}
                  placeholder="Description"
                  rows={4}
                  disabled={loading || deleting}
                  className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 resize-vertical bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    placeholder="Quantity"
                    disabled={loading || deleting}
                    className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Shipping
                  </label>
                  <Select
                    bordered={false}
                    placeholder="Select Shipping"
                    size="large"
                    className="w-full dark:!bg-slate-800 dark:!border-slate-600 dark:!text-slate-200"
                    onChange={(value) => setShipping(value)}
                    value={shipping || undefined}
                    disabled={loading || deleting}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>
              </div>

              {/* Buttons - Light in both modes */}
              <div className="flex gap-4">
                <button
                  disabled={loading || deleting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/50"
                  onClick={handleUpdate}
                >
                  {loading ? "Updating..." : "🚀 Update Product"}
                </button>
                <button
                  disabled={loading || deleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-red-400/50"
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting..." : "🗑 Delete Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
