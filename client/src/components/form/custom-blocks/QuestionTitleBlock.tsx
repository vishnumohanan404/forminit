import { API, BlockToolData } from "@editorjs/editorjs";
import QuestionTitle from "../ui/QuestionTitle"; // Assuming QuestionTitle is a React component
import * as ReactDOMClient from "react-dom/client";

interface TitleBlockData extends BlockToolData {
  title: string;
}

export default class QuestionTitleBlock {
  wrapper: HTMLElement | undefined;
  data: TitleBlockData;
  api: API;
  constructor({ api, data }: { api: API; data: TitleBlockData }) {
    this.api = api; // Assuming this.api is an instance of API class from EditorJS library.
    this.data = data || { title: "" };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("title-block");
    const onKeydown = (): void => {
      const currentIndex = this.api.blocks.getCurrentBlockIndex();
      this.api.blocks.delete(currentIndex);
      setTimeout(() => {
        if (currentIndex > 0) {
          const previousIndex = currentIndex - 1;
          console.log("Moving focus to previous block index: ", previousIndex);
          this.api.caret.setToBlock(previousIndex, "end");
        } else {
          console.log("No previous block to move to.");
        }
      }, 0);
    };
    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <QuestionTitle
        placeholder={"Type your question here"}
        onInput={(value) => {
          this.data.title = value;
        }}
        onKeyDown={onKeydown}
        question={this.data.title}
      />
    );
    this.api.selection.removeFakeBackground();
    return this.wrapper;
  }

  save(blockContent: HTMLElement) {
    const target = blockContent.querySelector(
      ".question-title-field"
    ) as HTMLDivElement;
    return {
      title: target?.innerText.trim(),
    };
  }
}
