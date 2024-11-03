import { API, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import ShortAnswerInput from "../ui/ShortAnswerInput";
import LongAnswerInput from "../ui/LongAnswerInput";

interface LongAnswerInputBlockData extends BlockToolData {
  inputValue: string;
}
export default class LongAnswerInputBlock {
  api: API;
  data: LongAnswerInputBlockData;
  wrapper: HTMLElement | undefined;
  constructor({ data, api }: { data: LongAnswerInputBlockData; api: API }) {
    this.api = api;
    this.data = data || { inputValue: "" };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("input-block");

    const onInput = (value: string): void => {
      this.data.inputValue = value || "";
    };
    const onKeydown = (): void => {
      this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
    };

    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <LongAnswerInput
        onInputChange={onInput}
        onKeyDown={onKeydown}
        value={this.data.inputValue || ""}
      />
    );

    return this.wrapper;
  }

  save(blockContent: HTMLElement) {
    return {
      inputValue: blockContent.querySelector("input")?.value,
    };
  }
}
