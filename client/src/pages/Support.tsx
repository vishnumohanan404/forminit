import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, MessageSquarePlus } from "lucide-react";
import FeatureRequest from "@/layouts/support/FeatureRequest";
import ReportBug from "@/layouts/support/ReportBug";
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
  return (
    <div className="px-5">
      <PageTitle>Support</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container">
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
                <FeatureRequest />
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
                <ReportBug />
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
                support@forminit.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupportPage;
