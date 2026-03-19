import { API, BlockAPI, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";
import { Input } from "@/components/ui/input";

interface DateToolDataInterface extends BlockToolData {
  title: string;
  required: boolean;
}

export default class DateTool {
  static get toolbox() {
    return {
      title: "Date",
      icon: '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 1C6.78 1 7 1.22 7 1.5V3H13V1.5C13 1.22 13.22 1 13.5 1C13.78 1 14 1.22 14 1.5V3H16C16.55 3 17 3.45 17 4V17C17 17.55 16.55 18 16 18H4C3.45 18 3 17.55 3 17V4C3 3.45 3.45 3 4 3H6V1.5C6 1.22 6.22 1 6.5 1ZM4 7V17H16V7H4ZM4 4V6H16V4H4Z" fill="currentColor"/>',
    };
  }

  wrapper: HTMLElement | undefined;
  api: API;
  data: DateToolDataInterface;
  block: BlockAPI;

  constructor({ api, data, block }: { api: API; block: BlockAPI; data: DateToolDataInterface }) {
    this.api = api;
    this.block = block;
    this.data = Object.keys(data).length ? data : { title: "", required: false };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("date-block");

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
        <Input
          type="date"
          className="focus-visible:ring-0 my-2 w-[60%]"
          readOnly
          tabIndex={-1}
        />
      </div>,
    );
    return this.wrapper;
  }

  save(): DateToolDataInterface {
    return { ...this.data };
  }
}
