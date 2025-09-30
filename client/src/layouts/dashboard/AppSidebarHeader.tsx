import Logo from "@/components/svg/Logo";
import { SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const AppSidebarHeader = () => {
  const { open } = useSidebar();
  return (
    <SidebarHeader className={!open ? "pl-1" : ""}>
      <SidebarMenu>
        <SidebarMenuItem className={open ? "flex items-center gap-1" : ""}>
          <div className={open ? "h-9 w-9" : "h-6 w-6"}>
            <Link to={"/"}>
              <Logo />
            </Link>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
