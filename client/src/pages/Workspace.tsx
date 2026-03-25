import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { fetchDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FormType } from "../lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="px-5">
      <PageTitle>
        <div className="flex items-center justify-between">
          {searchParams.get("name")}
          <Button
            size="sm"
            className="font-bold tracking-normal "
            onClick={handleClick}
          >
            CREATE FORM
          </Button>
        </div>
      </PageTitle>
      <main className="mx-auto max-w-[1100px]  overflow-auto flex-grow container">
        {dashboard?.workspaces?.filter((workspace: { _id: string }) => workspace._id === id)[0]
          ?.forms.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard?.workspaces
                ?.filter((workspace: { _id: string }) => workspace._id === id)[0]
                ?.forms.map((form: FormType) => (
                  <TableRow
                    key={form._id}
                    className="group"
                  >
                    <TableCell className="font-bold">
                      <Link
                        to={`/form-summary/${form.form_id}?name=${form.name}&submission=${form.submissions}&url=${form.url}&modified=${form.modified}&created=${form.created}`}
                        onClick={e => e.stopPropagation()}
                        className="group-hover:underline"
                      >
                        {form.name}
                      </Link>
                    </TableCell>
                    <TableCell>
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
                    <TableCell>{form.submissions}</TableCell>
                    <TableCell>{new Date(form.created).toLocaleDateString("en-US")}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {form.lastSubmission
                        ? new Date(form.lastSubmission).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-3 font-semibold text-primary">
                      <Link
                        to={
                          form.published
                            ? `/view-form/${form.form_id}`
                            : `/preview-form/${form.form_id}`
                        }
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
      </main>
    </div>
  );
};

export default WorkspacePage;
