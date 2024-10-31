import { Home, LayoutDashboard, Settings } from "lucide-react";
import { Layers3Icon, MessageCircleQuestion } from "lucide-react";

export const sidebarApplicationItems = [
  {
    title: "Home",
    url: "/",
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
    title: "Changelog",
    url: "/changelogs",
    icon: Layers3Icon,
  },
  {
    title: "Support",
    url: "/support",
    icon: MessageCircleQuestion,
  },
];
