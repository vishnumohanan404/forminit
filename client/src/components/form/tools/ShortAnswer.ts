import { API } from "@editorjs/editorjs";

export default class ShortAnswerTool {
  static get toolbox() {
    return {
      title: "Short Answers",
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/><path d="M15 8h2v8h-2zM11 8h2v8h-2zM7 8h2v8H7z" fill="currentColor"/></svg>',
    };
  }
  api: API;
  constructor({ api }: { api: API }) {
    this.api = api;
  }

  render() {
    // Insert Title Block
    this.api.blocks.insert(
      "questionTitleBlock",
      { title: "" },
      undefined,
      this.api.blocks.getCurrentBlockIndex() + 1,
      true
    );

    // Insert Input Block
    this.api.blocks.insert(
      "shortAnswerInputBlock",
      { inputValue: "" },
      undefined,
      this.api.blocks.getCurrentBlockIndex() + 2,
      true
    );

    return document.createElement("div"); // This block itself doesn't need content
  }

  save(blockContent: HTMLElement): {} {
    console.log({ blockContent });
    // No need to save anything for the parent tool
    return {};
  }
}
