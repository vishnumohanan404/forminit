import PageTitle from "@/components/common/PageTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeStatsCard from "@/layouts/dashboard/HomeStatsCard";
import HomeWorkspaceCard from "@/layouts/dashboard/HomeWorkspaceCard";
import { FormType, WorkspaceType } from "@/lib/types";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load dashboard. Please refresh the page.</p>
      </div>
    );
  }

  const allForms: FormType[] = dashboard?.workspaces?.flatMap((workspace: WorkspaceType) =>
    workspace.forms.map(form => ({ ...form, workspaceId: workspace._id })),
  );

  const workspaces: WorkspaceType[] = dashboard?.workspaces || [];

  const handleClick = () => {
    navigate(`/form?workspaceId=${workspaces[0]._id}`); // Replace with your desired route
  };
  return (
    <div className="px-5">
      <PageTitle>Home</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container ">
        <div className="">
          <h1 className="text-lg font-semibold">Quickstart</h1>
          <div className="flex gap-2 mt-4">
            <HomeWorkspaceCard />
            <HomeStatsCard isLoading={isLoading} />
          </div>
        </div>
        <Tabs
          defaultValue="all"
          className="mt-12"
        >
          <TabsList>
            <TabsTrigger value="all">Workspaces</TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="mt-4"
          >
            <div className="grid gap-4">
              {dashboard?.workspaces?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Name</TableHead>
                      <TableHead className="w-[20%]">Forms</TableHead>
                      <TableHead className="w-[20%]">Created</TableHead>
                      <TableHead className="w-[20%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workspaces.map(workspace => (
                      <TableRow
                        key={workspace._id}
                        className="group"
                      >
                        <TableCell className="w-[20%] font-bold">
                          <Link
                            to={`/workspaces/${workspace._id}?name=${workspace.name}`}
                            onClick={e => e.stopPropagation()}
                            className="group-hover:underline"
                          >
                            {workspace.name}
                          </Link>
                        </TableCell>
                        {/* <TableCell className="w-[20%]">
                          {form.published ? "Published" : "Draft"}
                        </TableCell> */}
                        <TableCell className="w-[20%]">{workspace.forms.length}</TableCell>
                        <TableCell className="w-[20%]">
                          {new Date(workspace.created).toLocaleDateString("en-US")}
                        </TableCell>
                        <TableCell className="w-[20%] text-right space-x-3 font-semibold text-primary">
                          <Link
                            to={`/form?workspaceId=${workspace._id}`}
                            onClick={e => e.stopPropagation()}
                            className="hover:underline"
                          >
                            Create Form
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-2xl mx-auto w-fit my-16 font-semibold text-muted-foreground">
                  No workspaces available
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Forms overview table */}
        <Tabs
          defaultValue="all"
          className="mt-12"
        >
          <TabsList>
            <TabsTrigger value="all">All Forms</TabsTrigger>
            <TabsTrigger
              value="published"
              disabled
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              disabled
            >
              Drafts
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="mt-4"
          >
            <div className="grid gap-4">
              {allForms?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Name</TableHead>
                      <TableHead className="w-[20%]">Submissions</TableHead>
                      <TableHead className="w-[20%]">Created</TableHead>
                      <TableHead className="w-[20%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allForms.map(form => (
                      <TableRow
                        key={form._id}
                        className="group"
                      >
                        <TableCell className="w-[20%] font-bold">
                          <Link
                            to={`/form-summary/${form.form_id}?name=${form.name}&submission=${form.submissions}&url=${form.url}&modified=${form.modified}&created=${form.created}`}
                            onClick={e => e.stopPropagation()}
                            className="group-hover:underline"
                          >
                            {form.name}
                          </Link>
                        </TableCell>
                        <TableCell className="w-[20%]">{form.submissions}</TableCell>
                        <TableCell className="w-[20%]">
                          {new Date(form.created).toLocaleDateString("en-US")}
                        </TableCell>
                        <TableCell className="w-[20%] text-right space-x-3 font-semibold text-primary">
                          <Link
                            to={`/view-form/${form.form_id}`}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            className="hover:underline"
                          >
                            View
                          </Link>

                          <Link
                            to={`/form/${form.form_id}`}
                            onClick={e => e.stopPropagation()}
                            className="hover:underline"
                          >
                            Edit
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileText />
                    </EmptyMedia>
                  </EmptyHeader>
                  <EmptyTitle>No Forms Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t created any forms yet. Get started by creating your first form.
                  </EmptyDescription>
                  <EmptyContent>
                    <div className="flex gap-2">
                      <Button onClick={handleClick}>Create Form</Button>
                    </div>
                  </EmptyContent>
                </Empty>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="published"
            className="mt-4"
          />
          <TabsContent
            value="drafts"
            className="mt-4"
          />
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;
