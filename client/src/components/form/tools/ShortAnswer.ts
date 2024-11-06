import { API } from "@editorjs/editorjs";

export default class ShortAnswerTool {
  static get toolbox() {
    return {
      title: "Short Answers",
      icon: '<svg width="10" height="10" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
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
  validate() {
    return false;
  }
  save(blockContent: HTMLElement): {} {
    console.log({ blockContent });
    // No need to save anything for the parent tool
    return {};
  }
}
