// src/App.jsx – Updated with proper category routes + Wishlist
import { Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Policy from "./pages/Policy";
import Contact from "./pages/Contact";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import CartPage from "./pages/CartPage";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Pagenotfound from "./pages/Pagenotfound";

// Routes Protection
import UserRoute from "./components/Routes/UserRoute";
import AdminRoute from "./components/Routes/AdminRoute";

// User Pages
import Dashboard from "./pages/User/Dashboard";
import Profile from "./pages/User/Profile";
import Orders from "./pages/User/Orders";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import AdminOrders from "./pages/Admin/AdminOrders";
import Users from "./pages/Admin/Users";

function App() {
  return (
    <Routes>
      {/* 🟢 PUBLIC ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* 🟢 CATEGORIES ROUTES */}
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<CategoryProduct />} />

      <Route path="/search" element={<Search />} />
      <Route path="/product/:slug" element={<ProductDetails />} />

      {/* 🟢 USER DASHBOARD ROUTES */}
      <Route path="/dashboard/user" element={<UserRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      {/* 🟢 ADMIN DASHBOARD ROUTES */}
      <Route path="/dashboard/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />

        {/* CATEGORY */}
        <Route path="create-category" element={<CreateCategory />} />

        {/* PRODUCTS */}
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:slug" element={<UpdateProduct />} />

        {/* ORDERS */}
        <Route path="orders" element={<AdminOrders />} />

        {/* USERS */}
        <Route path="users" element={<Users />} />
      </Route>

      {/* 🟢 404 PAGE */}
      <Route path="*" element={<Pagenotfound />} />
    </Routes>
  );
}

export default App;
