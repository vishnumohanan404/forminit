import CreateWorkspaceDialog from "@/components/dashboard/CreateWorkspaceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

const HomeWorkspaceCard = ({
  showSkeleton,
  workspaceCount,
}: {
  showSkeleton: boolean;
  workspaceCount: number;
}) => {
  return (
    <Card>
      {showSkeleton ? (
        <>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Skeleton className="h-8 w-[250px] rounded-xl" />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Workspaces &nbsp;&nbsp;{workspaceCount}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <CreateWorkspaceDialog>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create New Workspace
              </Button>
            </CreateWorkspaceDialog>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default HomeWorkspaceCard;
