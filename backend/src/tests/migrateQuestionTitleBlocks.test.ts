import { migrateBlocks } from "../scripts/migrateQuestionTitleBlocks";

describe("migrateBlocks", () => {
  it("converts questionTitle to paragraph", () => {
    const { blocks, conversions } = migrateBlocks([
      { _id: "id-1", type: "questionTitle", data: { title: "What is your name?" } },
    ]);

    expect(conversions).toBe(1);
    expect(blocks).toEqual([
      { _id: "id-1", type: "paragraph", data: { text: "What is your name?" } },
    ]);
  });

  it("splits monolithic shortAnswerTool (with title) into paragraph + input", () => {
    const { blocks, conversions } = migrateBlocks([
      {
        _id: "id-1",
        type: "shortAnswerTool",
        data: { title: "Your name", placeholder: "Enter name", required: true },
      },
    ]);

    expect(conversions).toBe(1);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toEqual({ type: "paragraph", data: { text: "Your name" } });
    expect(blocks[1]).toEqual({
      _id: "id-1",
      type: "shortAnswerTool",
      data: { placeholder: "Enter name", required: true },
    });
    // title must be stripped from the input block
    expect(blocks[1].data).not.toHaveProperty("title");
  });

  it("splits monolithic longAnswerTool (with title) into paragraph + input", () => {
    const { blocks, conversions } = migrateBlocks([
      {
        _id: "id-2",
        type: "longAnswerTool",
        data: { title: "Describe yourself", placeholder: "...", required: false },
      },
    ]);

    expect(conversions).toBe(1);
    expect(blocks[0]).toEqual({ type: "paragraph", data: { text: "Describe yourself" } });
    expect(blocks[1].data).not.toHaveProperty("title");
  });

  it("splits all monolithic input block types that carry a title", () => {
    const types = ["emailTool", "dateTool", "ratingTool", "multipleChoiceTool", "dropdownTool"];
    for (const type of types) {
      const { blocks, conversions } = migrateBlocks([
        { _id: "id-x", type, data: { title: "A question", required: false } },
      ]);
      expect(conversions).toBe(1);
      expect(blocks[0].type).toBe("paragraph");
      expect(blocks[1].type).toBe(type);
      expect(blocks[1].data).not.toHaveProperty("title");
    }
  });

  it("passes through input blocks that already have no title", () => {
    const input = [
      { _id: "id-1", type: "shortAnswerTool", data: { required: false, placeholder: "" } },
    ];
    const { blocks, conversions } = migrateBlocks(input);

    expect(conversions).toBe(0);
    expect(blocks).toEqual(input);
  });

  it("passes through paragraph and heading blocks unchanged", () => {
    const input = [
      { _id: "id-1", type: "paragraph", data: { text: "Hello" } },
      { _id: "id-2", type: "heading", data: { text: "Title" } },
    ];
    const { blocks, conversions } = migrateBlocks(input);

    expect(conversions).toBe(0);
    expect(blocks).toEqual(input);
  });

  it("handles a mixed form with multiple legacy and new blocks", () => {
    const { blocks, conversions } = migrateBlocks([
      { _id: "p1", type: "paragraph", data: { text: "Intro text" } },
      { _id: "qt", type: "questionTitle", data: { title: "Old Q1" } },
      { _id: "sa", type: "shortAnswerTool", data: { required: false, placeholder: "" } },
      {
        _id: "em",
        type: "emailTool",
        data: { title: "Email address", required: true },
      },
    ]);

    expect(conversions).toBe(2);
    expect(blocks).toHaveLength(5);
    expect(blocks[0]).toEqual({ _id: "p1", type: "paragraph", data: { text: "Intro text" } });
    expect(blocks[1]).toEqual({ _id: "qt", type: "paragraph", data: { text: "Old Q1" } });
    expect(blocks[2]).toEqual({
      _id: "sa",
      type: "shortAnswerTool",
      data: { required: false, placeholder: "" },
    });
    expect(blocks[3]).toEqual({ type: "paragraph", data: { text: "Email address" } });
    expect(blocks[4]).toEqual({ _id: "em", type: "emailTool", data: { required: true } });
  });

  it("handles empty blocks array", () => {
    const { blocks, conversions } = migrateBlocks([]);
    expect(blocks).toHaveLength(0);
    expect(conversions).toBe(0);
  });

  it("defaults missing title to empty string", () => {
    const { blocks } = migrateBlocks([{ _id: "id-1", type: "questionTitle", data: {} }]);
    expect(blocks[0].data.text).toBe("");
  });
});
