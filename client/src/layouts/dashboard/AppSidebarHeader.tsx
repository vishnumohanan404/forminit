import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

/* The logo lives in AppNavbar. This header slot is kept minimal. */
const AppSidebarHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem />
    </SidebarMenu>
  );
};

export default AppSidebarHeader;
