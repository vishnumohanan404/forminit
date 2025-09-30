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
  // const publishedForms: FormType[] = dashboard?.workspaces?.flatMap((workspace: WorkspaceType) =>
  //   workspace.forms
  //     .filter(form => form.published)
  //     .map(form => ({ ...form, workspaceId: workspace._id })),
  // );
  const allForms: FormType[] = dashboard?.workspaces?.flatMap((workspace: WorkspaceType) =>
    workspace.forms.map(form => ({ ...form, workspaceId: workspace._id })),
  );
  // const draftedForms: FormType[] = dashboard?.workspaces?.flatMap(
  //   (workspace: WorkspaceType) =>
  //     workspace.forms
  //       .filter(form => !form.published)
  //       .map(form => ({ ...form, workspaceId: workspace._id })), // Only include forms that are not published
  // );

  const workspaces: WorkspaceType[] = dashboard?.workspaces || [];
  return (
    <div className="px-5">
      <PageTitle>Home</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container ">
        {!isError && (
          <div className="">
            <h1 className="text-lg font-semibold">Quickstart</h1>
            <div className="flex gap-2 mt-4">
              <HomeWorkspaceCard />
              <HomeStatsCard isLoading={isLoading} />
            </div>
          </div>
        )}
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
              {!isError && dashboard?.workspaces?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Name</TableHead>
                      {/* <TableHead className="w-[20%]">Status</TableHead> */}
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

                          {/* <Link
                            to={`/form/${workspace.form_id}`}
                            onClick={e => e.stopPropagation()}
                            className="hover:underline"
                          >
                            Edit
                          </Link> */}
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
              {!isError && allForms?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Name</TableHead>
                      {/* <TableHead className="w-[20%]">Status</TableHead> */}
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
                        {/* <TableCell className="w-[20%]">
                          {form.published ? "Published" : "Draft"}
                        </TableCell> */}
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
                <p className="text-2xl mx-auto w-fit my-16 font-semibold text-muted-foreground">
                  No published forms available
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="published"
            className="mt-4"
          >
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
          <TabsContent
            value="drafts"
            className="mt-4"
          >
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
