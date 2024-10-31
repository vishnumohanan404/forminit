import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

const DashboardBreadcrumb = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center gap-1 capitalize font-medium text-muted text-slate-600 text-sm">
      <ChevronRight className="h-4 w-4"/> {children}
    </div>
  );
};

export default DashboardBreadcrumb;
