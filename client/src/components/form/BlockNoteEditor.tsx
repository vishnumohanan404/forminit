import { useCallback, useEffect, useState } from "react";
import { useCreateBlockNote, SuggestionMenuController } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "@/contexts/ThemeProvider";
import { GapCursor } from "prosemirror-gapcursor";
import { NodeSelection } from "prosemirror-state";
import "@blocknote/mantine/style.css";
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
  TagIcon,
} from "lucide-react";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
import type { BlockNoteEditor } from "@blocknote/core";
import { formNoteSchema, type FormNoteSchema } from "./blockNoteSchema";
import {
  normalizeBlocks,
  toBlockNote,
  fromBlockNote,
  INPUT_BLOCK_TYPES,
  type BlockType,
} from "./blockNoteAdapter";
import { useFormContext } from "@/contexts/FormContext";
import { FormDataInterface } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Slash menu items
// ---------------------------------------------------------------------------

function getFormSlashMenuItems(
  editor: BlockNoteEditor<FormNoteSchema>,
): DefaultReactSuggestionItem[] {
  const insertBlock = (type: BlockType) => {
    const currentBlock = editor.getTextCursorPosition().block;
    const isTextBlock = currentBlock.type === "paragraph" || currentBlock.type === "questionTitle";
    const isEmpty =
      isTextBlock &&
      (currentBlock.content.length === 0 ||
        (currentBlock.content.length === 1 &&
          currentBlock.content[0].type === "text" &&
          (currentBlock.content[0] as { type: "text"; text: string }).text === ""));

    if (INPUT_BLOCK_TYPES.includes(type)) {
      // Tally-style pairing: [questionTitle label, inputBlock]
      const qtId = crypto.randomUUID();
      const pair = [
        {
          id: qtId,
          type: "questionTitle" as const,
          content: [{ type: "text" as const, text: "", styles: {} }],
        },
        { type, props: {} },
      ] as const;
      if (isEmpty) {
        editor.replaceBlocks([currentBlock], pair);
      } else {
        editor.insertBlocks(pair, currentBlock, "after");
      }
      // Move cursor to the question title so the user can type the label immediately
      editor.setTextCursorPosition(qtId, "start");
    } else {
      const block = { type, content: [{ type: "text" as const, text: "", styles: {} }] };
      if (isEmpty) {
        editor.replaceBlocks([currentBlock], [block]);
      } else {
        editor.insertBlocks([block], currentBlock, "after");
      }
    }
  };

  return [
    // --- Content ---
    {
      title: "Paragraph",
      subtext: "Plain text",
      group: "Content",
      icon: <TextIcon size={16} />,
      aliases: ["text", "p"],
      onItemClick: () => insertBlock("paragraph"),
    },
    {
      title: "Heading",
      subtext: "Section title",
      group: "Content",
      icon: <Heading2Icon size={16} />,
      aliases: ["h2", "title"],
      onItemClick: () => insertBlock("heading"),
    },
    {
      title: "Question Title",
      subtext: "Label for a question block",
      group: "Content",
      icon: <TagIcon size={16} />,
      aliases: ["label", "question", "qt"],
      onItemClick: () => insertBlock("questionTitle"),
    },
    // --- Questions ---
    {
      title: "Short Answer",
      subtext: "Single line text input",
      group: "Questions",
      icon: <TypeIcon size={16} />,
      aliases: ["short", "input", "text"],
      onItemClick: () => insertBlock("shortAnswerTool"),
    },
    {
      title: "Long Answer",
      subtext: "Multi-line text input",
      group: "Questions",
      icon: <AlignLeftIcon size={16} />,
      aliases: ["long", "textarea"],
      onItemClick: () => insertBlock("longAnswerTool"),
    },
    // --- Questions (feature-flagged) ---
    ...(import.meta.env.VITE_ENABLE_ALL_BLOCKS === "true"
      ? [
          {
            title: "Multiple Choice",
            subtext: "Choose one option",
            group: "Questions",
            icon: <ListIcon size={16} />,
            aliases: ["mcq", "choice", "radio"],
            onItemClick: () => insertBlock("multipleChoiceTool"),
          },
          {
            title: "Dropdown",
            subtext: "Select from a list",
            group: "Questions",
            icon: <ChevronDownIcon size={16} />,
            aliases: ["select", "dropdown"],
            onItemClick: () => insertBlock("dropdownTool"),
          },
          {
            title: "Email",
            subtext: "Email address input",
            group: "Questions",
            icon: <MailIcon size={16} />,
            aliases: ["email", "mail"],
            onItemClick: () => insertBlock("emailTool"),
          },
          {
            title: "Date",
            subtext: "Date picker",
            group: "Questions",
            icon: <CalendarIcon size={16} />,
            aliases: ["date", "calendar"],
            onItemClick: () => insertBlock("dateTool"),
          },
          {
            title: "Rating",
            subtext: "Star rating scale",
            group: "Questions",
            icon: <StarIcon size={16} />,
            aliases: ["star", "rating", "scale"],
            onItemClick: () => insertBlock("ratingTool"),
          },
        ]
      : []),
  ];
}

