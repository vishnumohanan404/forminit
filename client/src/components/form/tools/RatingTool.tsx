import { API, BlockAPI, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";
import RatingInput from "../ui/RatingInput";

interface RatingToolDataInterface extends BlockToolData {
  title: string;
  required: boolean;
  maxRating: number;
}

export default class RatingTool {
  static get toolbox() {
    return {
      title: "Rating",
      icon: '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.5L12.39 6.26L17.5 7.27L13.75 11.01L14.78 16.5L10 13.77L5.22 16.5L6.25 11.01L2.5 7.27L7.61 6.26L10 1.5Z" fill="currentColor"/>',
    };
  }

  wrapper: HTMLElement | undefined;
  api: API;
  data: RatingToolDataInterface;
  block: BlockAPI;

  constructor({ api, data, block }: { api: API; block: BlockAPI; data: RatingToolDataInterface }) {
    this.api = api;
    this.block = block;
    this.data = Object.keys(data).length ? data : { title: "", required: false, maxRating: 5 };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("rating-block");

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
      if (event.key === "Backspace" && this.data.title === "") {
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
      <div>
        <QuestionTitle
          placeholder="Type your question here"
          onInput={value => {
            this.data.title = value;
          }}
          onKeyDown={onKeyDown}
          question={this.data.title}
        />
        <RatingInput
          value={0}
          maxRating={this.data.maxRating}
          onChange={() => {}}
        />
      </div>,
    );
    return this.wrapper;
  }

  save(): RatingToolDataInterface {
    return { ...this.data };
  }
}
