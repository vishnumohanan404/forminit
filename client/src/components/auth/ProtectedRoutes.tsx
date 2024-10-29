import { PropsWithChildren, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

type ProtectedRouteProps = PropsWithChildren;
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth(); // Check the user's authentication status here
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/auth");
      return;
    }
  }, [navigate, user]);
  return user ? children : <Navigate to="/auth" />;
}
