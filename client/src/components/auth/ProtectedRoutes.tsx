import { PropsWithChildren, useEffect } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
      <main className="flex flex-col min-h-screen min-w-[calc(100%-12rem)] bg-background text-foreground">
        <div className="overflow-y-auto h-full">
          <SidebarTrigger />
          <Separator />
          <div className="container mx-auto  overflow-y-auto my-auto">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  ) : (
    <Navigate to="/auth" />
  );
}