interface BlockNoteEditorProps {
  initialData: FormDataInterface | undefined;
  formId?: string;
}

const BlockNoteEditor = ({ initialData, formId }: BlockNoteEditorProps) => {
  const { dispatch } = useFormContext();
  const { theme } = useTheme();
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const editor = useCreateBlockNote({
    schema: formNoteSchema,
    trailingBlock: false,
    initialContent: initialData?.blocks?.length
      ? toBlockNote(normalizeBlocks(initialData.blocks))
      : [
          {
            type: "paragraph" as const,
            content: [{ type: "text" as const, text: "", styles: {} }],
          },
        ],
  });

  // Re-initialise when a different form loads
  useEffect(() => {
    if (initialData?.blocks?.length) {
      const normalized = normalizeBlocks(initialData.blocks);
      const bnBlocks = toBlockNote(normalized);
      editor.replaceBlocks(editor.document, bnBlocks);
      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          title: initialData.title ?? "",
          workspaceId: initialData.workspaceId ?? "",
          blocks: normalized as FormDataInterface["blocks"],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const handleChange = useCallback(() => {
    const ourBlocks = fromBlockNote(editor.document);
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        title: initialData?.title ?? "",
        workspaceId: initialData?.workspaceId ?? "",
        blocks: ourBlocks as FormDataInterface["blocks"],
      },
    });
  }, [editor, dispatch, initialData?.title, initialData?.workspaceId]);

  // Skip gapcursor gaps and auto-focus native inputs on arrow key navigation
  useEffect(() => {
    const tiptap = editor._tiptapEditor;

    const INPUT_TYPES = new Set([
      "shortAnswerTool",
      "longAnswerTool",
      "emailTool",
      "dateTool",
      "multipleChoiceTool",
      "dropdownTool",
      "ratingTool",
    ]);

    const focusInputInSelectedNode = () => {
      const selected = document.querySelector<HTMLElement>(
        ".bn-block-content.ProseMirror-selectednode",
      );
      if (!selected) return;
      const input = selected.querySelector<HTMLElement>("input:not([type='checkbox']), textarea");
      if (input && document.activeElement !== input) input.focus();
    };

    // When a GapCursor lands adjacent to a custom input block, skip to NodeSelection
    const handleSelectionUpdate = () => {
      const { state, view } = tiptap;
      if (!(state.selection instanceof GapCursor)) return;

      const $pos = state.selection.$anchor;
      // Check node after the gap position
      const nodeAfter = $pos.nodeAfter;
      if (nodeAfter && INPUT_TYPES.has(nodeAfter.type.name)) {
        const pos = $pos.pos;
        const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos));
        view.dispatch(tr);
        setTimeout(focusInputInSelectedNode, 0);
        return;
      }
      // Check node before the gap position
      const nodeBefore = $pos.nodeBefore;
      if (nodeBefore && INPUT_TYPES.has(nodeBefore.type.name)) {
        const pos = $pos.pos - nodeBefore.nodeSize;
        const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos));
        view.dispatch(tr);
        setTimeout(focusInputInSelectedNode, 0);
      }
    };

    // When a NodeSelection lands on a custom input block, focus its native input
    const handleNodeSelection = () => {
      const { state } = tiptap;
      if (!(state.selection instanceof NodeSelection)) return;
      if (INPUT_TYPES.has(state.selection.node.type.name)) {
        setTimeout(focusInputInSelectedNode, 0);
      }
    };

    tiptap.on("selectionUpdate", handleSelectionUpdate);
    tiptap.on("selectionUpdate", handleNodeSelection);
    return () => {
      tiptap.off("selectionUpdate", handleSelectionUpdate);
      tiptap.off("selectionUpdate", handleNodeSelection);
    };
  }, [editor]);

  const [submitTooltipOpen, setSubmitTooltipOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme={resolvedTheme}
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async query => {
            const items = getFormSlashMenuItems(editor);
            if (!query) return items;
            return items.filter(
              item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.aliases?.some(a => a.includes(query.toLowerCase())),
            );
          }}
        />
      </BlockNoteView>

      {/* Submit preview — matches the published form button */}
      <div className="mt-6">
        <TooltipProvider>
          <Tooltip
            open={submitTooltipOpen}
            onOpenChange={setSubmitTooltipOpen}
          >
            <TooltipTrigger asChild>
              <Button
                type="button"
                onPointerEnter={() => setSubmitTooltipOpen(true)}
                onPointerLeave={() => setSubmitTooltipOpen(false)}
                onClick={() => setSubmitTooltipOpen(v => !v)}
              >
                Submit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Submit button will be available in the published form</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default BlockNoteEditor;
