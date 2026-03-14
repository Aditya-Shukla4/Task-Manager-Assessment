import axios from "axios";

const axiosInstance = axios.create({
  // IMPORTANT: In production, we use the environment variable from Vercel
  // In local development, we fallback to localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
