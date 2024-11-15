import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceType } from "@/lib/types";

const HomeStatsCard = ({
  isLoading,
  workspaces,
}: {
  isLoading: boolean;
  workspaces: Array<WorkspaceType>;
}) => {
  return (
    <Card>
      {isLoading ? (
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
          <CardHeader className="pb-3">
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">
                  {workspaces?.reduce(
                    (sum: number, workspace: WorkspaceType) =>
                      sum + workspace.forms.length,
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Forms</p>
              </div>
              <div className="text-muted-foreground">
                <p className="text-2xl font-bold">
                  {workspaces?.reduce(
                    (sum: number, workspace: WorkspaceType) => {
                      return (
                        sum +
                        workspace.forms.filter(
                          (form) => form.published === true
                        ).length
                      );
                    },
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {workspaces?.reduce(
                    (sum: number, workspace: WorkspaceType) => {
                      return (
                        sum +
                        workspace.forms.reduce(
                          (formSum, form) => formSum + form.submissions,
                          0
                        )
                      );
                    },
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Submissions</p>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default HomeStatsCard;
