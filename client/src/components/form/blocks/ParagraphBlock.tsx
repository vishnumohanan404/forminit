import { useEffect, useRef } from "react";
import { isCursorAtEdge, focusContentEditable } from "./blockUtils";

export interface ParagraphData {
  text: string;
}

interface ParagraphBlockProps {
  blockId: string;
  data: ParagraphData;
  onChange: (data: ParagraphData) => void;
  onEnterKey: () => void;
  onBackspaceEmpty: () => void;
  onSlashKey: () => void;
  onArrowDown: () => void;
  onArrowUp: () => void;
  registerFocusFn: (id: string, fn: (at: "start" | "end") => void) => void;
  unregisterFocusFn: (id: string) => void;
  autoFocus?: boolean;
}

const ParagraphBlock = ({
  blockId,
  data,
  onChange,
  onEnterKey,
  onBackspaceEmpty,
  onSlashKey,
  onArrowDown,
  onArrowUp,
  registerFocusFn,
  unregisterFocusFn,
  autoFocus,
}: ParagraphBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Keep DOM in sync when data changes externally (e.g. initial load)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== data.text) {
      ref.current.innerText = data.text || "";
    }
  }, [data.text]);

  // Register focus function for arrow-key navigation from adjacent blocks
  useEffect(() => {
    registerFocusFn(blockId, at => {
      if (ref.current) focusContentEditable(ref.current, at);
    });
    return () => unregisterFocusFn(blockId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockId]);

  // Auto-focus when a new block is inserted (e.g. Enter key)
  useEffect(() => {
    if (autoFocus && ref.current) {
      focusContentEditable(ref.current, "start");
    }
  }, [autoFocus]);

  const handleInput = () => {
    onChange({ text: ref.current?.innerText || "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = ref.current;

    if (e.key === "/" && !el?.innerText.trim()) {
      e.preventDefault();
      onSlashKey();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnterKey();
      return;
    }

    if (e.key === "Backspace" && !el?.innerText) {
      onBackspaceEmpty();
      return;
    }

    if (e.key === "ArrowDown" && el && isCursorAtEdge(el, "end")) {
      e.preventDefault();
      onArrowDown();
      return;
    }

    if (e.key === "ArrowUp" && el && isCursorAtEdge(el, "start")) {
      e.preventDefault();
      onArrowUp();
      return;
    }
  };

  return (
    <div
      ref={ref}
      role="textbox"
      aria-multiline="true"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      className="outline-none py-1 text-base min-h-[1.75rem] break-words"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-placeholder="Type '/' for commands"
    />
  );
};

export default ParagraphBlock;
