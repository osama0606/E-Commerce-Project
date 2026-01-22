// src/components/Routes/UserRoute.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "../../utils/axios"; // ✅ project axios instance

export default function UserRoute() {
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);
  const [auth, , loadingAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/user-auth");
        setOk(res.data.ok);
      } catch (error) {
        console.log(error);
        setOk(false);
      } finally {
        setChecking(false);
      }
    };

    // 🔑 Pehle AuthProvider ka loading khatam hone do
    if (!loadingAuth) {
      if (auth?.token) {
        authCheck();
      } else {
        // Token hi nahi hai, to check ki zarurat nahi
        setChecking(false);
        setOk(false);
      }
    }
  }, [auth?.token, loadingAuth]);

  // Jab tak auth load ho raha hai ya user-auth check ho raha hai
  if (loadingAuth || checking) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Checking User Access...
      </div>
    );
  }

  // Agar ok true hai to child routes, warna login
  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
