import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { Button } from "../../components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { throttle } from "@/lib/utils.ts";
import { useFormContext } from "@/contexts/FormContext.tsx"; // Import the context
import { fetchForm } from "@/services/form.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ShortAnswerTool from "../../components/form/tools/ShortAnswer.tsx";
import LongAnswerTool from "../../components/form/tools/LongAnswer.tsx";
import MultipleChoiceTool from "../../components/form/tools/MultipleChoice.tsx";
import CustomParagraph from "../../components/form/custom-blocks/CustomParagraph.tsx";

const Editor = () => {
  const { id } = useParams();
  const editorInstance = useRef<EditorJS | null>(null);
  const { dispatch } = useFormContext();
  const { data, isFetched } = useQuery({
    queryKey: ["form", id],
    queryFn: () => fetchForm(id),
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
          // custom tools - most tools are built using multiple custom blocks
          shortAnswerTool: ShortAnswerTool,
          longAnswerTool: LongAnswerTool,
          multipleChoiceTool: MultipleChoiceTool,
        },
        onChange: throttle(() => {
          const data = editorInstance.current
            ?.save()
            .then((savedData) => {
              console.log({ savedData });
              dispatch({
                type: "SET_FORM_DATA",
                payload: savedData,
              });
            })
            .catch((error) => {
              console.error("Saving failed: ", error);
            });
          return data;
        }, 0.5),
      });
    }
    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === "function"
      ) {
        editorInstance.current?.destroy();
        editorInstance.current = null;
      }
    };
  }, [data, isFetched, id]);

  return (
    <div className="mx-auto max-w-[1100px] min-h-[300px] overflow-auto flex-grow container">
      <div id="editorjs" className="pb-0 "></div>
      <div className="ce-block__content items-start">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" className="text-muted-foreground">
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
