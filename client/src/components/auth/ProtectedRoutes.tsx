import { PropsWithChildren, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type ProtecctedRouteProps = PropsWithChildren;
export default function ProtectedRoute({ children }: ProtecctedRouteProps) {
  const user = useAuth(); // Check the user's authentication status here
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/auth", { replace: true });
    }
  }, [navigate, user]);
  return children;
}
