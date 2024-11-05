import PageTitle from "@/components/common/PageTitle";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Star, Zap, Bug } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "feature" | "improvement" | "bugfix";
    description: string;
  }[];
}

const changelogs: ChangelogEntry[] = [
  {
    version: "2.1.0",
    date: "2024-05-15",
    changes: [
      { type: "feature", description: "Added support for multi-page forms" },
      { type: "improvement", description: "Enhanced form analytics dashboard" },
      {
        type: "bugfix",
        description: "Fixed issue with form submission on Safari browsers",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "2024-04-02",
    changes: [
      { type: "bugfix", description: "Resolved data export formatting issues" },
      { type: "improvement", description: "Optimized form loading times" },
    ],
  },
  {
    version: "2.0.0",
    date: "2024-03-15",
    changes: [
      {
        type: "feature",
        description: "Introduced new drag-and-drop form builder interface",
      },
      {
        type: "feature",
        description: "Added support for custom themes and branding",
      },
      {
        type: "improvement",
        description: "Revamped user dashboard for better navigation",
      },
      { type: "bugfix", description: "Fixed multiple accessibility issues" },
    ],
  },
  {
    version: "1.5.2",
    date: "2024-02-10",
    changes: [
      {
        type: "bugfix",
        description: "Fixed form validation errors on certain field types",
      },
      {
        type: "improvement",
        description: "Enhanced performance of form template loading",
      },
    ],
  },
  {
    version: "1.5.1",
    date: "2024-01-20",
    changes: [
      {
        type: "bugfix",
        description: "Resolved issue with email notifications not sending",
      },
      {
        type: "improvement",
        description: "Updated third-party dependencies for security",
      },
    ],
  },
  {
    version: "1.5.0",
    date: "2024-01-05",
    changes: [
      {
        type: "feature",
        description: "Introduced conditional logic for form fields",
      },
      {
        type: "feature",
        description: "Added support for file uploads in forms",
      },
      {
        type: "improvement",
        description: "Enhanced mobile responsiveness of forms",
      },
    ],
  },
];

const ChangelogsPage = () => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "feature" | "improvement" | "bugfix"
  >("all");

  const filteredChangelogs = selectedVersion
    ? changelogs.filter((log) => log.version === selectedVersion)
    : changelogs;

  const toggleExpand = (version: string) => {
    setExpandedVersions((prev) =>
      prev.includes(version)
        ? prev.filter((v) => v !== version)
        : [...prev, version]
    );
  };

  useEffect(() => {
    if (filteredChangelogs.length > 0) {
      setExpandedVersions([filteredChangelogs[0].version]);
    }
  }, [selectedVersion, filteredChangelogs]);

  const getIcon = (type: "feature" | "improvement" | "bugfix") => {
    switch (type) {
      case "feature":
        return <Star className="w-4 h-4" />;
      case "improvement":
        return <Zap className="w-4 h-4" />;
      case "bugfix":
        return <Bug className="w-4 h-4" />;
    }
  };
  return (
    <div className="overflow-y-auto px-5">
      <PageTitle>Changelogs</PageTitle>
      <main className="mx-auto max-w-[1100px] min-h-[300px] overflow-auto flex-grow container mb-28">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Select
            onValueChange={(value) =>
              setSelectedVersion(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Versions</SelectItem>
              {changelogs.map((log) => (
                <SelectItem key={log.version} value={log.version}>
                  Version {log.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            value={activeTab}
            onValueChange={(value: any) => setActiveTab(value)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="feature">Features</TabsTrigger>
              <TabsTrigger value="improvement">Improvements</TabsTrigger>
              <TabsTrigger value="bugfix">Bugfixes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {filteredChangelogs.map((log) => (
              <motion.div
                key={log.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader
                    className="cursor-pointer bg-gradient-to-r from-muted/50 to-background"
                    onClick={() => toggleExpand(log.version)}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">
                        Version {log.version}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <CardDescription className="text-sm font-medium">
                          {log.date}
                        </CardDescription>
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
                      <ul className="space-y-3">
                        {log.changes
                          .filter(
                            (change) =>
                              activeTab === "all" || change.type === activeTab
                          )
                          .map((change, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start space-x-3 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors duration-200"
                            >
                              <Badge
                                variant={
                                  change.type === "feature"
                                    ? "default"
                                    : change.type === "improvement"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="mt-0.5 flex items-center space-x-1 px-2 py-1"
                              >
                                {getIcon(change.type)}
                                <span className="capitalize">
                                  {change.type}
                                </span>
                              </Badge>
                              <span className="flex-1">
                                {change.description}
                              </span>
                            </motion.li>
                          ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredChangelogs.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No changelogs found for the selected version.
          </p>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => window.scrollTo(0, 0)}>
            Back to Top
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ChangelogsPage;
