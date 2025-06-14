import Paragraph from "@editorjs/paragraph";

export default class CustomParagraph extends Paragraph {
  static get toolbox() {
    return null; // Prevents the tool from showing in the toolbox
  }
}
