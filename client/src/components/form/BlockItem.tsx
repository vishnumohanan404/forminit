import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlockInsertMenu, { BlockType, INPUT_BLOCK_TYPES } from "./BlockInsertMenu";
import ParagraphBlock from "./blocks/ParagraphBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import ShortAnswerBlock from "./blocks/ShortAnswerBlock";
import LongAnswerBlock from "./blocks/LongAnswerBlock";
import MultipleChoiceBlock from "./blocks/MultipleChoiceBlock";
import DropdownBlock from "./blocks/DropdownBlock";
import EmailBlock from "./blocks/EmailBlock";
import DateBlock from "./blocks/DateBlock";
import RatingBlock from "./blocks/RatingBlock";

export interface EditorBlock {
  _id: string;
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

interface BlockItemProps {
  block: EditorBlock;
  isOnly: boolean;
  autoFocus?: boolean;
  slashMenuOpen: boolean;
  registerFocusFn: (id: string, fn: (at: "start" | "end") => void) => void;
  unregisterFocusFn: (id: string) => void;
  onChange: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onEnterKey: (id: string) => void;
  onBackspaceEmpty: (id: string) => void;
  onSlashKey: (id: string) => void;
  onArrowDown: (id: string) => void;
  onArrowUp: (id: string) => void;
  onSlashMenuSelect: (id: string, type: BlockType) => void;
  onSlashMenuClose: (id: string) => void;
  onFocusConsumed?: (id: string) => void;
}

const BlockItem = ({
  block,
  isOnly,
  autoFocus,
  slashMenuOpen,
  registerFocusFn,
  unregisterFocusFn,
  onChange,
  onDelete,
  onEnterKey,
  onBackspaceEmpty,
  onSlashKey,
  onArrowDown,
  onArrowUp,
  onSlashMenuSelect,
  onSlashMenuClose,
  onFocusConsumed,
}: BlockItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block._id,
  });
  const [isHovered, setIsHovered] = useState(false);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Register focus function for input blocks (wrapper div receives focus)
  useEffect(() => {
    if (!INPUT_BLOCK_TYPES.includes(block.type)) return;
    registerFocusFn(block._id, () => {
      inputWrapperRef.current?.focus();
    });
    return () => unregisterFocusFn(block._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block._id, block.type]);

  // Signal that focus has been consumed so BlockEditor clears focusBlockId
  useEffect(() => {
    if (autoFocus && onFocusConsumed) onFocusConsumed(block._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  const isInputBlock = INPUT_BLOCK_TYPES.includes(block.type);

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  const inputWrapper = (children: React.ReactNode) => (
    <div
      ref={inputWrapperRef}
      role="region"
      aria-label="Form field preview"
      tabIndex={0}
      className="outline-none rounded focus-visible:ring-1 focus-visible:ring-ring/40"
      onKeyDown={e => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          onArrowDown(block._id);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          onArrowUp(block._id);
        }
      }}
    >
      {children}
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */

  const renderBlock = () => {
    switch (block.type) {
      case "paragraph":
        return (
          <ParagraphBlock
            blockId={block._id}
            data={block.data as Parameters<typeof ParagraphBlock>[0]["data"]}
            onChange={data => onChange(block._id, data)}
            onEnterKey={() => onEnterKey(block._id)}
            onBackspaceEmpty={() => !isOnly && onBackspaceEmpty(block._id)}
            onSlashKey={() => onSlashKey(block._id)}
            onArrowDown={() => onArrowDown(block._id)}
            onArrowUp={() => onArrowUp(block._id)}
            registerFocusFn={registerFocusFn}
            unregisterFocusFn={unregisterFocusFn}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
          />
        );
      case "heading":
        return (
          <HeadingBlock
            blockId={block._id}
            data={block.data as Parameters<typeof HeadingBlock>[0]["data"]}
            onChange={data => onChange(block._id, data)}
            onEnterKey={() => onEnterKey(block._id)}
            onBackspaceEmpty={() => !isOnly && onBackspaceEmpty(block._id)}
            onSlashKey={() => onSlashKey(block._id)}
            onArrowDown={() => onArrowDown(block._id)}
            onArrowUp={() => onArrowUp(block._id)}
            registerFocusFn={registerFocusFn}
            unregisterFocusFn={unregisterFocusFn}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
          />
        );
      case "shortAnswerTool":
        return (
          <ShortAnswerBlock data={block.data as Parameters<typeof ShortAnswerBlock>[0]["data"]} />
        );
      case "longAnswerTool":
        return (
          <LongAnswerBlock data={block.data as Parameters<typeof LongAnswerBlock>[0]["data"]} />
        );
      case "multipleChoiceTool":
        return (
          <MultipleChoiceBlock
            data={block.data as Parameters<typeof MultipleChoiceBlock>[0]["data"]}
            onChange={data => onChange(block._id, { ...block.data, ...data })}
          />
        );
      case "dropdownTool":
        return (
          <DropdownBlock
            data={block.data as Parameters<typeof DropdownBlock>[0]["data"]}
            onChange={data => onChange(block._id, { ...block.data, ...data })}
          />
        );
      case "emailTool":
        return <EmailBlock />;
      case "dateTool":
        return <DateBlock />;
      case "ratingTool":
        return <RatingBlock data={block.data as Parameters<typeof RatingBlock>[0]["data"]} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-1">
        {/* Drag handle + delete — visible on hover */}
        <div
          className={`flex flex-col items-center gap-0.5 pt-1.5 transition-opacity shrink-0 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(block._id)}
            tabIndex={-1}
          >
            <Trash2Icon className="w-3 h-3" />
          </Button>
        </div>

        {/* Block content */}
        <div className="flex-1 relative min-w-0">
          {isInputBlock ? inputWrapper(renderBlock()) : renderBlock()}
          <BlockInsertMenu
            open={slashMenuOpen}
            onClose={() => onSlashMenuClose(block._id)}
            onSelect={type => onSlashMenuSelect(block._id, type)}
          />
        </div>
      </div>
    </div>
  );
};

export default BlockItem;
