import fs from "fs/promises";
import path from "path";

export const getChangelogContent = async () => {
  const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");
  try {
    const data = await fs.readFile(changelogPath, "utf-8");
    return data;
  } catch (err) {
    throw new Error("Unable to read CHANGELOGS.md");
  }
};
