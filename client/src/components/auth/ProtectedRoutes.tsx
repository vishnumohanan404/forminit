import { PropsWithChildren, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "@/layouts/dashboard/AppSidebar";
import { Separator } from "../ui/separator";
import { DarkModeToggle } from "../common/DarkModeToggle";
import DashboardBreadcrumb from "../dashboard/DashboardBreadcrumb";
import { Footer } from "../common/Footer";

type ProtectedRouteProps = PropsWithChildren;
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth(); // Check the user's authentication status here
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user === null) {
      navigate("/auth");
      return;
    }
  }, [navigate, user]);
  return user ? (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col col-span-1 min-h-screen max-h-screen overflow-hidden w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <DashboardBreadcrumb>
              {location.pathname.split("/")[1]}
            </DashboardBreadcrumb>
          </div>
        </div>

        <Separator />
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  ) : (
    <Navigate to="/auth" />
  );
}
