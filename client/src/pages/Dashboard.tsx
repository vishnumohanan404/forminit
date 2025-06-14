import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeFormsListItem from "@/layouts/dashboard/HomeFormsListItem";
import HomeStatsCard from "@/layouts/dashboard/HomeStatsCard";
import HomeWorkspaceCard from "@/layouts/dashboard/HomeWorkspaceCard";
import { FormType, WorkspaceType } from "@/lib/types";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { FileText, LinkIcon, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 10000,
  });
  const publishedForms: FormType[] = dashboard?.workspaces?.flatMap(
    (workspace: WorkspaceType) =>
      workspace.forms
        .filter((form) => form.published)
        .map((form) => ({ ...form, workspaceId: workspace._id }))
  );
  const allForms: FormType[] = dashboard?.workspaces?.flatMap(
    (workspace: WorkspaceType) =>
      workspace.forms.map((form) => ({ ...form, workspaceId: workspace._id }))
  );
  const draftedForms: FormType[] = dashboard?.workspaces?.flatMap(
    (workspace: WorkspaceType) =>
      workspace.forms
        .filter((form) => !form.published)
        .map((form) => ({ ...form, workspaceId: workspace._id })) // Only include forms that are not published
  );
  return (
    <div className="px-5">
      <PageTitle>Home</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container ">
        {!isError && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <HomeWorkspaceCard
              showSkeleton={!isError && isLoading}
              workspaceCount={dashboard?.workspaces?.length}
            />
            <HomeStatsCard
              isLoading={isLoading}
              workspaces={dashboard?.workspaces}
            />
          </div>
        )}
        <Tabs defaultValue="all" className="mt-12">
          <TabsList>
            <TabsTrigger value="all">All Forms</TabsTrigger>
            <TabsTrigger value="published" disabled>
              Published
            </TabsTrigger>
            <TabsTrigger value="drafts" disabled>
              Drafts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4">
              {!isError && allForms?.length > 0 ? (
                allForms.map((form) => (
                  <HomeFormsListItem form={form} key={form._id} />
                ))
              ) : (
                <p className="text-2xl mx-auto w-fit my-16 font-semibold text-muted-foreground">
                  No published forms available
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="published" className="mt-4">
            {/* <div className="grid gap-4">
              {!isError && publishedForms?.length > 0 ? (
                publishedForms.map((form) => (
                  <Card key={form._id}>
                    <CardHeader>
                      <CardTitle>{form.name}</CardTitle>
                      <CardDescription>
                        Status: <span className="capitalize">published</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Submissions: {form.submissions}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> View
                      </Button>
                      <div className="flex align-middle gap-5">
                        {form.published && (
                          <Button variant={"ghost"}>
                            <LinkIcon />
                          </Button>
                        )}
                        <Link to={`/form/${form.form_id}`}>
                          <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-2xl mx-auto w-fit mt-28 font-semibold mb-2 text-muted-foreground">
                  No published forms available
                </p>
              )}
            </div> */}
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            {/* <div className="grid gap-4">
              {!isError && draftedForms?.length > 0 ? (
                draftedForms.map((form) => (
                  <Card key={form._id}>
                    <CardHeader>
                      <CardTitle>{form.name}</CardTitle>
                      <CardDescription>
                        Status: <span className="capitalize">drafted</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Submissions: {form.submissions}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> View
                      </Button>
                      <div className="flex align-middle gap-5">
                        {form.published && (
                          <Button variant={"ghost"}>
                            <LinkIcon />
                          </Button>
                        )}
                        <Link to={`/form/${form.form_id}`}>
                          <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-2xl mx-auto w-fit mt-28 font-semibold mb-2 text-muted-foreground">
                  No published forms available
                </p>
              )}
            </div> */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;
