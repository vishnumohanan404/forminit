import { API, BlockAPI, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";
import MultipleChoiceOption from "../ui/MultipleChoiceOption";

interface MultipleChoiceDataInterface extends BlockToolData {
  title: string;
  options: Array<{ optionValue: string; optionMarker: string }>;
  required?: boolean;
}

export default class MultipleChoiceTool {
  static get toolbox() {
    return {
      title: "Multiple Choice",
      icon: '<svg width="10" height="10"" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
    };
  }
  wrapper: HTMLElement | undefined;
  api: API;
  data: MultipleChoiceDataInterface;
  block: BlockAPI;
  constructor({
    api,
    data,
    block,
  }: {
    api: API;
    block: BlockAPI;
    data: MultipleChoiceDataInterface;
  }) {
    console.log("data :>> ", data);
    this.api = api;
    this.block = block;
    this.data = Object.keys(data).length
      ? data
      : {
          title: "",
          options: [{ optionMarker: "a", optionValue: "" }],
          required: false,
        };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("multiple-choice-block");
    // Insert Title Block
    const onKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>,
      idx: number | undefined
    ) => {
      if (event.key === "Backspace") {
        if (
          this.data.options.length > 0 &&
          this.data.options[0].optionValue === ""
        ) {
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
        } else {
          this.data.options.filter((_, index) => index !== idx);
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

        <MultipleChoiceOption
          optionsProp={this.data.options}
          onLastOptionKeyDown={onKeyDown}
          onAddNewOption={(options) => {
            this.data.options = options;
          }}
          onInputChange={(options) => {
            this.data.options = options;
          }}
        />
      </div>
    );
    return this.wrapper; // This block itself doesn't need content
  }
  save(blockContent: HTMLElement): {} {
    console.log({ blockContent });
    // No need to save anything for the parent tool
    return { ...this.data };
  }
}
