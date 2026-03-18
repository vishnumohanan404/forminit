import { API, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import ShortAnswerInput from "../ui/ShortAnswerInput";

interface ShortAnswerDataInterface extends BlockToolData {
  placeholder?: string;
  required: boolean;
}

export default class ShortAnswerTool {
  // REMOVED: static get toolbox() - this hides it from the menu

  wrapper: HTMLElement | undefined;
  api: API;
  data: ShortAnswerDataInterface;

  constructor({ api, data }: { api: API; data: ShortAnswerDataInterface }) {
    this.api = api;
    this.wrapper = undefined;
    this.data = data || { required: false };
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("short-answer-input-block");

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
      if (event.key === "Backspace" && this.data.placeholder === "") {
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
      <ShortAnswerInput
        onInputChange={(value: string): void => {
          this.data.placeholder = value || "";
        }}
        onKeyDown={onKeyDown}
        value={this.data.placeholder || ""}
      />,
    );

    return this.wrapper;
  }

  save(blockContent: HTMLElement): ShortAnswerDataInterface {
    const target = blockContent.querySelector(".short-answer-input-field") as HTMLInputElement;
    return {
      placeholder: target?.value,
      required: this.data.required,
    };
  }
}
