import PageTitle from "@/components/common/PageTitle";
import WorkspaceFormList from "@/components/workspace/WorkspaceFormList";
import { Button } from "@/components/ui/button";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 10000,
  });
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/form?workspaceId=${id}`); // Replace with your desired route
  };

  return (
    <div className="overflow-y-scroll px-5">
      <PageTitle>
        <div className="flex items-center justify-between">
          {searchParams.get("name")}
          <Button
            size="sm"
            className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600"
            onClick={handleClick}
          >
            CREATE FORM
          </Button>
        </div>
      </PageTitle>
      <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
        {!!dashboard?.workspaces?.filter(
          (item: { _id: string }) => item._id === id
        )[0]?.forms.length ? (
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
          <div className="flex items-center align-middle gap-12 w-full justify-center py-20">
            <h4 className="scroll-m-20 text-xl font-semibold text-muted-foreground">
              Looks like it's empty here. Create your first form!
            </h4>
            {/* <img src="/box.png" alt="" className="w-1/4" /> */}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkspacePage;
