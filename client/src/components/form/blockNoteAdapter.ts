import type { Block, PartialBlock } from "@blocknote/core";
import type { FormNoteSchema } from "./blockNoteSchema";
import type { FormDataInterface } from "@shared/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BlockType =
  | "paragraph"
  | "heading"
  | "questionTitle"
  | "shortAnswerTool"
  | "longAnswerTool"
  | "multipleChoiceTool"
  | "dropdownTool"
  | "emailTool"
  | "dateTool"
  | "ratingTool";

export const INPUT_BLOCK_TYPES: BlockType[] = [
  "shortAnswerTool",
  "longAnswerTool",
  "multipleChoiceTool",
  "dropdownTool",
  "emailTool",
  "dateTool",
  "ratingTool",
];

export type OurBlock = {
  _id: string;
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export type OptionsEntry = { optionValue: string; optionMarker: string };

// ---------------------------------------------------------------------------
// Legacy migration (lazy in-memory — no DB writes)
// ---------------------------------------------------------------------------

export function normalizeBlocks(rawBlocks: FormDataInterface["blocks"]): OurBlock[] {
  const result: OurBlock[] = [];

  for (const block of rawBlocks) {
    // Old questionTitle → paragraph (BlockNote migration)
    if (block.type === "questionTitle") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = block.data as any;
      result.push({
        _id: block._id || crypto.randomUUID(),
        type: "paragraph",
        data: { text: d.title ?? d.text ?? "" },
      });
      continue;
    }

    // Monolithic input blocks that still carry a title field — split them
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = block.data as any;
    if (INPUT_BLOCK_TYPES.includes(block.type as BlockType) && d?.title) {
      result.push({ _id: crypto.randomUUID(), type: "paragraph", data: { text: d.title } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { title: _title, ...rest } = d;
      result.push({
        _id: block._id || crypto.randomUUID(),
        type: block.type as BlockType,
        data: rest,
      });
      continue;
    }

    result.push({
      _id: block._id || crypto.randomUUID(),
      type: block.type as BlockType,
      data: block.data as Record<string, unknown>,
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPlainText(content: Block<FormNoteSchema>["content"]): string {
  if (!content || !Array.isArray(content)) return "";
  return content
    .filter((node): node is { type: "text"; text: string; styles: object } => node.type === "text")
    .map(node => node.text)
    .join("");
}

function safeParseOptions(json: string): OptionsEntry[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through
  }
  return [{ optionValue: "", optionMarker: "a" }];
}

// ---------------------------------------------------------------------------
// toBlockNote — OurBlock[] → PartialBlock[]
// ---------------------------------------------------------------------------

export function toBlockNote(blocks: OurBlock[]): PartialBlock<FormNoteSchema>[] {
  return blocks.map(block => {
    switch (block.type) {
      case "paragraph":
        return {
          id: block._id,
          type: "paragraph" as const,
          content: [{ type: "text" as const, text: block.data.text ?? "", styles: {} }],
        };

      case "heading":
        return {
          id: block._id,
          type: "heading" as const,
          content: [{ type: "text" as const, text: block.data.text ?? "", styles: {} }],
          props: { level: 2 as const },
        };

      case "questionTitle":
        return {
          id: block._id,
          type: "questionTitle" as const,
          content: [{ type: "text" as const, text: block.data.text ?? "", styles: {} }],
        };

      case "shortAnswerTool":
        return {
          id: block._id,
          type: "shortAnswerTool" as const,
          props: {
            placeholder: block.data.placeholder ?? "",
            required: block.data.required ?? false,
          },
        };

      case "longAnswerTool":
        return {
          id: block._id,
          type: "longAnswerTool" as const,
          props: {
            placeholder: block.data.placeholder ?? "",
            required: block.data.required ?? false,
          },
        };

      case "emailTool":
        return {
          id: block._id,
          type: "emailTool" as const,
          props: {
            placeholder: block.data.placeholder ?? "name@example.com",
            required: block.data.required ?? false,
          },
        };

      case "dateTool":
        return {
          id: block._id,
          type: "dateTool" as const,
          props: {
            required: block.data.required ?? false,
          },
        };

      case "multipleChoiceTool":
        return {
          id: block._id,
          type: "multipleChoiceTool" as const,
          props: {
            required: block.data.required ?? false,
            optionsJson: JSON.stringify(
              block.data.options ?? [{ optionValue: "", optionMarker: "a" }],
            ),
          },
        };

      case "dropdownTool":
        return {
          id: block._id,
          type: "dropdownTool" as const,
          props: {
            required: block.data.required ?? false,
            optionsJson: JSON.stringify(
              block.data.options ?? [{ optionValue: "", optionMarker: "a" }],
            ),
          },
        };

      case "ratingTool":
        return {
          id: block._id,
          type: "ratingTool" as const,
          props: {
            required: block.data.required ?? false,
            maxRating: block.data.maxRating ?? 5,
          },
        };

      default:
        // Forward-compat: unknown block type passes through as paragraph
        return {
          id: block._id,
          type: "paragraph" as const,
          content: [{ type: "text" as const, text: "", styles: {} }],
        };
    }
  });
}

// ---------------------------------------------------------------------------
// fromBlockNote — Block[] → OurBlock[]
// ---------------------------------------------------------------------------

export function fromBlockNote(blocks: Block<FormNoteSchema>[]): OurBlock[] {
  return blocks.map(block => {
    switch (block.type) {
      case "paragraph":
        return {
          _id: block.id,
          type: "paragraph",
          data: { text: getPlainText(block.content) },
        };

      case "heading":
        return {
          _id: block.id,
          type: "heading",
          data: { text: getPlainText(block.content) },
        };

      case "questionTitle":
        return {
          _id: block.id,
          type: "questionTitle",
          data: { text: getPlainText(block.content) },
        };

      case "shortAnswerTool":
        return {
          _id: block.id,
          type: "shortAnswerTool",
          data: {
            placeholder: block.props.placeholder,
            required: block.props.required,
          },
        };

      case "longAnswerTool":
        return {
          _id: block.id,
          type: "longAnswerTool",
          data: {
            placeholder: block.props.placeholder,
            required: block.props.required,
          },
        };

      case "emailTool":
        return {
          _id: block.id,
          type: "emailTool",
          data: {
            placeholder: block.props.placeholder,
            required: block.props.required,
          },
        };

      case "dateTool":
        return {
          _id: block.id,
          type: "dateTool",
          data: { required: block.props.required },
        };

      case "multipleChoiceTool":
        return {
          _id: block.id,
          type: "multipleChoiceTool",
          data: {
            required: block.props.required,
            options: safeParseOptions(block.props.optionsJson),
          },
        };

      case "dropdownTool":
        return {
          _id: block.id,
          type: "dropdownTool",
          data: {
            required: block.props.required,
            options: safeParseOptions(block.props.optionsJson),
          },
        };

      case "ratingTool":
        return {
          _id: block.id,
          type: "ratingTool",
          data: {
            required: block.props.required,
            maxRating: block.props.maxRating,
          },
        };

      default:
        return {
          _id: block.id,
          type: "paragraph",
          data: { text: "" },
        };
    }
  });
}
