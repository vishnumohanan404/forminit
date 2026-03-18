import { API } from "@editorjs/editorjs";

export default class ShortAnswerCompositeTool {
  static get toolbox() {
    return {
      title: "Short Answer",
      icon: '<svg width="10" height="10" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
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

      // Insert short answer input below it
      await this.api.blocks.insert(
        "shortAnswer",
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
