import { useRef, useEffect, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import MultipleChoiceOption from "@/components/form/ui/MultipleChoiceOption";
import RatingInput from "@/components/form/ui/RatingInput";
import type { OptionsEntry } from "./blockNoteAdapter";

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
      <KeyTrap className="py-1 w-full flex items-center gap-3">
        <input
          type="text"
          className="flex-1 max-w-sm h-10 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder={block.props.placeholder || "Type placeholder…"}
          value={block.props.placeholder}
          onChange={e => editor.updateBlock(block, { props: { placeholder: e.target.value } })}
        />
        <RequiredToggle
          required={block.props.required}
          onChange={v => editor.updateBlock(block, { props: { required: v } })}
        />
      </KeyTrap>
    ),
  },
);

// ---------------------------------------------------------------------------
// longAnswerTool
// ---------------------------------------------------------------------------

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
      <KeyTrap className="py-1 w-full flex items-start gap-3">
        <textarea
          className="flex-1 max-w-sm min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          placeholder={block.props.placeholder || "Type placeholder…"}
          value={block.props.placeholder}
          onChange={e => editor.updateBlock(block, { props: { placeholder: e.target.value } })}
        />
        <div className="mt-2.5">
          <RequiredToggle
            required={block.props.required}
            onChange={v => editor.updateBlock(block, { props: { required: v } })}
          />
        </div>
      </KeyTrap>
    ),
  },
);

// ---------------------------------------------------------------------------
// emailTool
// ---------------------------------------------------------------------------

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
      <KeyTrap className="py-1 w-full flex items-center gap-3">
        <input
          type="text"
          className="flex-1 max-w-sm h-10 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder={block.props.placeholder || "name@example.com"}
          value={block.props.placeholder}
          onChange={e => editor.updateBlock(block, { props: { placeholder: e.target.value } })}
        />
        <RequiredToggle
          required={block.props.required}
          onChange={v => editor.updateBlock(block, { props: { required: v } })}
        />
      </KeyTrap>
    ),
  },
);

// ---------------------------------------------------------------------------
// dateTool
// ---------------------------------------------------------------------------

function DateToolBlock({
  block,
  editor,
}: {
  block: Parameters<Parameters<typeof createReactBlockSpec>[1]["render"]>[0]["block"] & {
    type: "dateTool";
    props: { required: boolean };
  };
  editor: Parameters<Parameters<typeof createReactBlockSpec>[1]["render"]>[0]["editor"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <KeyTrap className="py-1 w-full flex items-center gap-3">
      <TooltipProvider>
        <Tooltip
          open={open}
          onOpenChange={setOpen}
        >
          <TooltipTrigger asChild>
            <input
              type="date"
              disabled
              onPointerEnter={() => setOpen(true)}
              onPointerLeave={() => setOpen(false)}
              className="flex-1 max-w-sm h-10 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground focus-visible:outline-none cursor-default"
            />
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
        block={block as never}
        editor={editor}
      />
    ),
  },
);

// ---------------------------------------------------------------------------
// multipleChoiceTool
// ---------------------------------------------------------------------------

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
    render: ({ block, editor }) => {
      const options: OptionsEntry[] = (() => {
        try {
          return JSON.parse(block.props.optionsJson);
        } catch {
          return [{ optionValue: "", optionMarker: "a" }];
        }
      })();

      const updateOptions = (newOptions: OptionsEntry[]) => {
        editor.updateBlock(block, {
          props: { optionsJson: JSON.stringify(newOptions) },
        });
      };

      return (
        <KeyTrap className="py-1 w-full">
          <MultipleChoiceOption
            optionsProp={options}
            onInputChange={updateOptions}
            onAddNewOption={updateOptions}
            onLastOptionKeyDown={() => {}}
          />
          <div className="flex justify-end mt-1 max-w-sm">
            <RequiredToggle
              required={block.props.required}
              onChange={v => editor.updateBlock(block, { props: { required: v } })}
            />
          </div>
        </KeyTrap>
      );
    },
  },
);

// ---------------------------------------------------------------------------
// dropdownTool
// ---------------------------------------------------------------------------

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
    render: ({ block, editor }) => {
      const options: OptionsEntry[] = (() => {
        try {
          return JSON.parse(block.props.optionsJson);
        } catch {
          return [{ optionValue: "", optionMarker: "a" }];
        }
      })();

      const updateOptions = (newOptions: OptionsEntry[]) => {
        editor.updateBlock(block, {
          props: { optionsJson: JSON.stringify(newOptions) },
        });
      };

      return (
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
          />
          <div className="flex justify-end mt-1 max-w-sm">
            <RequiredToggle
              required={block.props.required}
              onChange={v => editor.updateBlock(block, { props: { required: v } })}
            />
          </div>
        </KeyTrap>
      );
    },
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
