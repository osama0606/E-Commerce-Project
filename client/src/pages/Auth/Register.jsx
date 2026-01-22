import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ===============================
   IMPORTANT: API BASE URL
================================ */
// agar already kahi aur set hai to yeh line optional hai
axios.defaults.baseURL = "http://localhost:8080";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  /* ===============================
     FORM SUBMIT
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <Layout title="Register - Ecommerce App">
      <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Register to start shopping
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-md w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-md w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-md w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-md w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-md w-full md:col-span-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            />

            <input
              type="text"
              placeholder="Security Answer (e.g. favourite sport)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-md w-full md:col-span-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 dark:bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
            >
              CREATE ACCOUNT
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="text-center mt-6">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
