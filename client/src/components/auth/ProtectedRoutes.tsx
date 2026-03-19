import { PropsWithChildren, useLayoutEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "@/layouts/dashboard/AppSidebar";
import AppNavbar from "@/components/common/AppNavbar";

type ProtectedRouteProps = PropsWithChildren;
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user === null) {
      navigate("/auth");
      return;
    }
  }, [navigate, user]);

  return user ? (
    <SidebarProvider defaultOpen={true}>
      <AppNavbar />
      <AppSidebar />
      <div className="flex flex-col flex-1 pt-12">
        <main className="flex flex-col flex-1 overflow-auto pb-8">{children}</main>
      </div>
    </SidebarProvider>
  ) : (
    <Navigate to="/auth" />
  );
}
