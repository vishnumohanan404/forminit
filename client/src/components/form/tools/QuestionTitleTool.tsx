import { API, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";

interface QuestionTitleDataInterface extends BlockToolData {
  title: string;
}

export default class QuestionTitleTool {
  // REMOVED: static get toolbox() - this hides it from the menu

  wrapper: HTMLElement | undefined;
  api: API;
  data: QuestionTitleDataInterface;

  constructor({ api, data }: { api: API; data: QuestionTitleDataInterface }) {
    this.api = api;
    this.wrapper = undefined;
    this.data = data || { title: "" };
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("question-title-block");

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const currentIndex = this.api.blocks.getCurrentBlockIndex();

        // Insert ShortAnswerTool block below (use the registered name)
        this.api.blocks.insert(
          "shortAnswer",
          { placeholder: "", required: false },
          {},
          currentIndex + 1,
          true,
        );
      }

      if (event.key === "Backspace" && this.data.title === "") {
        const currentIndex = this.api.blocks.getCurrentBlockIndex();
        this.api.blocks.delete(currentIndex);
        setTimeout(() => {
          if (currentIndex > 0) {
            this.api.caret.setToBlock(currentIndex - 1, "end");
          }
        }, 0);
      }
    };

    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <QuestionTitle
        placeholder={"Type your question here"}
        onInput={value => {
          this.data.title = value;
        }}
        onKeyDown={onKeyDown}
        question={this.data.title}
      />,
    );

    return this.wrapper;
  }

  save(blockContent: HTMLElement): QuestionTitleDataInterface {
    return {
      title: blockContent.querySelector(".question-title-field")?.innerHTML || "",
    };
  }
}
