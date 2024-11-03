import { API } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import MultipleChoiceOption from "../ui/MultipleChoiceOption";

interface MultipleChoiceOptionData {
  optionValue: string;
  optionMarker: string;
}
export default class MultipleChoiceOptionBlock {
  api: API;
  data: MultipleChoiceOptionData;
  wrapper: HTMLElement | undefined;
  constructor({ data, api }: { data: MultipleChoiceOptionData; api: API }) {
    this.api = api;
    this.data = data || { optionValue: "", optionMarker: "" };
    this.wrapper = undefined;
  }
  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("mc-option-block");

    const onInput = (value: string): void => {
      console.log("onInput", value);
      this.data.optionValue = value || "";
    };
    const onKeydown = (): void => {
      this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
    };

    const root = ReactDOMClient.createRoot(this.wrapper);

    const handleAddNextOption = (): void => {
      const currentIndex = this.api.blocks.getCurrentBlockIndex();
      const currentBlock = this.api.blocks.getBlockByIndex(currentIndex);
      const currentOptionMarker =
        currentBlock?.holder?.querySelector("span")?.textContent;
      let nextCharCode: number = 0;
      console.log("currentOptionMarker :>> ", currentOptionMarker);
      if (currentOptionMarker?.charCodeAt(0)) {
        nextCharCode = currentOptionMarker.charCodeAt(0) + 1;
      }
      const optionMarker = String.fromCharCode(nextCharCode);
      console.log("optionMarker :>> ", optionMarker);
      this.api.blocks.insert(
        "multipleChoiceOptionBlock",
        { optionValue: "", optionMarker: optionMarker },
        undefined,
        this.api.blocks.getCurrentBlockIndex() + 2,
        true
      );
    };

    root.render(
      <MultipleChoiceOption
        onInputChange={onInput}
        onKeyDown={onKeydown}
        onHandleAddNextOption={handleAddNextOption}
        data={{
          optionValue: this.data.optionValue || "",
          optionMarker: this.data.optionMarker || "a",
        }}
      />
    );

    return this.wrapper;
  }

  save(blockContent: HTMLElement) {
    return {
      optionValue: blockContent.querySelector("input")?.value,
      optionMarker: blockContent.querySelector("span")?.textContent,
    };
  }

  /**
   * Handle backspace when the block is empty
   */
}
