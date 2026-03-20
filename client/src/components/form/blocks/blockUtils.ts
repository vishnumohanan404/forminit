/**
 * Returns true if the cursor is at the very start or end of a contenteditable element.
 */
export function isCursorAtEdge(el: HTMLElement, edge: "start" | "end"): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !el.contains(sel.focusNode)) return false;
  const range = document.createRange();
  if (edge === "end") {
    range.selectNodeContents(el);
    range.setStart(sel.focusNode!, sel.focusOffset);
    return range.toString().length === 0;
  } else {
    range.selectNodeContents(el);
    range.setEnd(sel.focusNode!, sel.focusOffset);
    return range.toString().length === 0;
  }
}

/**
 * Focuses a contenteditable element and places the cursor at start or end.
 */
export function focusContentEditable(el: HTMLElement, at: "start" | "end") {
  el.focus();
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(at === "start");
  sel.removeAllRanges();
  sel.addRange(range);
}
