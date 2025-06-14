import { User } from "@/lib/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthProviderProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthProviderProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const value: AuthProviderProps = {
    user,
    setUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context: AuthProviderProps | null = useContext(AuthContext);
  // to make sure the useAuth is used only within AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};

export const getUserFromContext = () => {
  const context: AuthProviderProps | null = useContext(AuthContext);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  return context.setUser;
};

export default AuthProvider;
