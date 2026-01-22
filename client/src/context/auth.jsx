import { useState, useEffect, useContext, createContext } from "react";
import axios from "../utils/axios"; // ✅ use project axios instance

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [loading, setLoading] = useState(true);

  // Set Authorization header
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  // Load auth from localStorage (once)
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      try {
        const parseData = JSON.parse(data);
        setAuth({
          user: parseData.user,
          token: parseData.token,
        });
      } catch (e) {
        console.error("AUTH PARSE ERROR:", e);
        setAuth({ user: null, token: "" });
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth, loading]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
