import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EditIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { OptionsBlockData } from "@shared/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSubmissions, viewForm } from "@/services/form";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import SubmissionsTable, { SubmissionData } from "@/layouts/form-summary/SubmissionsTable";
import ShareTab from "@/layouts/form-summary/ShareTab";
import SettingsTab from "@/layouts/form-summary/SettingsTab";
import AnalyticsTab from "@/layouts/form-summary/AnalyticsTab";
import { useState } from "react";

const PAGE_SIZE = 10;

interface SubmissionsResponse {
  submissions: SubmissionData[];
  total: number;
}

const FormSummaryPage = () => {
  const [searchParams] = useSearchParams();
  const { formId } = useParams();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("submissions");

  const {
    data: submissionsData,
    isError: isSubmissionsError,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
  } = useQuery<SubmissionsResponse, AxiosError>({
    queryKey: ["submissions", formId, page],
    queryFn: () => fetchSubmissions(formId || "", page, PAGE_SIZE),
    staleTime: 10000,
  });

  const {
    data: formView,
    isError: isFormViewError,
    isLoading: isFormViewLoading,
  } = useQuery({
    queryKey: ["formView", formId],
    queryFn: () => viewForm(formId || ""),
    staleTime: 10000,
  });

  const navigate = useNavigate();
  const isLoading = isSubmissionsLoading || isFormViewLoading;

  const submissions = submissionsData?.submissions;
  const total = submissionsData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleExportCSV = () => {
    if (!submissions || !formView) return;
    const headers = [
      "Submitted At",
      ...formView.blocks.map((b: { data?: { title?: string } }) => b.data?.title || ""),
    ];
    const rows = submissions.map(sub => [
      new Date(sub.createdAt).toLocaleString(),
      ...sub.blocks.map(block =>
        block.type === "multipleChoiceTool"
          ? block.data.options?.find(
              (o: OptionsBlockData) => o.optionMarker === block.data.selectedOption,
            )?.optionValue || ""
          : block.data.value || "",
      ),
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${searchParams.get("name") || "submissions"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5">
      <PageTitle>
        <div className="flex items-center justify-between">
          {searchParams.get("name")}
          <Button
            size={"sm"}
            className="font-bold tracking-normal  flex gap-3 items-center"
            onClick={() => navigate(`/form/${formId}`)}
          >
            <EditIcon className="w-3 h-3" />
            <div>Edit</div>
          </Button>
        </div>
      </PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container">
        <Tabs
          defaultValue="submissions"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid max-w-[560px] grid-cols-4 mb-4">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="submissions">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-10 gap-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
              </div>
            ) : isSubmissionsError || isFormViewError || !submissions?.length ? (
              <div className="text-center py-10">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No data available
                </p>
                {(submissionsError as AxiosError)?.response?.status === 404 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your form hasn't received any submissions. Share your form to start collecting
                    responses!
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    There was an error fetching the data. Please try again later.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-muted-foreground">
                    {total} submission{total !== 1 ? "s" : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
                <SubmissionsTable
                  formView={formView}
                  submissions={submissions}
                />
                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === totalPages}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="share">
            <div className="space-y-8">
              <ShareTab />
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab disabled={formView?.disabled} />
          </TabsContent>
          <TabsContent value="analytics">
            {formId && (
              <AnalyticsTab
                formId={formId}
                enabled={activeTab === "analytics"}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FormSummaryPage;
