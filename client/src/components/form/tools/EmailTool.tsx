import { API, BlockAPI, BlockToolData } from "@editorjs/editorjs";
import * as ReactDOMClient from "react-dom/client";
import QuestionTitle from "../ui/QuestionTitle";
import { Input } from "@/components/ui/input";

interface EmailToolDataInterface extends BlockToolData {
  title: string;
  required: boolean;
  placeholder?: string;
}

export default class EmailTool {
  static get toolbox() {
    return {
      title: "Email",
      icon: '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5C2.5 3.67 3.17 3 4 3H16C16.83 3 17.5 3.67 17.5 4.5V15.5C17.5 16.33 16.83 17 16 17H4C3.17 17 2.5 16.33 2.5 15.5V4.5ZM4 4L10 9.5L16 4H4ZM16.5 5.09L10.32 10.79C10.14 10.93 9.86 10.93 9.68 10.79L3.5 5.09V15.5C3.5 15.78 3.72 16 4 16H16C16.28 16 16.5 15.78 16.5 15.5V5.09Z" fill="currentColor"/>',
    };
  }

  wrapper: HTMLElement | undefined;
  api: API;
  data: EmailToolDataInterface;
  block: BlockAPI;

  constructor({ api, data, block }: { api: API; block: BlockAPI; data: EmailToolDataInterface }) {
    this.api = api;
    this.block = block;
    this.data = Object.keys(data).length ? data : { title: "", required: false, placeholder: "" };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("email-block");

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
          type="email"
          placeholder="Email address"
          className="focus-visible:ring-0 my-2 w-[60%]"
          readOnly
          tabIndex={-1}
        />
      </div>,
    );
    return this.wrapper;
  }

  save(): EmailToolDataInterface {
    return { ...this.data };
  }
}
