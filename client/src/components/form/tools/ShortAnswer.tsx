import { API, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle"; // Assuming QuestionTitle is a React component
import ShortAnswerInput from "../ui/ShortAnswerInput";

interface ShortAnswerDataInterface extends BlockToolData {
  title: string;
  placeholder?: string;
  required: boolean;
}
export default class ShortAnswerTool {
  static get toolbox() {
    return {
      title: "Short Answers",
      icon: '<svg width="10" height="10" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
    };
  }
  wrapper: HTMLElement | undefined;
  api: API;
  data: ShortAnswerDataInterface;
  constructor({ api, data }: { api: API; data: ShortAnswerDataInterface }) {
    this.api = api;
    this.wrapper = undefined;
    this.data = data || { title: "", required: false };
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("short-answer-block");
    // Insert Title Block

    const onKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>
    ) => {
      if (event.key === "Backspace") {
        if (this.data.placeholder === "" && this.data.title === "") {
          // Prevent default backspace behavior and remove the block

          const currentIndex = this.api.blocks.getCurrentBlockIndex();
          this.api.blocks.delete(currentIndex);
          setTimeout(() => {
            if (currentIndex > 0) {
              const previousIndex = currentIndex - 1;
              console.log(
                "Moving focus to previous block index: ",
                previousIndex
              );
              this.api.caret.setToBlock(previousIndex, "end");
            } else {
              console.log("No previous block to move to.");
            }
          }, 0);
        }
      }
    };
    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <div>
        <QuestionTitle
          placeholder={"Type your question here"}
          onInput={(value) => {
            this.data.title = value;
          }}
          onKeyDown={onKeyDown}
          question={this.data.title}
        />
        <ShortAnswerInput
          onInputChange={(value: string): void => {
            this.data.placeholder = value || "";
          }}
          onKeyDown={onKeyDown}
          value={this.data.placeholder || ""}
        />
      </div>
    );
    return this.wrapper; // This block itself doesn't need content
  }

  save(blockContent: HTMLElement): {} {
    const target = blockContent.querySelector(
      ".short-answer-input-field"
    ) as HTMLInputElement;
    return {
      title: blockContent.querySelector(".question-title-field")?.innerHTML,
      placeholder: target?.value,
      required: this.data.required,
    };
  }
}
