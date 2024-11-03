import { useEffect, useRef } from "react";
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
const Editor = () => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        placeholder: "Type '/' to add blocks",

        holder: "editorjs",
        autofocus: true,
        minHeight: 30,
        tools: {
          // paragraph: {
          //   class: Paragraph,
          //   inlineToolbar: true,
          // },
          // custom blocks - used to make custom tools
          questionTitleBlock: QuestionTitleBlock,
          shortAnswerInputBlock: ShortAnswerInputBlock,
          longAnswerInputBlock: LongAnswerInputBlock,
          multipleChoiceOptionBlock: MultipleChoiceOptionBlock,
          // custom tools - most tools are built using multiple custom blocks
          shortAnswerTool: ShortAnswerTool,
          longAnswerTool: LongAnswerTool,
          multipleChoiceTool: MultipleChoiceTool,
        },
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
  }, []);

  const handleSave = () => {
    editorInstance.current
      ?.save()
      .then((savedData) => {
        console.log(savedData);
        alert(JSON.stringify(savedData, null, 4));
      })
      .catch((error) => {
        console.error("Saving failed: ", error);
      });
  };

  return (
    <div className="mx-auto max-w-[1100px] min-h-[300px] overflow-auto">
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
