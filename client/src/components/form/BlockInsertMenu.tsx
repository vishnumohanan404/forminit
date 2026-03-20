import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { useEffect, useRef } from "react";
import {
  AlignLeftIcon,
  CalendarIcon,
  ChevronDownIcon,
  ListIcon,
  MailIcon,
  StarIcon,
  TextIcon,
  TypeIcon,
  Heading2Icon,
} from "lucide-react";

export type BlockType =
  | "paragraph"
  | "heading"
  | "shortAnswerTool"
  | "longAnswerTool"
  | "multipleChoiceTool"
  | "dropdownTool"
  | "emailTool"
  | "dateTool"
  | "ratingTool";

export const CONTENT_BLOCK_TYPES: BlockType[] = ["paragraph", "heading"];
export const INPUT_BLOCK_TYPES: BlockType[] = [
  "shortAnswerTool",
  "longAnswerTool",
  "multipleChoiceTool",
  "dropdownTool",
  "emailTool",
  "dateTool",
  "ratingTool",
];

const BLOCK_MENU_OPTIONS: Array<{
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  group: "content" | "questions";
}> = [
  {
    type: "paragraph",
    label: "Text",
    icon: <TextIcon className="w-4 h-4" />,
    group: "content",
  },
  {
    type: "heading",
    label: "Heading",
    icon: <Heading2Icon className="w-4 h-4" />,
    group: "content",
  },
  {
    type: "shortAnswerTool",
    label: "Short Answer",
    icon: <TypeIcon className="w-4 h-4" />,
    group: "questions",
  },
  {
    type: "longAnswerTool",
    label: "Long Answer",
    icon: <AlignLeftIcon className="w-4 h-4" />,
    group: "questions",
  },
  {
    type: "multipleChoiceTool",
    label: "Multiple Choice",
    icon: <ListIcon className="w-4 h-4" />,
    group: "questions",
  },
  {
    type: "dropdownTool",
    label: "Dropdown",
    icon: <ChevronDownIcon className="w-4 h-4" />,
    group: "questions",
  },
  {
    type: "emailTool",
    label: "Email",
    icon: <MailIcon className="w-4 h-4" />,
    group: "questions",
  },
  {
    type: "dateTool",
    label: "Date",
    icon: <CalendarIcon className="w-4 h-4" />,
    group: "questions",
  },
  {
    type: "ratingTool",
    label: "Rating",
    icon: <StarIcon className="w-4 h-4" />,
    group: "questions",
  },
];

interface BlockInsertMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

const BlockInsertMenu = ({ open, onClose, onSelect }: BlockInsertMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = BLOCK_MENU_OPTIONS.filter(o => o.group === "content");
  const questions = BLOCK_MENU_OPTIONS.filter(o => o.group === "questions");

  return (
    <div
      ref={containerRef}
      className="absolute z-50 mt-1 w-56 rounded-md border border-border bg-popover shadow-md"
    >
      <Command className="rounded-md">
        <CommandInput
          placeholder="Search..."
          className="border-none h-9 px-3 text-sm focus:outline-none bg-transparent"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <CommandList className="max-h-56 overflow-y-auto py-1">
          <CommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
            No results.
          </CommandEmpty>
          <CommandGroup heading="Content">
            {content.map(({ type, label, icon }) => (
              <CommandItem
                key={type}
                value={label}
                onSelect={() => {
                  onSelect(type);
                  onClose();
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
              >
                {icon}
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Questions">
            {questions.map(({ type, label, icon }) => (
              <CommandItem
                key={type}
                value={label}
                onSelect={() => {
                  onSelect(type);
                  onClose();
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
              >
                {icon}
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default BlockInsertMenu;
