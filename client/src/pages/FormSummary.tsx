import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Copy, EditIcon, TrashIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteForm,
  disableForm,
  fetchSubmissions,
  viewForm,
} from "@/services/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
interface BlockData {
  type: string; // Type of the block (e.g., 'header', 'paragraph', etc.)
  data: any; // Data specific to the block type
}
interface SubmissionData {
  _id: string;
  title: string;
  formId: string;
  blocks: BlockData[];
  createdAt: Date;
  updatedAt: Date;
}
const FormSummaryPage = () => {
  const [searchParams] = useSearchParams();
  const { formId } = useParams();
  const {
    data: submissions,
    isError: isSubmissionsError,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
  } = useQuery<SubmissionData[], AxiosError>({
    queryKey: ["submissions", formId],
    queryFn: () => fetchSubmissions(formId || ""),
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
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + searchParams.get("url") || ""
      );
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteForm(formId),
    onSuccess: () => {
      // Boom baby!
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/dashboard");
    },
  });
  const { mutate: handleDisable } = useMutation({
    mutationFn: () => disableForm(formId),
    onSuccess: () => {
      // Boom baby!
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({
        queryKey: ["formView", formId],
      });
    },
  });

  console.log("submissions :>> ", submissionsError?.response);
  const isLoading = isSubmissionsLoading || isFormViewLoading;
  return (
    <div className="overflow-y-scroll px-5">
      <PageTitle>
        <div className="flex items-center justify-between">
          {searchParams.get("name")}
          <Button
            size="sm"
            className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600 flex gap-3 items-center"
            onClick={() => navigate(`/form/${formId}`)}
          >
            <EditIcon className="w-3 h-3" />
            <div>Edit</div>
          </Button>
        </div>
      </PageTitle>
      <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-3 mb-4">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="submissions">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-10 gap-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
              </div>
            ) : isSubmissionsError || isFormViewError ? (
              <div className="text-center py-10">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No data available
                </p>
                {submissionsError?.response?.status === 404 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your form hasn't received any submissions. Share your form
                    to start collecting responses!
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    There was an error fetching the data. Please try again
                    later.
                  </p>
                )}
              </div>
            ) : (
              <Table>
                <TableCaption>A list of your recent Submissions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submitted at</TableHead>
                    {formView?.blocks?.map(
                      (block: {
                        _id: string;
                        type: string;
                        data: { title: string };
                      }) => {
                        return (
                          <TableHead key={block._id}>
                            {block.data?.title}
                          </TableHead>
                        );
                      }
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.map((submission: any) => (
                    <TableRow key={submission._id}>
                      <TableCell>
                        {new Date(submission.createdAt).toLocaleString()}
                      </TableCell>
                      {submission.blocks.map((block: any) => (
                        <TableCell key={block._id}>
                          {block.type === "multipleChoiceTool"
                            ? block.data.options.find(
                                (option: any) =>
                                  option.optionMarker ===
                                  block.data.selectedOption
                              )?.optionValue || "N/A"
                            : block.data.value || "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            )}
          </TabsContent>
          <TabsContent value="share">
            <div className="space-y-8">
              {/* Share Link Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Share Link</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your form is now published and ready to be shared with the
                    world! Copy this link to share your form on social media,
                    messaging apps or via email.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={
                      window.location.origin + searchParams.get("url") || ""
                    }
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="default"
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                {/* <Button variant="ghost" className="text-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Use custom domain
                </Button> */}
              </div>

              {/* Embed Form Section */}
              {/* <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Embed Form</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use these options to embed your form into your own website.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 space-y-4">
                      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-primary/10 rounded" />
                      </div>
                      <p className="text-sm font-medium text-center">
                        Standard
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 space-y-4">
                      <div className="w-full aspect-video bg-muted rounded-lg flex items-end justify-end p-4">
                        <div className="w-1/3 h-1/3 bg-primary/10 rounded" />
                      </div>
                      <p className="text-sm font-medium text-center">Popup</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 space-y-4">
                      <div className="w-full aspect-video bg-primary/10 rounded-lg" />
                      <p className="text-sm font-medium text-center">
                        Full page
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div> */}
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Disable Form</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your forms will no longer be accessible through the public
                    link
                  </p>
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => handleDisable()}
                  >
                    {formView?.disabled ? "Enable" : "Disable"}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Delete Form</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    By deleting form you will lose all data related to this form
                    including submissions
                  </p>
                  <Dialog
                    onOpenChange={(isOpen) => {
                      setIsOpen(isOpen);
                    }}
                    open={isOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="text-sm">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          Confirm to delete the form
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button type="submit" onClick={() => handleDelete()}>
                          Confirm
                        </Button>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FormSummaryPage;
