import PageTitle from "@/components/common/PageTitle";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, MessageSquarePlus, Upload, X } from "lucide-react";
interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I create a new form?",
    answer:
      "To create a new form, log in to your account and click on the 'Create New Form' button on your dashboard. You can then use our drag-and-drop editor to add fields and customize your form.",
  },
  {
    question: "Can I embed forms on my website?",
    answer:
      "Yes, you can easily embed forms on your website. After creating your form, go to the 'Share' tab and copy the embed code. Paste this code into your website's HTML where you want the form to appear.",
  },
  {
    question: "How do I view form responses?",
    answer:
      "To view form responses, go to your dashboard and click on the form you want to check. You'll see a 'Responses' tab where you can view all submissions. You can also export this data to CSV or Excel format.",
  },
  {
    question: "Is there a limit to how many forms I can create?",
    answer:
      "The number of forms you can create depends on your subscription plan. Free accounts can create up to 3 forms, while paid plans offer unlimited form creation.",
  },
  {
    question: "How secure are the form submissions?",
    answer:
      "We take security very seriously. All form submissions are encrypted using SSL/TLS technology. We also offer features like CAPTCHA and data encryption at rest to ensure the highest level of security for your data.",
  },
];

const SupportPage = () => {
  const [featureRequest, setFeatureRequest] = useState({
    title: "",
    description: "",
  });
  const [bugReport, setBugReport] = useState({
    title: "",
    description: "",
    steps: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFeatureRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the feature request to your backend
    console.log("Feature request submitted:", featureRequest);
    setFeatureRequest({ title: "", description: "" });
  };

  const handleBugReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the bug report to your backend
    console.log("Bug report submitted:", { ...bugReport, files });
    setBugReport({ title: "", description: "", steps: "" });
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="overflow-y-scroll px-5">
      <PageTitle>Support</PageTitle>
      <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="feature">Request Feature</TabsTrigger>
            <TabsTrigger value="bug">Report Bug</TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about our form builder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feature">
            <Card>
              <CardHeader>
                <CardTitle>Request a Feature</CardTitle>
                <CardDescription>
                  Let us know what features you'd like to see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeatureRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-title">Feature Title</Label>
                    <Input
                      id="feature-title"
                      value={featureRequest.title}
                      onChange={(e) =>
                        setFeatureRequest({
                          ...featureRequest,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter a brief title for your feature request"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feature-description">
                      Feature Description
                    </Label>
                    <Textarea
                      id="feature-description"
                      value={featureRequest.description}
                      onChange={(e) =>
                        setFeatureRequest({
                          ...featureRequest,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the feature you'd like to see and how it would benefit you"
                      required
                    />
                  </div>
                  <Button type="submit">Submit Feature Request</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bug">
            <Card>
              <CardHeader>
                <CardTitle>Report a Bug</CardTitle>
                <CardDescription>
                  Help us improve by reporting any issues you encounter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBugReport} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bug-title">Bug Title</Label>
                    <Input
                      id="bug-title"
                      value={bugReport.title}
                      onChange={(e) =>
                        setBugReport({ ...bugReport, title: e.target.value })
                      }
                      placeholder="Enter a brief title for the bug"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bug-description">Bug Description</Label>
                    <Textarea
                      id="bug-description"
                      value={bugReport.description}
                      onChange={(e) =>
                        setBugReport({
                          ...bugReport,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the bug in detail"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bug-steps">Steps to Reproduce</Label>
                    <Textarea
                      id="bug-steps"
                      value={bugReport.steps}
                      onChange={(e) =>
                        setBugReport({ ...bugReport, steps: e.target.value })
                      }
                      placeholder="Provide step-by-step instructions to reproduce the bug"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">
                      Upload Images or Videos (optional)
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Files
                      </Button>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </div>
                    {files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded-md"
                          >
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit">Submit Bug Report</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex items-center" variant="outline">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
              <Button className="flex items-center" variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                support@formcraft.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupportPage;
