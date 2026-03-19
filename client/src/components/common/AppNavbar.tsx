import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import Logo from "@/components/svg/Logo";
import { DarkModeToggle } from "./DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppNavbar = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const section = location.pathname.split("/")[1];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-12 border-b border-border bg-sidebar flex items-center px-4 gap-3">
      <Link
        to="/"
        className="flex items-center gap-2 shrink-0"
      >
        <div className="h-6 w-6">
          <Logo />
        </div>
        <span className="text-sm font-semibold text-foreground">FormInIt</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5 leading-none">
          beta
        </span>
      </Link>

      <div className="h-4 w-px bg-border shrink-0" />

      <span className="text-sm text-muted-foreground capitalize">{section}</span>

      <div className="ml-auto flex items-center gap-1">
        <DarkModeToggle />

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="h-7 w-7 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center hover:bg-primary/30 transition-colors ml-1 cursor-pointer">
              {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52"
          >
            <div className="px-2 py-2">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
            </div>
            <DropdownMenuSeparator />
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer">Account</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setUser(null)}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppNavbar;
