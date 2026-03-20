import { useEffect, useRef, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import BlockItem, { EditorBlock } from "./BlockItem";
import { BlockType, INPUT_BLOCK_TYPES } from "./BlockInsertMenu";
import { useFormContext } from "@/contexts/FormContext";
import { FormDataInterface } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Block factory
// ---------------------------------------------------------------------------

function newId() {
  return crypto.randomUUID();
}

function createSingleBlock(type: BlockType): EditorBlock {
  switch (type) {
    case "paragraph":
      return { _id: newId(), type, data: { text: "" } };
    case "heading":
      return { _id: newId(), type, data: { text: "" } };
    case "shortAnswerTool":
      return { _id: newId(), type, data: { required: false, placeholder: "" } };
    case "longAnswerTool":
      return { _id: newId(), type, data: { required: false, placeholder: "" } };
    case "multipleChoiceTool":
      return {
        _id: newId(),
        type,
        data: { required: false, options: [{ optionValue: "", optionMarker: "a" }] },
      };
    case "dropdownTool":
      return {
        _id: newId(),
        type,
        data: { required: false, options: [{ optionValue: "", optionMarker: "a" }] },
      };
    case "emailTool":
      return { _id: newId(), type, data: { required: false } };
    case "dateTool":
      return { _id: newId(), type, data: { required: false } };
    case "ratingTool":
      return { _id: newId(), type, data: { required: false, maxRating: 5 } };
  }
}

/**
 * For question types, inserting via "/" creates a paragraph (title) + the input block.
 * For content types (paragraph, heading), just creates that one block.
 */
function createBlocksForType(type: BlockType): EditorBlock[] {
  if (INPUT_BLOCK_TYPES.includes(type)) {
    return [createSingleBlock("paragraph"), createSingleBlock(type)];
  }
  return [createSingleBlock(type)];
}

// ---------------------------------------------------------------------------
// Legacy block normalisation (lazy in-memory migration — no DB writes)
// ---------------------------------------------------------------------------

function normalizeBlocks(rawBlocks: FormDataInterface["blocks"]): EditorBlock[] {
  const result: EditorBlock[] = [];

  for (const block of rawBlocks) {
    // Old questionTitle → paragraph
    if (block.type === "questionTitle") {
      result.push({
        _id: block._id || newId(),
        type: "paragraph",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { text: (block.data as any).title || "" },
      });
      continue;
    }

    // Monolithic input blocks that still carry a title field — split them
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = block.data as any;
    if (INPUT_BLOCK_TYPES.includes(block.type as BlockType) && d?.title) {
      result.push({ _id: newId(), type: "paragraph", data: { text: d.title } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { title: _title, ...rest } = d;
      result.push({
        _id: block._id || newId(),
        type: block.type as BlockType,
        data: rest,
      });
      continue;
    }

    result.push({
      _id: block._id || newId(),
      type: block.type as BlockType,
      data: block.data as Record<string, unknown>,
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// BlockEditor
// ---------------------------------------------------------------------------

interface BlockEditorProps {
  initialData: FormDataInterface | undefined;
  formId?: string;
}

const BlockEditor = ({ initialData, formId }: BlockEditorProps) => {
  const { dispatch } = useFormContext();

  // Registry: block _id → focus(at) function — used for arrow-key navigation
  const focusFns = useRef<Map<string, (at: "start" | "end") => void>>(new Map());
  // Mirror of blocks state without stale-closure issues
  const blocksRef = useRef<EditorBlock[]>([]);

  const registerFocusFn = useCallback((id: string, fn: (at: "start" | "end") => void) => {
    focusFns.current.set(id, fn);
  }, []);
  const unregisterFocusFn = useCallback((id: string) => {
    focusFns.current.delete(id);
  }, []);

  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    if (initialData?.blocks?.length) return normalizeBlocks(initialData.blocks);
    return [createSingleBlock("paragraph")];
  });

  // Keep blocksRef in sync for use inside callbacks without stale closures
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // Which block has the slash menu open
  const [slashBlockId, setSlashBlockId] = useState<string | null>(null);
  // Which block should auto-focus (set after inserting a new block)
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);

  const syncToContext = useCallback(
    (newBlocks: EditorBlock[]) => {
      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          title: initialData?.title || "",
          workspaceId: initialData?.workspaceId || "",
          blocks: newBlocks as FormDataInterface["blocks"],
        },
      });
    },
    [dispatch, initialData?.title, initialData?.workspaceId],
  );

  // Re-initialise when a different form loads
  useEffect(() => {
    if (initialData?.blocks?.length) {
      const normalized = normalizeBlocks(initialData.blocks);
      setBlocks(normalized);
      syncToContext(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const updateBlocks = useCallback(
    (updater: (prev: EditorBlock[]) => EditorBlock[]) => {
      setBlocks(prev => {
        const next = updater(prev);
        syncToContext(next);
        return next;
      });
    },
    [syncToContext],
  );

  // -------------------------------------------------------------------------
  // Block callbacks
  // -------------------------------------------------------------------------

  const handleChange = useCallback(
    (id: string, data: Record<string, unknown>) => {
      updateBlocks(prev => prev.map(b => (b._id === id ? { ...b, data } : b)));
    },
    [updateBlocks],
  );

  const handleDelete = useCallback(
    (id: string) => {
      updateBlocks(prev => {
        const next = prev.filter(b => b._id !== id);
        return next.length ? next : [createSingleBlock("paragraph")];
      });
    },
    [updateBlocks],
  );

  /** Enter on a content block → insert empty paragraph after it */
  const handleEnterKey = useCallback(
    (id: string) => {
      const newBlock = createSingleBlock("paragraph");
      updateBlocks(prev => {
        const idx = prev.findIndex(b => b._id === id);
        const next = [...prev];
        next.splice(idx + 1, 0, newBlock);
        return next;
      });
      setFocusBlockId(newBlock._id);
    },
    [updateBlocks],
  );

  const handleBackspaceEmpty = useCallback(
    (id: string) => {
      updateBlocks(prev => {
        const idx = prev.findIndex(b => b._id === id);
        const next = prev.filter(b => b._id !== id);
        const focusIdx = Math.max(0, idx - 1);
        if (next[focusIdx]) {
          // Block already exists — focus it directly after this render
          const targetId = next[focusIdx]._id;
          setTimeout(() => focusFns.current.get(targetId)?.("end"), 0);
        }
        return next.length ? next : [createSingleBlock("paragraph")];
      });
    },
    [updateBlocks],
  );

  const handleArrowDown = useCallback((id: string) => {
    const b = blocksRef.current;
    const idx = b.findIndex(x => x._id === id);
    if (idx < b.length - 1) focusFns.current.get(b[idx + 1]._id)?.("start");
  }, []);

  const handleArrowUp = useCallback((id: string) => {
    const b = blocksRef.current;
    const idx = b.findIndex(x => x._id === id);
    if (idx > 0) focusFns.current.get(b[idx - 1]._id)?.("end");
  }, []);

  const handleSlashKey = useCallback((id: string) => {
    setSlashBlockId(id);
  }, []);

  const handleSlashMenuSelect = useCallback(
    (triggerId: string, type: BlockType) => {
      setSlashBlockId(null);
      const newBlocks = createBlocksForType(type);
      updateBlocks(prev => {
        const idx = prev.findIndex(b => b._id === triggerId);
        const next = [...prev];
        next.splice(idx + 1, 0, ...newBlocks);
        return next;
      });
      // Focus the first inserted block (the paragraph title for question types)
      setFocusBlockId(newBlocks[0]._id);
    },
    [updateBlocks],
  );

  // Clear focusBlockId after it has been consumed by the target block
  const clearFocus = useCallback((id: string) => {
    setFocusBlockId(prev => (prev === id ? null : prev));
  }, []);

  // -------------------------------------------------------------------------
  // DnD
  // -------------------------------------------------------------------------

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      updateBlocks(prev => {
        const oldIdx = prev.findIndex(b => b._id === active.id);
        const newIdx = prev.findIndex(b => b._id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b._id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map(block => (
            <BlockItem
              key={block._id}
              block={block}
              isOnly={blocks.length === 1}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={focusBlockId === block._id}
              slashMenuOpen={slashBlockId === block._id}
              registerFocusFn={registerFocusFn}
              unregisterFocusFn={unregisterFocusFn}
              onChange={handleChange}
              onDelete={handleDelete}
              onEnterKey={handleEnterKey}
              onBackspaceEmpty={handleBackspaceEmpty}
              onSlashKey={handleSlashKey}
              onArrowDown={handleArrowDown}
              onArrowUp={handleArrowUp}
              onSlashMenuSelect={handleSlashMenuSelect}
              onSlashMenuClose={() => setSlashBlockId(null)}
              onFocusConsumed={clearFocus}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Submit preview — matches the published form button */}
      <div className="mt-6 pl-7">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className="text-muted-foreground"
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

export default BlockEditor;
