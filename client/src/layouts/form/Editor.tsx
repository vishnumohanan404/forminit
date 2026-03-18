import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { Button } from "../../components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { throttle } from "@/lib/utils.ts";
import { useFormContext } from "@/contexts/FormContext.tsx"; // Import the context
import { fetchForm } from "@/services/form.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ShortAnswerTool from "../../components/form/tools/ShortAnswerTool.tsx";
import LongAnswerTool from "../../components/form/tools/LongAnswerTool.tsx";
import MultipleChoiceTool from "../../components/form/tools/MultipleChoice.tsx";
import CustomParagraph from "../../components/form/custom-blocks/CustomParagraph.tsx";
import { FormDataInterface } from "@shared/types";
import QuestionTitleTool from "@/components/form/tools/QuestionTitleTool.tsx";
import ShortAnswerCompositeTool from "@/components/form/tools/ShortAnswerCompositeTool.tsx";
import LongAnswerCompositeTool from "@/components/form/tools/LongAnswerCompositeTool.tsx";

const Editor = () => {
  const { id } = useParams();
  const editorInstance = useRef<EditorJS | null>(null);
  const { dispatch } = useFormContext();
  const { data, isFetched } = useQuery({
    queryKey: ["form", id],
    queryFn: (): Promise<FormDataInterface> => fetchForm(id),
    staleTime: 10000,
    enabled: !!id,
  });
  useEffect(() => {
    if ((isFetched || !id) && !editorInstance.current) {
      editorInstance.current = new EditorJS({
        placeholder: "Type '/' to add blocks",
        holder: "editorjs",
        autofocus: true,
        data: data,
        minHeight: 30,
        tools: {
          paragraph: { class: CustomParagraph, inlineToolbar: true },
          // Individual tools (hidden from toolbox by removing static toolbox getter)
          questionTitle: QuestionTitleTool,
          shortAnswer: ShortAnswerTool,
          longAnswerTool: LongAnswerTool,
          // Other tools
          multipleChoiceTool: MultipleChoiceTool,
          // Composite tool (visible in toolbox)
          shortAnswerQuestion: ShortAnswerCompositeTool,
          longAnswerQuestion: LongAnswerCompositeTool,
        },
        onChange: throttle(() => {
          editorInstance.current
            ?.save()
            .then(savedData => {
              dispatch({
                type: "SET_FORM_DATA",
                payload: {
                  ...savedData,
                  title: data?.title || "",
                  workspaceId: data?.workspaceId || "",
                },
              });
            })
            .catch(error => {
              console.error("Saving failed: ", error);
            });
        }, 0.5),
      });
    }
    return () => {
      if (editorInstance.current && typeof editorInstance.current.destroy === "function") {
        editorInstance.current?.destroy();
        editorInstance.current = null;
      }
    };
  }, [data, isFetched, id]);

  return (
    <div className="mx-auto max-w-[1100px] min-h-[300px] overflow-auto flex-grow container">
      <div
        id="editorjs"
        className="pb-0 "
      ></div>
      <div className="ce-block__content items-start">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className="text-muted-foreground"
              >
                Submit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Submit button will be available in published form</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Editor;
