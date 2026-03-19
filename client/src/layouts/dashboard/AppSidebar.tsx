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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDashboard } from "@/services/dashboard";
import { sidebarApplicationItems, productItems } from "@/assets/sidebar";
import CreateWorkspaceDialog from "@/components/dashboard/CreateWorkspaceDialog";
import { Button } from "@/components/ui/button";
import { PanelLeftCloseIcon, PanelLeftOpenIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteWorkspace } from "@/services/workspace";
import { toast } from "sonner";

export function AppSidebar() {
  const location = useLocation();
  const currentWorkspaceId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const { data: dashboard, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 10000,
  });
  const { open, toggleSidebar } = useSidebar();
  const [showTrash, setShowTrash] = useState("");
  const queryClient = useQueryClient();

  const { mutate: deleteWorkspaceMutate } = useMutation({
    mutationFn: (workspaceDetails: string) => deleteWorkspace(workspaceDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Workspace deletion failed");
    },
  });

  return (
    <Sidebar
      collapsible="icon"
      className="top-12 h-[calc(100svh-3rem)]"
    >
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isError &&
                sidebarApplicationItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    {item.type === "collapsible" ? (
                      <Collapsible
                        defaultOpen
                        className="group/collapsible"
                      >
                        <div className="flex">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {open && (
                            <CreateWorkspaceDialog>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <PlusIcon />
                              </Button>
                            </CreateWorkspaceDialog>
                          )}
                        </div>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {!isError && dashboard ? (
                              dashboard.workspaces?.map(
                                (workspace: {
                                  name: string;
                                  _id: string;
                                  forms: Array<string>;
                                }) => (
                                  <SidebarMenuButton
                                    asChild
                                    key={workspace._id}
                                    isActive={currentWorkspaceId === workspace._id}
                                    onMouseOver={() => setShowTrash(workspace._id)}
                                    onMouseOut={() => setShowTrash("")}
                                  >
                                    <div className="flex truncate justify-between items-center w-full px-2 py-1 rounded-md">
                                      <Link
                                        to={`/workspaces/${workspace._id}?name=${workspace.name}`}
                                        className="w-full"
                                      >
                                        <span className="w-full">{workspace.name}</span>
                                      </Link>
                                      {showTrash === workspace._id && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Trash2Icon className="cursor-pointer stroke-current hover:stroke-muted-foreground w-4 h-4 shrink-0" />
                                          </DialogTrigger>
                                          <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-md">
                                            <DialogHeader>
                                              <DialogTitle>Deleting workspace</DialogTitle>
                                              <DialogDescription>
                                                All your forms will be deleted
                                              </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="gap-3">
                                              <Button
                                                variant="destructive"
                                                onClick={() => deleteWorkspaceMutate(workspace._id)}
                                              >
                                                Delete
                                              </Button>
                                              <DialogClose asChild>
                                                <Button variant="secondary">Cancel</Button>
                                              </DialogClose>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </div>
                                  </SidebarMenuButton>
                                ),
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
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
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
          <SidebarGroupLabel>Product</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground"
              tooltip={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
