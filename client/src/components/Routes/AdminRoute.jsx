// src/components/Routes/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "../../utils/axios";
import Spinner from "../Spinner"; // agar tere paas koi loader component hai

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, , loading] = useAuth(); // ✅ loading bhi le lo

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/admin-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.log(error);
        setOk(false);
      }
    };

    // 🔑 IMPORTANT:
    // Jab tak AuthProvider loading me hai, kuch mat karo
    if (!loading && auth?.token) {
      authCheck();
    }
  }, [auth?.token, loading]);

  // Jab tak AuthProvider loading me hai → pura app ek loader dikhaye
  if (loading) {
    return <Spinner />; // ya koi simple "Loading..." text
  }

  // Jab tak admin-auth ka result nahi aaya
  if (!ok) {
    return <Spinner />; // ya redirect logic jo pehle tha
  }

  return <Outlet />;
};

export default AdminRoute;
