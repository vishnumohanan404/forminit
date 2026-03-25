import PageTitle from "@/components/common/PageTitle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Editor from "@/layouts/form/Editor";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/FormContext";
import { createForm, EditorJSData, fetchForm, updateForm } from "@/services/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AxiosError } from "axios";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { EyeIcon } from "lucide-react";
import { createPortal } from "react-dom";

const FormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useFormContext();
  const queryClient = useQueryClient();
  // Local state for the title
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const [publishTooltipOpen, setPublishTooltipOpen] = useState(false);
  // Create mutation for creating a new form
  const { mutate: createFormMutation, isPending: isPendingCreate } = useMutation({
    mutationFn: (workspaceDetails: EditorJSData) =>
      createForm({
        ...workspaceDetails,
        title,
        workspaceId: searchParams.get("workspaceId") || "",
      }),
    onSuccess: (newForm: { _id: string }) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Form saved successfully");
      navigate(`/form/${newForm._id}`, { replace: true });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // An error happened!
      toast.error(
        error.response?.data?.message?.includes("Form validation failed")
          ? "Form validation failed"
          : "Something went wrong",
      );
    },
  });
  // Create mutation for updating the form title
  const { mutate: updateFormMutation, isPending: isPendingUpdate } = useMutation({
    mutationFn: (workspaceDetails: EditorJSData) => updateForm(id || "", workspaceDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Form updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // An error happened!
      toast.error(
        error.response?.data?.message?.includes("Form validation failed")
          ? "Form validation failed"
          : "Something went wrong",
      );
    },
  });

  const handleSubmit = () => {
    if (id) {
      updateFormMutation({ ...state.editorData, title });
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
  const canPublish = !!((state.editorData || title !== data?.title) && title);
  const navbarActions = document.getElementById("navbar-actions");

  return (
    <div className="px-5">
      {/* Portal action buttons into the navbar slot */}
      {navbarActions &&
        createPortal(
          <TooltipProvider>
            {/* Preview */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-bold tracking-normal gap-1.5 h-7 text-xs"
                    disabled={!id}
                    onClick={() => window.open(`/view-form/${id}`, "_blank")}
                  >
                    <EyeIcon size={13} />
                    PREVIEW
                  </Button>
                </span>
              </TooltipTrigger>
              {!id && (
                <TooltipContent>
                  <p>Save the form first to preview it</p>
                </TooltipContent>
              )}
            </Tooltip>

            {/* Publish */}
            {!canPublish ? (
              <Tooltip
                open={publishTooltipOpen}
                onOpenChange={setPublishTooltipOpen}
              >
                <TooltipTrigger asChild>
                  <span
                    className="flex"
                    role="button"
                    tabIndex={0}
                    onClick={() => setPublishTooltipOpen(v => !v)}
                    onKeyDown={e => e.key === "Enter" && setPublishTooltipOpen(v => !v)}
                  >
                    <Button
                      size="sm"
                      className="font-bold tracking-normal min-w-20 h-7 text-xs pointer-events-none"
                      disabled
                    >
                      PUBLISH
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!title
                      ? "Add a title to your form before publishing"
                      : "No changes to publish"}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                size="sm"
                className="font-bold tracking-normal min-w-20 h-7 text-xs"
                onClick={handleSubmit}
              >
                {isPendingCreate || isPendingUpdate ? <LoadingSpinner /> : "PUBLISH"}
              </Button>
            )}
          </TooltipProvider>,
          navbarActions,
        )}

      <PageTitle className="max-w-[760px] pt-20">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          placeholder={!id ? "Untitled" : ""}
          className="text-4xl font-bold outline-none bg-transparent w-full placeholder:text-gray-500"
          aria-label="Form title"
        />
      </PageTitle>
      <Editor />
    </div>
  );
};

export default FormPage;
