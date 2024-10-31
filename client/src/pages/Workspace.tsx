import PageTitle from "@/components/common/PageTitle";
import WorkspaceFormList from "@/components/dashboard/WorkspaceFormList";
import { Button } from "@/components/ui/button";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";

const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 10000,
  });

  return (
    <div className="mx-auto container max-w-[1100px] overflow-hidden px-5">
      <PageTitle>
        <div className="flex items-center justify-between">
          {searchParams.get("name")}
          <Button
            size="sm"
            className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600"
          >
            CREATE FORM
          </Button>
        </div>
      </PageTitle>
      <div className="">
        {!!dashboard?.workspaces?.filter(
          (item: { _id: string }) => item._id === id
        )[0].forms.length ? (
          <>
            <WorkspaceFormList
              item={
                dashboard.workspaces.filter(
                  (item: { _id: string }) => item._id === id
                )[0]
              }
              key={
                dashboard.workspaces.filter(
                  (item: { _id: string }) => item._id === id
                )[0]._id
              }
            />
          </>
        ) : (
          <div className="flex  justify-center py-20">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Looks like it's empty here. Create your first form!
            </h4>
            <img src="/box.png" alt="" className="w-1/4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
