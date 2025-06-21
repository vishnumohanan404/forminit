import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, GitCommit } from "lucide-react";
import { fetchChangelogs } from "@/services/changelogs";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import PageTitle from "@/components/common/PageTitle";

interface ChangelogEntry {
  version: string;
  changes: {
    id: string;
    description: string;
  }[];
}

const ChangelogsPage = () => {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [expandedVersions, setExpandedVersions] = useState<string[]>([]);

  // Parse markdown changelog content
  const parseChangelog = (content: string): ChangelogEntry[] => {
    const entries: ChangelogEntry[] = [];
    const lines = content.split("\n");

    let currentEntry: Partial<ChangelogEntry> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Match version headers like "## 0.6.0"
      const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+)/);

      if (versionMatch) {
        // Save previous entry if exists
        if (currentEntry && currentEntry.version) {
          entries.push({
            version: currentEntry.version,
            changes: currentEntry.changes || [],
          });
        }

        // Start new entry
        currentEntry = {
          version: versionMatch[1],
          changes: [],
        };
      }

      // Match change entries like "- e4f4ae8: fixed manifest path"
      if (currentEntry && line.match(/^-\s+[a-f0-9]+:/)) {
        const changeMatch = line.match(/^-\s+([a-f0-9]+):\s+(.+)/);
        if (changeMatch) {
          currentEntry.changes = currentEntry.changes || [];
          currentEntry.changes.push({
            id: changeMatch[1],
            description: changeMatch[2].trim(),
          });
        }
      }
    }

    // Don't forget the last entry
    if (currentEntry && currentEntry.version) {
      entries.push({
        version: currentEntry.version,
        changes: currentEntry.changes || [],
      });
    }

    return entries;
  };

  // Fetch from public folder
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["changelogs"],
    queryFn: fetchChangelogs,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (response) {
      const parsed = parseChangelog(response);
      if (parsed.length !== 0) {
        setChangelogs(parsed);
        setExpandedVersions([parsed[0].version]);
      }
    }
  }, [response, isError]);

  const toggleExpand = (version: string) => {
    setExpandedVersions(prev =>
      prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version],
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="px-5">
      <PageTitle>Changelogs</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container">
        <div className="space-y-6">
          <AnimatePresence>
            {changelogs.map((log, index) => (
              <motion.div
                key={log.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader
                    className="cursor-pointer bg-gradient-to-r from-muted/50 to-background"
                    onClick={() => toggleExpand(log.version)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl font-bold">v{log.version}</CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {log.changes.length} change{log.changes.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expandedVersions.includes(log.version) ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {expandedVersions.includes(log.version) && (
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {log.changes.map((change, changeIndex) => (
                          <motion.div
                            key={change.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: changeIndex * 0.1 }}
                            className="flex items-start space-x-3 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <GitCommit className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground">
                                {change.id}
                              </code>
                            </div>
                            <span className="flex-1 text-sm">{change.description}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {changelogs.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No changelogs found.</p>
        )}

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.scrollTo(0, 0)}
          >
            Back to Top
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ChangelogsPage;
