/* eslint-disable no-console */
/**
 * Sprint 8b — One-time migration: convert all legacy block formats to the new
 * separate-block architecture (paragraph + input blocks, no embedded titles).
 *
 * Transformations applied to Form and Submission documents:
 *
 *   1. questionTitle { title }  →  paragraph { text }
 *      (orphaned questionTitle blocks with no following input block are converted to paragraphs)
 *
 *   2. Monolithic input block with embedded title field (e.g. shortAnswerTool { title, ... })
 *      →  paragraph { text: title }  +  input block (title field removed from data)
 *      Applies to: shortAnswerTool, longAnswerTool, emailTool, dateTool, ratingTool,
 *                  multipleChoiceTool, dropdownTool
 *
 * Usage:
 *   Dry run (no writes):  npx ts-node src/scripts/migrateQuestionTitleBlocks.ts
 *   Apply changes:        npx ts-node src/scripts/migrateQuestionTitleBlocks.ts --execute
 *
 * Requires MONGODB_URI or MONGO_URI in backend/.env (or the environment).
 */

import "dotenv/config";
import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RawBlock {
  _id?: string;
  type: string;
  data: Record<string, unknown>;
}

interface FormDoc {
  _id: mongoose.Types.ObjectId;
  blocks: RawBlock[];
}

interface SubmissionDoc {
  _id: mongoose.Types.ObjectId;
  formId: string;
  blocks: RawBlock[];
}

// ---------------------------------------------------------------------------
// Core migration logic (pure — easy to unit-test)
// ---------------------------------------------------------------------------

const INPUT_TYPES = new Set([
  "shortAnswerTool",
  "longAnswerTool",
  "emailTool",
  "dateTool",
  "ratingTool",
  "multipleChoiceTool",
  "dropdownTool",
]);

export interface MigrateResult {
  blocks: RawBlock[];
  conversions: number;
}

export function migrateBlocks(blocks: RawBlock[]): MigrateResult {
  const result: RawBlock[] = [];
  let conversions = 0;

  for (const block of blocks) {
    // 1. Legacy questionTitle → paragraph
    if (block.type === "questionTitle") {
      result.push({
        _id: block._id,
        type: "paragraph",
        data: { text: (block.data.title as string) || "" },
      });
      conversions++;
      continue;
    }

    // 2. Monolithic input block with title → paragraph + input (title stripped)
    if (INPUT_TYPES.has(block.type) && typeof block.data.title === "string") {
      const { title, ...rest } = block.data;
      result.push({
        type: "paragraph",
        data: { text: (title as string) || "" },
      });
      result.push({ _id: block._id, type: block.type, data: rest });
      conversions++;
      continue;
    }

    result.push(block);
  }

  return { blocks: result, conversions };
}

// ---------------------------------------------------------------------------
// DB helpers
// ---------------------------------------------------------------------------

const looseSchema = new mongoose.Schema(
  { blocks: { type: mongoose.Schema.Types.Mixed } },
  { strict: false },
);

const FormModel =
  (mongoose.models.Form as mongoose.Model<FormDoc>) || mongoose.model<FormDoc>("Form", looseSchema);

const SubmissionModel =
  (mongoose.models.Submission as mongoose.Model<SubmissionDoc>) ||
  mongoose.model<SubmissionDoc>("Submission", looseSchema);

async function connect(): Promise<void> {
  const uri =
    process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27018/forminit";
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB at ${mongoose.connection.host}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const execute = process.argv.includes("--execute");

  if (!execute) {
    console.log("DRY RUN — pass --execute to apply changes\n");
  } else {
    console.log("EXECUTE MODE — changes will be written to the database\n");
  }

  await connect();

  // Query for any document that still has legacy blocks
  const legacyQuery = {
    $or: [
      { "blocks.type": "questionTitle" },
      ...Array.from(INPUT_TYPES).map(t => ({
        [`blocks`]: { $elemMatch: { type: t, "data.title": { $exists: true } } },
      })),
    ],
  };

  // --- Forms ---
  const forms = await FormModel.find(legacyQuery).lean<FormDoc[]>();
  console.log(`Forms with legacy blocks: ${forms.length}`);

  let formsMigrated = 0;

  for (const form of forms) {
    const { blocks: newBlocks, conversions } = migrateBlocks(form.blocks);
    if (conversions === 0) continue;

    console.log(`  Form ${form._id}: ${conversions} conversion(s)`);

    if (execute) {
      await FormModel.updateOne({ _id: form._id }, { $set: { blocks: newBlocks } });
    }
    formsMigrated++;
  }

  // --- Submissions ---
  const submissions = await SubmissionModel.find(legacyQuery).lean<SubmissionDoc[]>();
  console.log(`\nSubmissions with legacy blocks: ${submissions.length}`);

  let subsMigrated = 0;

  for (const sub of submissions) {
    const { blocks: newBlocks, conversions } = migrateBlocks(sub.blocks);
    if (conversions === 0) continue;

    console.log(`  Submission ${sub._id} (formId: ${sub.formId}): ${conversions} conversion(s)`);

    if (execute) {
      await SubmissionModel.updateOne({ _id: sub._id }, { $set: { blocks: newBlocks } });
    }
    subsMigrated++;
  }

  console.log(`\n--- Summary ---`);
  console.log(`Forms migrated:       ${formsMigrated}`);
  console.log(`Submissions migrated: ${subsMigrated}`);

  if (!execute) {
    console.log("\nRe-run with --execute to apply these changes.");
  } else {
    console.log("\nMigration complete.");
  }

  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
