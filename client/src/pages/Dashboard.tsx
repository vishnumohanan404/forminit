import PageTitle from "@/components/common/PageTitle";
import CreateWorkspaceDialog from "@/components/dashboard/CreateWorkspaceDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormType, WorkspaceType } from "@/lib/types";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { FileText, LinkIcon, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
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
  const [hover, setHover] = useState("");
  return (
    <div className="px-5">
      <PageTitle>Home</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container ">
        {!isError && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              {!isError && isLoading ? (
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
                    <CardTitle>
                      Workspaces &nbsp;&nbsp;{dashboard?.workspaces?.length}
                    </CardTitle>
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
                          {dashboard?.workspaces?.reduce(
                            (sum: number, workspace: WorkspaceType) =>
                              sum + workspace.forms.length,
                            0
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">Forms</p>
                      </div>
                      <div className="text-muted-foreground">
                        <p className="text-2xl font-bold">
                          {dashboard?.workspaces?.reduce(
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
                        <p className="text-sm text-muted-foreground">
                          Published
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {dashboard?.workspaces?.reduce(
                            (sum: string, workspace: WorkspaceType) => {
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
                        <p className="text-sm text-muted-foreground">
                          Submissions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
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
                  <Card
                    key={form._id}
                    className="cursor-pointer shadow-none"
                    onClick={() => {
                      navigate(
                        `/form-summary/${form.form_id}?name=${form.name}&submission=${form.submissions}&url=${form.url}&modified=${form.modified}&created=${form.created}`
                      );
                    }}
                    onMouseOver={() => setHover(form._id)}
                    onMouseOut={() => setHover("")}
                  >
                    <CardHeader className="">
                      <CardTitle
                        className={
                          hover === form._id
                            ? "underline underline-offset-4"
                            : ""
                        }
                      >
                        {form.name}
                      </CardTitle>
                      <div className="flex justify-between w-full pt-2 items-center">
                        <div>
                          {/* <div className="text-sm text-muted-foreground">
                            Status:{" "}
                            <span className="capitalize">
                              {form.published ? "published" : "drafted"}
                            </span>
                          </div> */}
                          <p className="text-sm text-muted-foreground">
                            Submissions: {form.submissions}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/view-form/${form.form_id}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="outline">
                              <FileText className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <div className="flex align-middle gap-5">
                            {form.published && (
                              <Button variant={"ghost"}>
                                <LinkIcon />
                              </Button>
                            )}
                            <Link
                              to={`/form/${form.form_id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" /> Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <p className="text-2xl mx-auto w-fit mt-28 font-semibold mb-2 text-muted-foreground">
                  No published forms available
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="published" className="mt-4">
            <div className="grid gap-4">
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
            </div>
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            <div className="grid gap-4">
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
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;
