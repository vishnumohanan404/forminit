import { describe, it, expect } from "vitest";
import {
  normalizeBlocks,
  toBlockNote,
  fromBlockNote,
  type OurBlock,
} from "@/components/form/blockNoteAdapter";
import type { FormDataInterface } from "@shared/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRaw(
  overrides: Partial<FormDataInterface["blocks"][0]>,
): FormDataInterface["blocks"][0] {
  return {
    _id: "test-id",
    type: "paragraph",
    data: { value: "" },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// normalizeBlocks
// ---------------------------------------------------------------------------

describe("normalizeBlocks", () => {
  it("passes clean blocks through unchanged", () => {
    const raw = [makeRaw({ _id: "a", type: "paragraph", data: { text: "Hello", value: "" } })];
    const result = normalizeBlocks(raw);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ _id: "a", type: "paragraph", data: { text: "Hello" } });
  });

  it("normalises old questionTitle data.title to data.text, keeps questionTitle type", () => {
    const raw = [makeRaw({ type: "questionTitle", data: { title: "My question", value: "" } })];
    const result = normalizeBlocks(raw);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("questionTitle");
    expect(result[0].data.text).toBe("My question");
  });

  it("splits monolithic input block with embedded title", () => {
    const raw = [
      makeRaw({
        _id: "inp1",
        type: "shortAnswerTool",
        data: { title: "What is your name?", placeholder: "Enter name", value: "" },
      }),
    ];
    const result = normalizeBlocks(raw);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("paragraph");
    expect(result[0].data.text).toBe("What is your name?");
    expect(result[1]._id).toBe("inp1");
    expect(result[1].type).toBe("shortAnswerTool");
    expect(result[1].data.placeholder).toBe("Enter name");
    expect(result[1].data).not.toHaveProperty("title");
  });

  it("does not split input block without title", () => {
    const raw = [
      makeRaw({
        _id: "inp2",
        type: "shortAnswerTool",
        data: { placeholder: "Enter name", value: "" },
      }),
    ];
    const result = normalizeBlocks(raw);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe("inp2");
  });
});

// ---------------------------------------------------------------------------
// Round-trip: all 9 block types
// ---------------------------------------------------------------------------

const fixtures: OurBlock[] = [
  { _id: "b1", type: "paragraph", data: { text: "Hello world" } },
  { _id: "b2", type: "heading", data: { text: "My heading" } },
  { _id: "b3", type: "shortAnswerTool", data: { placeholder: "Enter name", required: true } },
  {
    _id: "b4",
    type: "longAnswerTool",
    data: { placeholder: "Describe yourself", required: false },
  },
  { _id: "b5", type: "emailTool", data: { placeholder: "you@example.com", required: true } },
  { _id: "b6", type: "dateTool", data: { required: false } },
  {
    _id: "b7",
    type: "multipleChoiceTool",
    data: {
      required: true,
      options: [
        { optionValue: "Red", optionMarker: "a" },
        { optionValue: "Blue", optionMarker: "b" },
      ],
    },
  },
  {
    _id: "b8",
    type: "dropdownTool",
    data: {
      required: false,
      options: [{ optionValue: "Option 1", optionMarker: "a" }],
    },
  },
  { _id: "b9", type: "ratingTool", data: { required: true, maxRating: 7 } },
];

describe("toBlockNote → fromBlockNote round-trip", () => {
  it("preserves all 9 block types", () => {
    // We can't call fromBlockNote with toBlockNote output directly because
    // toBlockNote returns PartialBlock (missing some BlockNote internal fields).
    // Instead test each direction independently.
    const bnBlocks = toBlockNote(fixtures);
    expect(bnBlocks).toHaveLength(9);
    expect(bnBlocks[0].type).toBe("paragraph");
    expect(bnBlocks[1].type).toBe("heading");
    expect(bnBlocks[2].type).toBe("shortAnswerTool");
    expect(bnBlocks[8].type).toBe("ratingTool");
  });

  it("toBlockNote: paragraph preserves text", () => {
    const [bn] = toBlockNote([{ _id: "x", type: "paragraph", data: { text: "Hello" } }]);
    expect(bn.content).toEqual([{ type: "text", text: "Hello", styles: {} }]);
  });

  it("toBlockNote: heading preserves text", () => {
    const [bn] = toBlockNote([{ _id: "x", type: "heading", data: { text: "Title" } }]);
    expect(bn.content).toEqual([{ type: "text", text: "Title", styles: {} }]);
  });

  it("toBlockNote: shortAnswerTool maps placeholder + required to props", () => {
    const [bn] = toBlockNote([
      { _id: "x", type: "shortAnswerTool", data: { placeholder: "Enter", required: true } },
    ]);
    expect((bn as { props: { placeholder: string; required: boolean } }).props).toEqual({
      placeholder: "Enter",
      required: true,
    });
  });

  it("toBlockNote: multipleChoiceTool serializes options to optionsJson", () => {
    const options = [{ optionValue: "A", optionMarker: "a" }];
    const [bn] = toBlockNote([
      { _id: "x", type: "multipleChoiceTool", data: { required: false, options } },
    ]);
    expect((bn as { props: { optionsJson: string } }).props.optionsJson).toBe(
      JSON.stringify(options),
    );
  });

  it("toBlockNote: ratingTool maps maxRating", () => {
    const [bn] = toBlockNote([
      { _id: "x", type: "ratingTool", data: { required: false, maxRating: 7 } },
    ]);
    expect((bn as { props: { maxRating: number } }).props.maxRating).toBe(7);
  });

  it("toBlockNote: falls back to paragraph for unknown block type", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bn] = toBlockNote([{ _id: "x", type: "unknownType" as any, data: {} }]);
    expect(bn.type).toBe("paragraph");
  });
});

describe("fromBlockNote", () => {
  it("paragraph: extracts plain text from content", () => {
    const blocks = fromBlockNote([
      {
        id: "p1",
        type: "paragraph",
        content: [{ type: "text", text: "Hello", styles: {} }],
        props: { textColor: "default", backgroundColor: "default", textAlignment: "left" },
        children: [],
      },
    ]);
    expect(blocks[0]).toEqual({ _id: "p1", type: "paragraph", data: { text: "Hello" } });
  });

  it("multipleChoiceTool: deserializes optionsJson back to options array", () => {
    const options = [{ optionValue: "Red", optionMarker: "a" }];
    const blocks = fromBlockNote([
      {
        id: "m1",
        type: "multipleChoiceTool",
        content: undefined,
        props: { required: false, optionsJson: JSON.stringify(options) },
        children: [],
      },
    ]);
    expect(blocks[0].data.options).toEqual(options);
  });

  it("multipleChoiceTool: falls back on bad JSON", () => {
    const blocks = fromBlockNote([
      {
        id: "m1",
        type: "multipleChoiceTool",
        content: undefined,
        props: { required: false, optionsJson: "not-json" },
        children: [],
      },
    ]);
    expect(blocks[0].data.options).toEqual([{ optionValue: "", optionMarker: "a" }]);
  });

  it("unknown block type falls back to paragraph", () => {
    const blocks = fromBlockNote([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id: "u1", type: "unknownType" as any, content: undefined, props: {}, children: [] },
    ]);
    expect(blocks[0].type).toBe("paragraph");
  });
});
