import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (res?.data?.success) {
        toast.success(res.data.message);

        // SAVE AUTH STATE
        const authData = {
          user: res.data.user,
          token: res.data.token,
        };

        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));

        // ROLE BASED REDIRECT
        if (Number(res.data.user.role) === 1) {
          navigate("/dashboard/admin", { replace: true });
        } else {
          navigate("/dashboard/user", { replace: true });
        }
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Ecommerce App">
      <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
          <h4 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-white">
            LOGIN
          </h4>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
            >
              SIGN IN
            </button>

            <p className="text-center text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline transition-colors"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
