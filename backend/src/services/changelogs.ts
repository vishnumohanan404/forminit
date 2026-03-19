const GITLAB_CHANGELOG_URL =
  "https://gitlab.com/forminit/forminit-app/-/raw/main/client/CHANGELOG.md";

export const getChangelogContent = async () => {
  try {
    const response = await fetch(GITLAB_CHANGELOG_URL);
    return response.text();
  } catch (err) {
    console.error("Failed to fetch changelog from GitLab:", err);
    throw new Error("Unable to read CHANGELOG.md from any source");
  }
};
