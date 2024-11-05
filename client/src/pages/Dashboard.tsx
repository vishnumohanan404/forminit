import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  FileText,
  Layout,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/common/Footer";
interface Workspace {
  id: string;
  name: string;
  forms: number;
  members: number;
}

interface Form {
  id: number;
  title: string;
  status: "published" | "draft";
  responses: number;
}

interface WorkspaceForms {
  [key: string]: Form[];
}

const DashboardPage = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: "1", name: "Personal", forms: 2, members: 1 },
    { id: "2", name: "Team Project", forms: 5, members: 4 },
    { id: "3", name: "Client Work", forms: 3, members: 2 },
  ]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("1");

  const [forms, setForms] = useState<WorkspaceForms>({
    "1": [
      { id: 1, title: "Customer Feedback", status: "published", responses: 24 },
      { id: 2, title: "Event Registration", status: "draft", responses: 0 },
    ],
    "2": [
      { id: 3, title: "Team Survey", status: "published", responses: 15 },
      { id: 4, title: "Project Feedback", status: "draft", responses: 0 },
      { id: 5, title: "Meeting Scheduler", status: "published", responses: 8 },
    ],
    "3": [
      { id: 6, title: "Client Onboarding", status: "published", responses: 5 },
      { id: 7, title: "Satisfaction Survey", status: "draft", responses: 0 },
    ],
  });
  const currentWorkspace = workspaces.find((w) => w.id === selectedWorkspace);
  const currentForms = forms[selectedWorkspace] || [];
  return (
    <div className="overflow-y-auto px-5">
      <PageTitle>Home</PageTitle>

      {/* <div className="">
          <Label htmlFor="workspace-select">Workspace</Label>
          <Select
            value={selectedWorkspace}
            onValueChange={setSelectedWorkspace}
          >
            <SelectTrigger id="workspace-select" className="w-full mt-1">
              <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      <main className="mx-auto max-w-[1100px] min-h-[300px] overflow-auto flex-grow container mb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Workspace: {currentWorkspace?.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-between items-center">
                <span>Forms: {currentForms.length}</span>
                <span>Members: {currentWorkspace?.members}</span>
              </div>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create New Form
              </Button>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" /> Manage Members
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Workspace Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    {forms[selectedWorkspace].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Forms</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      forms[selectedWorkspace].filter(
                        (f) => f.status === "published"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {forms[selectedWorkspace].reduce(
                      (acc, form) => acc + form.responses,
                      0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Responses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
              <CardHeader>
                <CardTitle>EditorJS Integration</CardTitle>
                <CardDescription>Build rich, interactive forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm">
                    Use our powerful EditorJS integration to create dynamic form
                    fields, add rich text, images, and more.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card> */}
        </div>
        <Tabs defaultValue="all" className="mt-12">
          <TabsList>
            <TabsTrigger value="all">All Forms</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4">
              {currentForms.map((form) => (
                <Card key={form.id}>
                  <CardHeader>
                    <CardTitle>{form.title}</CardTitle>
                    <CardDescription>
                      Status: <span className="capitalize">{form.status}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Responses: {form.responses}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                    <div className="flex align-middle gap-5">
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      {form.status === "draft" && <Button>Publish</Button>}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="published" className="mt-4">
            <div className="grid gap-4">
              {currentForms
                .filter((form) => form.status === "published")
                .map((form) => (
                  <Card key={form.id}>
                    <CardHeader>
                      <CardTitle>{form.title}</CardTitle>
                      <CardDescription>
                        Status:{" "}
                        <span className="capitalize">{form.status}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Responses: {form.responses}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> View
                      </Button>
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            <div className="grid gap-4">
              {currentForms
                .filter((form) => form.status === "draft")
                .map((form) => (
                  <Card key={form.id}>
                    <CardHeader>
                      <CardTitle>{form.title}</CardTitle>
                      <CardDescription>
                        Status:{" "}
                        <span className="capitalize">{form.status}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Responses: {form.responses}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> View
                      </Button>
                      <div className="flex align-middle gap-5">
                        <Button variant="outline">
                          <Settings className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button>Publish</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;
