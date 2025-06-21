import { getChangelogContent } from "../services/changelogs";
import { Request, Response } from "express";

export const fetchChangelogs = async (req: Request, res: Response) => {
  try {
    const changelog = await getChangelogContent();
    res.type("text/plain").send(changelog);
  } catch (err) {
    console.error("Changelog fetch failed:", err);
    res.status(500).json({ error: "Failed to retrieve changelog." });
  }
};
