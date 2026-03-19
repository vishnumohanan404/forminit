import { API, BlockAPI, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";
import MultipleChoiceOption from "../ui/MultipleChoiceOption";

interface DropdownToolDataInterface extends BlockToolData {
  title: string;
  options: Array<{ optionValue: string; optionMarker: string }>;
  required: boolean;
}

export default class DropdownTool {
  static get toolbox() {
    return {
      title: "Dropdown",
      icon: '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5.5C3 4.67 3.67 4 4.5 4H15.5C16.33 4 17 4.67 17 5.5V14.5C17 15.33 16.33 16 15.5 16H4.5C3.67 16 3 15.33 3 14.5V5.5ZM4.5 5C4.22 5 4 5.22 4 5.5V14.5C4 14.78 4.22 15 4.5 15H15.5C15.78 15 16 14.78 16 14.5V5.5C16 5.22 15.78 5 15.5 5H4.5ZM10 11.5L7 8.5H13L10 11.5Z" fill="currentColor"/>',
    };
  }

  wrapper: HTMLElement | undefined;
  api: API;
  data: DropdownToolDataInterface;
  block: BlockAPI;

  constructor({
    api,
    data,
    block,
  }: {
    api: API;
    block: BlockAPI;
    data: DropdownToolDataInterface;
  }) {
    this.api = api;
    this.block = block;
    this.data = Object.keys(data).length
      ? data
      : { title: "", options: [{ optionMarker: "a", optionValue: "" }], required: false };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("dropdown-block");

    const onKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>,
      idx: number | undefined,
    ) => {
      if (event.key === "Backspace") {
        if (this.data.options.length > 0 && this.data.options[0].optionValue === "") {
          if (this.data.title === "") {
            const currentIndex = this.api.blocks.getCurrentBlockIndex();
            this.api.blocks.delete(currentIndex);
            requestAnimationFrame(() => {
              if (currentIndex > 0) {
                this.api.caret.setToBlock(currentIndex - 1, "end");
              }
            });
          }
        } else {
          this.data.options.filter((_, index) => index !== idx);
        }
      }
    };

    const root = ReactDOMClient.createRoot(this.wrapper);
    root.render(
      <div>
        <QuestionTitle
          placeholder="Type your question here"
          onInput={value => {
            this.data.title = value;
          }}
          onKeyDown={onKeyDown}
          question={this.data.title}
        />
        <div className="my-2 w-[60%] flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
          Select an option ▾
        </div>
        <div className="mt-3">
          <MultipleChoiceOption
            optionsProp={this.data.options}
            onLastOptionKeyDown={onKeyDown}
            onAddNewOption={options => {
              this.data.options = options;
            }}
            onInputChange={options => {
              this.data.options = options;
            }}
          />
        </div>
      </div>,
    );
    return this.wrapper;
  }

  save(): DropdownToolDataInterface {
    return { ...this.data };
  }
}
