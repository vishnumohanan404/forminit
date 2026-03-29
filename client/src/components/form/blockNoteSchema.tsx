import { useRef, useEffect, useState, type ReactNode } from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import MultipleChoiceOption from "@/components/form/ui/MultipleChoiceOption";
import RatingInput from "@/components/form/ui/RatingInput";
import type { OptionsEntry } from "./blockNoteAdapter";

// ---------------------------------------------------------------------------
// navigateFromBlock — shared arrow-key navigation logic for input blocks.
// Finds the adjacent block in editor.document order and either focuses its
// native input or restores the ProseMirror text cursor.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function navigateFromBlock(blockId: string, key: "ArrowUp" | "ArrowDown", editor: any) {
  const allBlocks: { id: string }[] = editor.document;
  const idx = allBlocks.findIndex(b => b.id === blockId);
  const delta = key === "ArrowDown" ? 1 : -1;
  const nextBlock = allBlocks[idx + delta];
  if (!nextBlock) return;

  const blockEls = Array.from(document.querySelectorAll<HTMLElement>(".bn-block-content"));
  const nextEl = blockEls[idx + delta];
  if (!nextEl) return;

  const nextInput = nextEl.querySelector<HTMLElement>("input:not([type='checkbox']), textarea");
  if (nextInput) {
    nextInput.focus();
  } else {
    editor.setTextCursorPosition(nextBlock.id, key === "ArrowDown" ? "start" : "end");
    editor._tiptapEditor.view.focus();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function insertBlockBelow(blockId: string, editor: any) {
  const allBlocks: { id: string }[] = editor.document;
  const idx = allBlocks.findIndex(b => b.id === blockId);
  editor.insertBlocks([{ type: "paragraph", content: [] }], { id: blockId }, "after");
  const newBlock = editor.document[idx + 1];
  if (newBlock) {
    editor.setTextCursorPosition(newBlock.id, "start");
    editor._tiptapEditor.view.focus();
  }
}

// ---------------------------------------------------------------------------
// KeyTrap — stops keyboard events from bubbling to ProseMirror
// React's synthetic onKeyDown fires after ProseMirror's native listener,
// so we attach a native listener directly via ref to intercept in time.
// ---------------------------------------------------------------------------

function KeyTrap({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (e: KeyboardEvent) => e.stopPropagation();
    el.addEventListener("keydown", stop);
    return () => el.removeEventListener("keydown", stop);
  }, []);
  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// questionTitle
// ---------------------------------------------------------------------------

const questionTitle = createReactBlockSpec(
  {
    type: "questionTitle" as const,
    propSchema: {},
    content: "inline",
  },
  {
    render: ({ block, contentRef }) => {
      const isEmpty =
        !block.content ||
        block.content.length === 0 ||
        (block.content.length === 1 &&
          block.content[0].type === "text" &&
          !(block.content[0] as { type: "text"; text: string }).text);

      return (
        <>
          <div
            ref={contentRef}
            className="text-lg font-semibold text-foreground leading-snug"
          />
          {isEmpty && (
            <div
              className="absolute top-0 left-0 text-lg font-semibold text-muted-foreground pointer-events-none select-none"
              aria-hidden="true"
            >
              Question title…
            </div>
          )}
        </>
      );
    },
  },
);

// ---------------------------------------------------------------------------
// Shared Required toggle — inline, to the right of the input
// ---------------------------------------------------------------------------

function RequiredToggle({
  required,
  onChange,
}: {
  required: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted-foreground select-none cursor-pointer whitespace-nowrap shrink-0">
      <input
        type="checkbox"
        checked={required}
        onChange={e => onChange(e.target.checked)}
        className="accent-primary"
      />
      Required
    </label>
  );
}

// ---------------------------------------------------------------------------
// shortAnswerTool
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShortAnswerBlock({ block, editor }: { block: any; editor: any }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(editor);
  editorRef.current = editor;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const blockId = block.id;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        insertBlockBelow(blockId, editorRef.current);
        return;
      }
      if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
        e.preventDefault();
        e.stopPropagation();
        navigateFromBlock(blockId, "ArrowUp", editorRef.current);
        editorRef.current.removeBlocks([{ id: blockId }]);
        return;
      }
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      e.stopPropagation();
      navigateFromBlock(blockId, e.key as "ArrowUp" | "ArrowDown", editorRef.current);
    };
    el.addEventListener("keydown", handler, true);
    return () => el.removeEventListener("keydown", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id]);

  return (
    <KeyTrap className="py-1 w-full flex items-center gap-3">
      <input
        ref={inputRef}
        type="text"
        className="flex-1 max-w-sm h-10 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder={block.props.placeholder || "Type placeholder…"}
        value={block.props.placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          editor.updateBlock(block, { props: { placeholder: e.target.value } })
        }
      />
      <RequiredToggle
        required={block.props.required}
        onChange={(v: boolean) => editor.updateBlock(block, { props: { required: v } })}
      />
    </KeyTrap>
  );
}

