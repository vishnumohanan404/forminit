import PageTitle from "@/components/common/PageTitle";
import { useParams, useSearchParams } from "react-router-dom";
import Editor from "@/layouts/form/Editor";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/FormContext";
import { createForm, fetchForm, updateForm } from "@/services/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AxiosError } from "axios";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
interface BlockData {
  type: string; // Type of the block (e.g., 'header', 'paragraph', etc.)
  data: any; // Data specific to the block type
}

interface EditorJSData {
  title: string;
  time: number; // Timestamp when the data was saved
  blocks: BlockData[]; // Array of block data
  workspaceId: string;
  version: string;
}
const FormPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { state } = useFormContext();
  const queryClient = useQueryClient();
  // Local state for the title
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  // Create mutation for creating a new form
  const { mutate: createFormMutation, isPending: isPendingCreate } =
    useMutation({
      mutationFn: (workspaceDetails: EditorJSData) =>
        createForm({
          ...workspaceDetails,
          title,
          workspaceId: searchParams.get("workspaceId") || "",
        }),
      onSuccess: () => {
        // Boom baby!
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Form saved successfully");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        // An error happened!
        toast.error(
          error.response?.data?.message?.includes("Form validation failed")
            ? "Form validation failed"
            : "Something went wrong"
        );
      },
    });
  // Create mutation for updating the form title
  const { mutate: updateFormMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: (workspaceDetails: EditorJSData) =>
        updateForm(id || "", workspaceDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Form updated successfully");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        // An error happened!
        toast.error(
          error.response?.data?.message?.includes("Form validation failed")
            ? "Form validation failed"
            : "Something went wrong"
        );
      },
    });

  const handleSubmit = () => {
    console.log({ state });
    if (id) {
      updateFormMutation({ title, ...state.editorData });
    } else {
      createFormMutation(state.editorData);
    }
  };

  const { data, isFetched } = useQuery({
    queryKey: ["form", id],
    queryFn: () => fetchForm(id),
    staleTime: 10000,
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
    }
  }, [isFetched, data]);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      titleRef.current?.blur();
    }
  };
  return (
    <div className="overflow-y-auto px-5">
      <PageTitle>
        <div className="flex justify-between items-center">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder={!id ? "Untitled" : ""}
            className="text-4xl font-bold outline-none bg-transparent w-full"
            aria-label="Form title"
          />
          <TooltipProvider>
            {(!state.editorData && title === data?.title) || !title ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex">
                    <Button
                      size="sm"
                      className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600 min-w-20"
                      disabled
                    >
                      PUBLISH
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update the title to publish this form</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                size="sm"
                className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600 min-w-20"
                onClick={handleSubmit}
              >
                <div>
                  {isPendingCreate || isPendingUpdate ? (
                    <LoadingSpinner />
                  ) : (
                    "PUBLISH"
                  )}
                </div>
              </Button>
            )}
          </TooltipProvider>
        </div>
      </PageTitle>
      <Editor />
    </div>
  );
};

export default FormPage;
