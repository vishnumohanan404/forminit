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
import StatCell from "@/layouts/dashboard/StatCell";
import { FormType, WorkspaceType } from "@/lib/types";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import CreateWorkspaceDialog from "@/components/dashboard/CreateWorkspaceDialog";

type FormWithWorkspace = FormType & { workspaceName: string };

const CreateFormCta = ({ workspaces }: { workspaces: WorkspaceType[] }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

  if (workspaces.length === 1) {
    return (
      <Button asChild>
        <Link to={`/form?workspaceId=${workspaces[0]._id}`}>Create Form</Link>
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Create Form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a Workspace</DialogTitle>
          <DialogDescription>Select which workspace to create the form in.</DialogDescription>
        </DialogHeader>
        <Select
          onValueChange={setSelectedWorkspaceId}
          value={selectedWorkspaceId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map(ws => (
              <SelectItem
                key={ws._id}
                value={ws._id}
              >
                {ws.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            disabled={!selectedWorkspaceId}
            onClick={() => {
              navigate(`/form?workspaceId=${selectedWorkspaceId}`);
              setOpen(false);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load dashboard. Please refresh the page.</p>
      </div>
    );
  }

  const allForms: FormWithWorkspace[] =
    dashboard?.workspaces?.flatMap((workspace: WorkspaceType) =>
      workspace.forms.map(form => ({
        ...form,
        workspaceId: workspace._id,
        workspaceName: workspace.name,
      })),
    ) ?? [];

  const totalForms = allForms.length;
  const totalSubmissions = allForms.reduce((acc, f) => acc + f.submissions, 0);
  const activeForms = allForms.filter(f => !f.disabled).length;

  const activeForms$ = allForms.filter(f => !f.disabled);
  const disabledForms$ = allForms.filter(f => f.disabled);

  const workspaces: WorkspaceType[] = dashboard?.workspaces || [];
  const hasWorkspaces = workspaces.length > 0;

  return (
    <div className="px-5">
      <PageTitle>Home</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container">
        <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-sm">
          <StatCell
            label="Total Forms"
            value={totalForms}
            loading={isLoading}
          />
          <StatCell
            label="Total Submissions"
            value={totalSubmissions}
            loading={isLoading}
          />
          <StatCell
            label="Active Forms"
            value={activeForms}
            loading={isLoading}
          />
        </div>

        {!hasWorkspaces && !isLoading ? (
          <Empty className="mt-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>No Workspaces Yet</EmptyTitle>
            <EmptyDescription>
              Create a workspace to start organizing and building your forms.
            </EmptyDescription>
            <EmptyContent>
              <CreateWorkspaceDialog>
                <Button>Create Workspace</Button>
              </CreateWorkspaceDialog>
            </EmptyContent>
          </Empty>
        ) : (
          <Tabs
            defaultValue="all"
            className="mt-12"
          >
            <TabsList>
              <TabsTrigger value="all">All Forms</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="disabled">Disabled</TabsTrigger>
            </TabsList>
            <TabsContent
              value="all"
              className="mt-4"
            >
              <FormsTable
                forms={allForms}
                emptyMessage="No forms yet."
                emptyDescription="Create your first form to start collecting responses."
                createFormCta={<CreateFormCta workspaces={workspaces} />}
              />
            </TabsContent>
            <TabsContent
              value="active"
              className="mt-4"
            >
              <FormsTable
                forms={activeForms$}
                emptyMessage="No active forms."
                emptyDescription="Forms that are enabled will appear here."
              />
            </TabsContent>
            <TabsContent
              value="disabled"
              className="mt-4"
            >
              <FormsTable
                forms={disabledForms$}
                emptyMessage="No disabled forms."
                emptyDescription="Forms that have been disabled will appear here."
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

interface FormsTableProps {
  forms: FormWithWorkspace[];
  emptyMessage?: string;
  emptyDescription?: string;
  createFormCta?: React.ReactNode;
}

const FormsTable = ({
  forms,
  emptyMessage = "No forms found.",
  emptyDescription,
  createFormCta,
}: FormsTableProps) => {
  if (forms.length === 0) {
    return (
      <Empty className="mt-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>{emptyMessage}</EmptyTitle>
        {emptyDescription && <EmptyDescription>{emptyDescription}</EmptyDescription>}
        {createFormCta && <EmptyContent>{createFormCta}</EmptyContent>}
      </Empty>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">Name</TableHead>
          <TableHead className="w-[20%]">Workspace</TableHead>
          <TableHead className="w-[15%]">Status</TableHead>
          <TableHead className="w-[15%]">Submissions</TableHead>
          <TableHead className="w-[15%]">Created</TableHead>
          <TableHead className="w-[10%] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map(form => (
          <TableRow
            key={form._id}
            className="group hover:bg-muted/40 transition-colors"
          >
            <TableCell className="w-[25%] font-medium">
              <Link
                to={`/form-summary/${form.form_id}?name=${form.name}&submission=${form.submissions}&url=${form.url}&modified=${form.modified}&created=${form.created}`}
                onClick={e => e.stopPropagation()}
                className="group-hover:underline"
              >
                {form.name}
              </Link>
            </TableCell>
            <TableCell className="w-[20%] text-muted-foreground">{form.workspaceName}</TableCell>
            <TableCell className="w-[15%]">
              {form.disabled ? (
                <Badge variant="secondary">Disabled</Badge>
              ) : form.published ? (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-400"
                >
                  Published
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-400"
                >
                  Draft
                </Badge>
              )}
            </TableCell>
            <TableCell className="w-[15%]">{form.submissions}</TableCell>
            <TableCell className="w-[15%]">
              {new Date(form.created).toLocaleDateString("en-US")}
            </TableCell>
            <TableCell className="w-[10%] text-right space-x-3 font-semibold text-primary">
              <Link
                to={form.published ? `/view-form/${form.form_id}` : `/preview-form/${form.form_id}`}
                target="_blank"
                onClick={e => e.stopPropagation()}
                className="hover:underline"
              >
                {form.published ? "View" : "Preview"}
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
  );
};

export default DashboardPage;
