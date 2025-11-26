import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // ---------------------------
  // 🔹 LOGIN using backend
  // ---------------------------
  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Invalid credentials");
    }

    // save token
    localStorage.setItem("token", data.token);

    // Backend returns ONLY token, so we store email manually
    const loggedUser: User = {
      id: data.id || "",
      email,
    };

    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);

    navigate("/dashboard");
  };

  // ---------------------------
  // 🔹 REGISTER using backend
  // ---------------------------
  const register = async (email: string, password: string) => {
    const res = await fetch("http://localhost:9000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Registration failed");
    }

    // After register → go to login page
    navigate("/login");
  };

  // ---------------------------
  // 🔹 LOGOUT
  // ---------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
