import { API, BlockToolData } from "@editorjs/editorjs";
import LongAnswerInput from "../ui/LongAnswerInput";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";

interface LongAnswerDataInterface extends BlockToolData {
  title: string;
  placeholder: string;
  required?: boolean;
}

export default class LongAnswerTool {
  static get toolbox() {
    return {
      title: "Long Answers",
      icon: '<svg width="10" height="10" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
    };
  }
  wrapper: HTMLElement | undefined;
  api: API;
  data: LongAnswerDataInterface;
  constructor({ api, data }: { api: API; data: LongAnswerDataInterface }) {
    this.api = api;
    this.wrapper = undefined;
    this.data = data || { title: "", required: false };
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("long-answer-block");
    const onKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>
    ) => {
      if (event.key === "Backspace") {
        if (this.data.title === "") {
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
        <LongAnswerInput
          onInputChange={(value) => {
            this.data.placeholder = value;
          }}
          onKeyDown={onKeyDown}
          value={this.data.placeholder || ""}
        />
      </div>
    );
    return this.wrapper; // This block itself doesn't need content
  }
  save(blockContent: HTMLElement): {} {
    console.log({ blockContent });
    // No need to save anything for the parent tool
    return {
      ...this.data,
    };
  }
}
