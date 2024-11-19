import { PropsWithChildren, useEffect, useLayoutEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "@/layouts/dashboard/AppSidebar";
import { Separator } from "../ui/separator";
import DashboardBreadcrumb from "../dashboard/DashboardBreadcrumb";
import AnimatedGradientText from "../ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "../common/DarkModeToggle";

type ProtectedRouteProps = PropsWithChildren;
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth(); // Check the user's authentication status here
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    if (user === null) {
      navigate("/auth");
      return;
    }
  }, [navigate, user]);
  return user ? (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col col-span-1 max-h-full overflow-hidden w-full mb-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <DashboardBreadcrumb>
              {location.pathname.split("/")[1]}
            </DashboardBreadcrumb>
          </div>
          <div className="flex gap-2 items-center mr-2 py-2">
            <AnimatedGradientText className="!bg-none !border-none">
              <Link
                to="https://github.com/vishnumohanan404/forminit"
                target="_blank"
                className={cn(
                  `text-sm font-medium pr-3 inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent px-2`
                )}
              >
                We're on beta
              </Link>
            </AnimatedGradientText>
            <DarkModeToggle />
          </div>
        </div>
        <Separator />
        {children}
      </main>
    </SidebarProvider>
  ) : (
    <Navigate to="/auth" />
  );
}
