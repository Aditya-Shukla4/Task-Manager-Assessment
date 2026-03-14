import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { AUTH_ENDPOINTS } from "../api/endpoints";
import { decryptPayload } from "../utils/encryption";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, verify session with backend instead of trusting localStorage
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axiosInstance.get(AUTH_ENDPOINTS.ME);
        if (res.data.encryptedData) {
          const userData = decryptPayload(res.data.encryptedData);
          if (userData) setUser(userData);
        }
      } catch {
        setUser(null); // Cookie invalid or expired
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    if (res.data.encryptedData) {
      const userData = decryptPayload(res.data.encryptedData);
      if (userData) {
        setUser(userData);
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
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
