import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API || "http://localhost:8080";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    try {
      const auth = localStorage.getItem("auth");
      if (auth) {
        const authData = JSON.parse(auth);
        if (authData?.token) {
          config.headers.Authorization = `Bearer ${authData.token}`;
        }
      }
    } catch (error) {
      console.error("Auth parse error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.response?.data?.error;

    if (
      status === 401 &&
      message &&
      typeof message === "string" &&
      message.toLowerCase().includes("token")
    ) {
      console.error("401 - Token invalid or expired");
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
