import { API, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import LongAnswerInput from "../ui/LongAnswerInput";

interface LongAnswerDataInterface extends BlockToolData {
  placeholder?: string;
  required: boolean;
}

export default class LongAnswerTool {
  // REMOVED: static get toolbox() - this hides it from the menu

  wrapper: HTMLElement | undefined;
  api: API;
  data: LongAnswerDataInterface;

  constructor({ api, data }: { api: API; data: LongAnswerDataInterface }) {
    this.api = api;
    this.wrapper = undefined;
    this.data = data || { required: false };
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("long-answer-input-block");

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
      if (event.key === "Backspace" && this.data.placeholder === "") {
        const currentIndex = this.api.blocks.getCurrentBlockIndex();
        this.api.blocks.delete(currentIndex);
        requestAnimationFrame(() => {
          if (currentIndex > 0) {
            this.api.caret.setToBlock(currentIndex - 1, "end");
          }
        });
      }
    };

    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <LongAnswerInput
        onInputChange={(value: string): void => {
          this.data.placeholder = value || "";
        }}
        onKeyDown={onKeyDown}
        value={this.data.placeholder || ""}
      />,
    );

    return this.wrapper;
  }

  save(blockContent: HTMLElement): LongAnswerDataInterface {
    const target = blockContent.querySelector(".long-answer-input-field") as HTMLTextAreaElement;
    return {
      placeholder: target?.value,
      required: this.data.required,
    };
  }
}
