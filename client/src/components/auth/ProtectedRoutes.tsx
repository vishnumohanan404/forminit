import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type ProtectedRouteProps = PropsWithChildren;
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuth(); // Check the user's authentication status here
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/auth", { replace: true });
    }
  }, [navigate, user]);
  return children;
}
