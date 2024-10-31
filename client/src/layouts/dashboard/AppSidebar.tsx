import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/services/dashboard";
import { sidebarApplicationItems, productItems } from "@/assets/sidebar";
import CreateWorkspaceDialog from "@/components/dashboard/CreateWorkspaceDialog";

export function AppSidebar() {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 10000,
  });
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Application</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarApplicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.type === "collapsible" ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <>
                        <div className="flex">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CreateWorkspaceDialog />
                        </div>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {dashboard ? (
                              dashboard.workspaces?.map(
                                (workspace: {
                                  name: string;
                                  _id: string;
                                  forms: Array<string>;
                                }) => (
                                  <SidebarMenuButton
                                    asChild
                                    key={workspace._id}
                                  >
                                    <Link
                                      to={`/workspaces/${workspace._id}?name=${workspace.name}`}
                                    >
                                      <span>{workspace.name}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                )
                              )
                            ) : (
                              <>
                                <SidebarMenuButton asChild>
                                  <SidebarMenuSkeleton className="h-8 w-[150px]" />
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild>
                                  <SidebarMenuSkeleton className="h-8 w-[150px]" />
                                </SidebarMenuButton>
                              </>
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Product</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {productItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
