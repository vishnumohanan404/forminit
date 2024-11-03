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
      this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
    };
    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <QuestionTitle
        placeholder={"Type your question here"}
        onInput={(value) => {
          this.data.title = value;
        }}
        onKeyDown={onKeydown}
      />
    );
    return this.wrapper;
  }

  save(blockContent: HTMLElement) {
    const target = blockContent.querySelector(".title-field") as HTMLDivElement;
    return {
      title: target?.innerText,
    };
  }
}