const shortAnswerTool = createReactBlockSpec(
  {
    type: "shortAnswerTool" as const,
    propSchema: {
      placeholder: { default: "" },
      required: { default: false },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <ShortAnswerBlock
        block={block}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// longAnswerTool
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LongAnswerBlock({ block, editor }: { block: any; editor: any }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef(editor);
  editorRef.current = editor;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const blockId = block.id;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        insertBlockBelow(blockId, editorRef.current);
        return;
      }
      if (e.key === "Backspace" && el.value === "" && el.selectionStart === 0) {
        e.preventDefault();
        e.stopPropagation();
        navigateFromBlock(blockId, "ArrowUp", editorRef.current);
        editorRef.current.removeBlocks([{ id: blockId }]);
        return;
      }
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      if (e.key === "ArrowUp" && el.selectionStart !== 0) return;
      if (e.key === "ArrowDown" && el.selectionEnd !== el.value.length) return;
      e.preventDefault();
      e.stopPropagation();
      navigateFromBlock(blockId, e.key as "ArrowUp" | "ArrowDown", editorRef.current);
    };
    el.addEventListener("keydown", handler, true);
    return () => el.removeEventListener("keydown", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id]);

  return (
    <KeyTrap className="py-1 w-full flex items-start gap-3">
      <textarea
        ref={textareaRef}
        className="w-[80%] min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        placeholder={block.props.placeholder || "Type placeholder…"}
        value={block.props.placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          editor.updateBlock(block, { props: { placeholder: e.target.value } })
        }
      />
      <div className="mt-2.5">
        <RequiredToggle
          required={block.props.required}
          onChange={(v: boolean) => editor.updateBlock(block, { props: { required: v } })}
        />
      </div>
    </KeyTrap>
  );
}

const longAnswerTool = createReactBlockSpec(
  {
    type: "longAnswerTool" as const,
    propSchema: {
      placeholder: { default: "" },
      required: { default: false },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <LongAnswerBlock
        block={block}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// emailTool
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmailBlock({ block, editor }: { block: any; editor: any }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(editor);
  editorRef.current = editor;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const blockId = block.id;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        insertBlockBelow(blockId, editorRef.current);
        return;
      }
      if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
        e.preventDefault();
        e.stopPropagation();
        navigateFromBlock(blockId, "ArrowUp", editorRef.current);
        editorRef.current.removeBlocks([{ id: blockId }]);
        return;
      }
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      e.stopPropagation();
      navigateFromBlock(blockId, e.key as "ArrowUp" | "ArrowDown", editorRef.current);
    };
    el.addEventListener("keydown", handler, true);
    return () => el.removeEventListener("keydown", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id]);

  return (
    <KeyTrap className="py-1 w-full flex items-center gap-3">
      <input
        ref={inputRef}
        type="text"
        className="flex-1 max-w-sm h-10 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder={block.props.placeholder || "name@example.com"}
        value={block.props.placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          editor.updateBlock(block, { props: { placeholder: e.target.value } })
        }
      />
      <RequiredToggle
        required={block.props.required}
        onChange={(v: boolean) => editor.updateBlock(block, { props: { required: v } })}
      />
    </KeyTrap>
  );
}

