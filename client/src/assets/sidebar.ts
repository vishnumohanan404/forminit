import { Home, LayoutDashboard, Settings } from "lucide-react";
import { MessageCircleQuestion } from "lucide-react";

export const sidebarApplicationItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Workspaces",
    url: "/workspaces",
    icon: LayoutDashboard,
    type: "collapsible",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
export const productItems = [
  {
    title: "Support",
    url: "/support",
    icon: MessageCircleQuestion,
  },
];
