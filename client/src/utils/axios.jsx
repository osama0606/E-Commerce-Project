import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API || "http://localhost:8080",
});

// ✅ AUTH TOKEN INTERCEPTOR (keep this)
instance.interceptors.request.use(
  (config) => {
    try {
      const auth = localStorage.getItem("auth");

      if (auth) {
        const authData = JSON.parse(auth);

        if (authData?.token) {
          config.headers.Authorization = `Bearer ${authData.token}`;
          // console.log("✅ Token added:", authData.token.substring(0, 20) + "...");
        }
      }
    } catch (error) {
      console.error("❌ Auth parse error:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR – softer handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.response?.data?.error;

    // Sirf tab force logout karo jab clearly auth fail ho
    if (
      status === 401 &&
      message &&
      typeof message === "string" &&
      message.toLowerCase().includes("token")
    ) {
      console.error("❌ 401 - Token invalid or expired");
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