const emailTool = createReactBlockSpec(
  {
    type: "emailTool" as const,
    propSchema: {
      placeholder: { default: "name@example.com" },
      required: { default: false },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <EmailBlock
        block={block}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// dateTool
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DateToolBlock({ block, editor }: { block: any; editor: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <KeyTrap className="py-1 w-full flex items-center gap-3">
        <TooltipProvider>
          <Tooltip
            open={open}
            onOpenChange={setOpen}
          >
            <TooltipTrigger asChild>
              <div
                className="flex items-center max-w-sm h-10 rounded-md border border-border bg-background px-3 gap-2 text-muted-foreground cursor-default"
                onPointerEnter={() => setOpen(true)}
                onPointerLeave={() => setOpen(false)}
              >
                <input
                  type="date"
                  disabled
                  className="flex-1 bg-transparent text-sm text-muted-foreground focus:outline-none cursor-default [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <CalendarIcon
                  size={14}
                  className="shrink-0"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Date picker will be available in the published form</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <RequiredToggle
          required={block.props.required}
          onChange={v => editor.updateBlock(block, { props: { required: v } })}
        />
      </KeyTrap>
    </div>
  );
}

const dateTool = createReactBlockSpec(
  {
    type: "dateTool" as const,
    propSchema: {
      required: { default: false },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <DateToolBlock
        block={block}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// multipleChoiceTool
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MCQBlock({ block, editor }: { block: any; editor: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef(editor);
  editorRef.current = editor;
  const blockRef = useRef(block);
  blockRef.current = block;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const blockId = block.id;
    const handler = (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        insertBlockBelow(blockId, editorRef.current);
        return;
      }
      if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
        const opts: OptionsEntry[] = (() => {
          try {
            return JSON.parse(blockRef.current.props.optionsJson);
          } catch {
            return [];
          }
        })();
        e.preventDefault();
        e.stopPropagation();
        if (opts.length <= 1) {
          // Last option — remove the whole block and move cursor to questionTitle
          navigateFromBlock(blockId, "ArrowUp", editorRef.current);
          editorRef.current.removeBlocks([{ id: blockId }]);
        } else {
          // Multiple options — remove the focused option and focus the adjacent one
          const allInputs = Array.from(
            containerRef.current?.querySelectorAll<HTMLInputElement>("input[type='text']") ?? [],
          );
          const idx = allInputs.indexOf(e.target as HTMLInputElement);
          if (idx === -1) return;
          const newOpts = opts.filter((_, i) => i !== idx);
          editorRef.current.updateBlock(
            { id: blockId },
            { props: { optionsJson: JSON.stringify(newOpts) } },
          );
          const focusIdx = idx > 0 ? idx - 1 : 0;
          setTimeout(() => {
            const inputs = Array.from(
              containerRef.current?.querySelectorAll<HTMLInputElement>("input[type='text']") ?? [],
            );
            inputs[focusIdx]?.focus();
          }, 0);
        }
      }
    };
    el.addEventListener("keydown", handler, true);
    return () => el.removeEventListener("keydown", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id]);

  const options: OptionsEntry[] = (() => {
    try {
      return JSON.parse(block.props.optionsJson);
    } catch {
      return [{ optionValue: "", optionMarker: "a" }];
    }
  })();

  const updateOptions = (newOptions: OptionsEntry[]) => {
    editor.updateBlock(block, { props: { optionsJson: JSON.stringify(newOptions) } });
  };

  return (
    <div ref={containerRef}>
      <KeyTrap className="py-1 w-full">
        <MultipleChoiceOption
          optionsProp={options}
          onInputChange={updateOptions}
          onAddNewOption={updateOptions}
          onLastOptionKeyDown={() => {}}
          required={block.props.required}
          onRequiredChange={(v: boolean) => editor.updateBlock(block, { props: { required: v } })}
        />
      </KeyTrap>
    </div>
  );
}

const multipleChoiceTool = createReactBlockSpec(
  {
    type: "multipleChoiceTool" as const,
    propSchema: {
      required: { default: false },
      optionsJson: { default: JSON.stringify([{ optionValue: "", optionMarker: "a" }]) },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <MCQBlock
        block={block}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// dropdownTool
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DropdownBlock({ block, editor }: { block: any; editor: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef(editor);
  editorRef.current = editor;
  const blockRef = useRef(block);
  blockRef.current = block;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const blockId = block.id;
    const handler = (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        insertBlockBelow(blockId, editorRef.current);
        return;
      }
      if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
        const opts: OptionsEntry[] = (() => {
          try {
            return JSON.parse(blockRef.current.props.optionsJson);
          } catch {
            return [];
          }
        })();
        e.preventDefault();
        e.stopPropagation();
        if (opts.length <= 1) {
          navigateFromBlock(blockId, "ArrowUp", editorRef.current);
          editorRef.current.removeBlocks([{ id: blockId }]);
        } else {
          const allInputs = Array.from(
            containerRef.current?.querySelectorAll<HTMLInputElement>("input[type='text']") ?? [],
          );
          const idx = allInputs.indexOf(e.target as HTMLInputElement);
          if (idx === -1) return;
          const newOpts = opts.filter((_, i) => i !== idx);
          editorRef.current.updateBlock(
            { id: blockId },
            { props: { optionsJson: JSON.stringify(newOpts) } },
          );
          const focusIdx = idx > 0 ? idx - 1 : 0;
          setTimeout(() => {
            const inputs = Array.from(
              containerRef.current?.querySelectorAll<HTMLInputElement>("input[type='text']") ?? [],
            );
            inputs[focusIdx]?.focus();
          }, 0);
        }
      }
    };
    el.addEventListener("keydown", handler, true);
    return () => el.removeEventListener("keydown", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id]);

  const options: OptionsEntry[] = (() => {
    try {
      return JSON.parse(block.props.optionsJson);
    } catch {
      return [{ optionValue: "", optionMarker: "a" }];
    }
  })();

  const updateOptions = (newOptions: OptionsEntry[]) => {
    editor.updateBlock(block, { props: { optionsJson: JSON.stringify(newOptions) } });
  };

  return (
    <div ref={containerRef}>
      <KeyTrap className="py-1 w-full">
        {/* Faux select trigger — shows dropdown shape in editor */}
        <div className="flex items-center max-w-sm h-10 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground pointer-events-none select-none mb-2">
          <span className="flex-1">Select an option…</span>
          <ChevronDownIcon
            size={14}
            className="shrink-0 opacity-50"
          />
        </div>
        <MultipleChoiceOption
          optionsProp={options}
          onInputChange={updateOptions}
          onAddNewOption={updateOptions}
          onLastOptionKeyDown={() => {}}
          required={block.props.required}
          onRequiredChange={(v: boolean) => editor.updateBlock(block, { props: { required: v } })}
        />
      </KeyTrap>
    </div>
  );
}

const dropdownTool = createReactBlockSpec(
  {
    type: "dropdownTool" as const,
    propSchema: {
      required: { default: false },
      optionsJson: { default: JSON.stringify([{ optionValue: "", optionMarker: "a" }]) },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <DropdownBlock
        block={block}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// ratingTool
// ---------------------------------------------------------------------------

const ratingTool = createReactBlockSpec(
  {
    type: "ratingTool" as const,
    propSchema: {
      required: { default: false },
      maxRating: { default: 5 },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <KeyTrap className="py-1 w-full flex items-center gap-4">
        <div className="flex items-center gap-3">
          <RatingInput
            value={0}
            maxRating={block.props.maxRating}
            onChange={() => {}}
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-6 h-6 rounded border border-border text-xs flex items-center justify-center hover:bg-muted"
              onClick={() =>
                editor.updateBlock(block, {
                  props: { maxRating: Math.max(1, block.props.maxRating - 1) },
                })
              }
            >
              −
            </button>
            <span className="text-xs text-muted-foreground w-4 text-center">
              {block.props.maxRating}
            </span>
            <button
              type="button"
              className="w-6 h-6 rounded border border-border text-xs flex items-center justify-center hover:bg-muted"
              onClick={() =>
                editor.updateBlock(block, {
                  props: { maxRating: Math.min(10, block.props.maxRating + 1) },
                })
              }
            >
              +
            </button>
          </div>
        </div>
        <RequiredToggle
          required={block.props.required}
          onChange={v => editor.updateBlock(block, { props: { required: v } })}
        />
      </KeyTrap>
    ),
  },
);

// ---------------------------------------------------------------------------
// Schema assembly
// ---------------------------------------------------------------------------

export const formNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    questionTitle: questionTitle(),
    shortAnswerTool: shortAnswerTool(),
    longAnswerTool: longAnswerTool(),
    emailTool: emailTool(),
    dateTool: dateTool(),
    multipleChoiceTool: multipleChoiceTool(),
    dropdownTool: dropdownTool(),
    ratingTool: ratingTool(),
  },
});

export type FormNoteSchema = typeof formNoteSchema;
