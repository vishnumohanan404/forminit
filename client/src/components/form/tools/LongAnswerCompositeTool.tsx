import { API } from "@editorjs/editorjs";

export default class LongAnswerCompositeTool {
  static get toolbox() {
    return {
      title: "Long Answer",
      icon: '<svg width="10" height="10" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 4C2.25 3.72386 2.47386 3.5 2.75 3.5H12.25C12.5261 3.5 12.75 3.72386 12.75 4C12.75 4.27614 12.5261 4.5 12.25 4.5H2.75C2.47386 4.5 2.25 4.27614 2.25 4Z" fill="currentColor"/><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor"/><path d="M2.25 11C2.25 10.7239 2.47386 10.5 2.75 10.5H12.25C12.5261 10.5 12.75 10.7239 12.75 11C12.75 11.2761 12.5261 11.5 12.25 11.5H2.75C2.47386 11.5 2.25 11.2761 2.25 11Z" fill="currentColor"/></svg>',
    };
  }

  api: API;
  wrapper: HTMLElement | undefined;

  constructor({ api }: { api: API }) {
    this.api = api;
    this.wrapper = undefined;
  }

  async render() {
    this.wrapper = document.createElement("div");

    setTimeout(async () => {
      const currentIndex = this.api.blocks.getCurrentBlockIndex();

      // Insert question title at current position
      await this.api.blocks.insert("questionTitle", { title: "" }, {}, currentIndex, false);

      // Insert long answer input below it
      await this.api.blocks.insert(
        "longAnswerTool",
        { placeholder: "", required: false },
        {},
        currentIndex + 1,
        false,
      );

      // Delete this composite block
      this.api.blocks.delete(currentIndex + 2);

      // Focus on the question title
      this.api.caret.setToBlock(currentIndex, "start");
    }, 0);

    return this.wrapper;
  }

  save() {
    return {};
  }
}
