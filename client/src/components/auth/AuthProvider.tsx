import { User } from "@/lib/types";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const AuthContext = createContext<User | null>(null);

type AuthProviderProps = PropsWithChildren & {
  isSignedIn?: boolean;
};

const AuthProvider = ({ children, isSignedIn }: AuthProviderProps) => {
  const [user] = useState<User | null>(isSignedIn ? { id: 1 } : null);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};

export default AuthProvider;
