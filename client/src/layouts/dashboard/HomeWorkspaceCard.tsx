import CreateWorkspaceDialog from "@/components/dashboard/CreateWorkspaceDialog";
import { Plus } from "lucide-react";

const HomeWorkspaceCard = () => {
  return (
    <div className="w-52 h-52 rounded-xl bg-muted group relative overflow-hidden">
      <div className="flex items-center justify-center h-full w-full">
        <div className="cursor-pointer rounded-full border-dashed border-2 p-3 border-gray-500 group-hover:border-gray-400 transition-colors">
          <Plus />
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute rounded-xl inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
        <CreateWorkspaceDialog>
          <span className="text-white font-medium text-lg">Create workspace</span>
        </CreateWorkspaceDialog>
      </div>
    </div>
  );
};

export default HomeWorkspaceCard;
