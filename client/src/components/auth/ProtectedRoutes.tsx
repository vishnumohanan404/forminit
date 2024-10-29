import { PropsWithChildren, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "@/layouts/dashboard/AppSidebar";
import { Separator } from "../ui/separator";

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
  return user ? (
    <SidebarProvider>
      <AppSidebar />
      <main className="container">
        <SidebarTrigger />
        <Separator />
        {children}
      </main>
    </SidebarProvider>
  ) : (
    <Navigate to="/auth" />
  );
}
