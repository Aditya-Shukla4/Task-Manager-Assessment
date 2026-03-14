import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { AUTH_ENDPOINTS } from "../api/endpoints";
import { decryptPayload } from "../utils/encryption";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("taskUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    // Decrpyt the backend data
    if (res.data.encryptedData) {
      const userData = decryptPayload(res.data.encryptedData);
      if (userData) {
        setUser(userData);
        localStorage.setItem("taskUser", JSON.stringify(userData));
        return true;
      }
    }
    return false;
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
      name,
      email,
      password,
    });

    if (res.data.encryptedData) {
      const userData = decryptPayload(res.data.encryptedData);
      if (userData) {
        setUser(userData);
        localStorage.setItem("taskUser", JSON.stringify(userData));
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    setUser(null);
    localStorage.removeItem("taskUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
