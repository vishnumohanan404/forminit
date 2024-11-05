import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuestionTitleBlock from "./custom-blocks/QuestionTitleBlock.tsx";
import ShortAnswerInputBlock from "./custom-blocks/ShortAnswerInputBlock.tsx";
import ShortAnswerTool from "./tools/ShortAnswer";
import LongAnswerInputBlock from "./custom-blocks/LongAnswerInputBlock.tsx";
import LongAnswerTool from "./tools/LongAnswer.ts";
import MultipleChoiceOptionBlock from "./custom-blocks/MultipleChoiceOptionBlock.tsx";
import MultipleChoiceTool from "./tools/MultipleChoice.ts";
import CustomParagraph from "./custom-blocks/CustomParagraph.tsx";
import { throttle } from "@/lib/utils.ts";
import { useFormContext } from "@/contexts/FormContext.tsx"; // Import the context
import { fetchForm } from "@/services/form.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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
      console.log("data :>> ", data);
      editorInstance.current = new EditorJS({
        placeholder: "Type '/' to add blocks",
        holder: "editorjs",
        autofocus: !!!data,
        data: data,
        minHeight: 30,
        tools: {
          paragraph: { class: CustomParagraph, inlineToolbar: true },

          // custom blocks - used to make custom tools
          questionTitleBlock: {
            class: QuestionTitleBlock,
            inlineToolbar: true,
          },
          shortAnswerInputBlock: ShortAnswerInputBlock,
          longAnswerInputBlock: LongAnswerInputBlock,
          multipleChoiceOptionBlock: MultipleChoiceOptionBlock,
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
        }, 2),
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
    <div className="mx-auto max-w-[1100px] min-h-[300px] overflow-auto flex-grow container mb-28">
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
