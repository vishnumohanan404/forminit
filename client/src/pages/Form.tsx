import PageTitle from "@/components/common/PageTitle";
import { useParams, useSearchParams } from "react-router-dom";
import Editor from "@/components/form/Editor";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/contexts/FormContext";
import { createForm, fetchForm, updateForm } from "@/services/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  // Create mutation for creating a new form
  const { mutate: createFormMutation, isPending: isPendingCreate } =
    useMutation({
      mutationFn: (workspaceDetails: EditorJSData) =>
        createForm({
          ...workspaceDetails,
          title: "Hello",
          workspaceId: searchParams.get("workspaceId") || "",
        }),
      onSuccess: () => {
        // Boom baby!
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast("Form saved successfully");
      },
    });
  // Create mutation for updating the form title
  const { mutate: updateFormMutation } = useMutation({
    mutationFn: (workspaceDetails: EditorJSData) =>
      updateForm(id || "", workspaceDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast("Form title updated successfully");
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
  const handleTitleChange = (event: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = event.currentTarget.textContent || "";
    setTitle(newTitle);
    // Update the form title using the mutation
  };
  return (
    <div className=" overflow-y-auto px-5">
      <PageTitle>
        <div className="flex justify-between items-center">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {!id ? "Create New Form" : title}
          </div>
          <Button
            size="sm"
            className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={!state.editorData && title === data?.title}
          >
            {!id ? (
              <div>{isPendingCreate ? "Saving..." : "PUBLISH"}</div>
            ) : (
              <div>{false ? "Saving..." : "SAVE"}</div>
            )}
          </Button>
        </div>
      </PageTitle>
      <Editor />
    </div>
  );
};

export default FormPage;
