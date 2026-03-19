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
                <TableHead className="w-[20%]">Name</TableHead>
                {/* <TableHead className="w-[20%]">Status</TableHead> */}
                <TableHead className="w-[20%]">Submissions</TableHead>
                <TableHead className="w-[20%]">Created</TableHead>
                <TableHead className="w-[20%] text-right">Actions</TableHead>
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
