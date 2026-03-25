import PageTitle from "@/components/common/PageTitle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Editor from "@/layouts/form/Editor";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/FormContext";
import { createForm, EditorJSData, fetchForm, publishFormApi, updateForm } from "@/services/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AxiosError } from "axios";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { EyeIcon } from "lucide-react";
import { createPortal } from "react-dom";

type SaveStatus = "idle" | "saving" | "saved";

const FormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useFormContext();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const [publishTooltipOpen, setPublishTooltipOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isPublished, setIsPublished] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);

  // Autosave — create if new, update if existing
  const { mutate: autoSaveCreate } = useMutation({
    mutationFn: (data: EditorJSData) => createForm(data),
    onSuccess: (newForm: { _id: string }) => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate(`/form/${newForm._id}`, { replace: true });
    },
    onError: () => setSaveStatus("idle"),
  });

  const { mutate: autoSaveUpdate } = useMutation({
    mutationFn: ({ formId, data }: { formId: string; data: EditorJSData }) =>
      updateForm(formId, data),
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => setSaveStatus("idle"),
  });

  // Publish — sets published: true
  const { mutate: publishMutation, isPending: isPublishing } = useMutation({
    mutationFn: (formId: string) => publishFormApi(formId),
    onSuccess: () => {
      setIsPublished(true);
      setHasUnpublishedChanges(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Form published successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    },
  });

  const handlePublish = () => {
    if (id) {
      publishMutation(id);
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
      setIsPublished(data.published ?? false);
    }
  }, [isFetched, data]);

  // Debounced autosave
  useEffect(() => {
    if (!title) return;
    setSaveStatus("saving");
    setHasUnpublishedChanges(true);
    const timer = setTimeout(() => {
      const payload: EditorJSData = {
        ...state.editorData,
        title,
        workspaceId: id ? (data?.workspaceId ?? "") : (searchParams.get("workspaceId") ?? ""),
      };
      if (id) {
        autoSaveUpdate({ formId: id, data: payload });
      } else {
        autoSaveCreate(payload);
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editorData, title]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      titleRef.current?.blur();
    }
  };

  const statusText = (() => {
    if (saveStatus === "saving") return "Saving…";
    if (saveStatus === "saved" && isPublished && !hasUnpublishedChanges) return "Published";
    if (saveStatus === "saved" && (hasUnpublishedChanges || !isPublished))
      return "Draft saved · Unpublished changes";
    return null;
  })();

  const navbarActions = document.getElementById("navbar-actions");

  return (
    <div className="px-5">
      {navbarActions &&
        createPortal(
          <TooltipProvider>
            {/* Status indicator */}
            {statusText && <span className="text-xs text-muted-foreground mr-1">{statusText}</span>}

            {/* Preview */}
            <Button
              size="sm"
              variant="outline"
              className="font-bold tracking-normal gap-1.5 h-7 text-xs"
              disabled={!id}
              onClick={() => window.open(`/preview-form/${id}`, "_blank")}
            >
              <EyeIcon size={13} />
              PREVIEW
            </Button>

            {/* Publish */}
            {!id ? (
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
                  <p>Save the form first to publish it</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                size="sm"
                className="font-bold tracking-normal min-w-20 h-7 text-xs"
                onClick={handlePublish}
                disabled={isPublishing || (isPublished && !hasUnpublishedChanges)}
              >
                {isPublishing ? (
                  <LoadingSpinner />
                ) : isPublished && !hasUnpublishedChanges ? (
                  "PUBLISHED"
                ) : (
                  "PUBLISH"
                )}
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
          placeholder="Untitled"
          className="text-4xl font-bold outline-none bg-transparent w-full placeholder:text-gray-500"
          aria-label="Form title"
        />
      </PageTitle>
      <Editor />
    </div>
  );
};

export default FormPage;
