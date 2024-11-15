import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
const ReportBug = () => {
  const [bugReport, setBugReport] = useState({
    title: "",
    description: "",
    steps: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <Label htmlFor="file-upload">Upload Images or Videos (optional)</Label>
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
                <span className="text-sm truncate">{file.name}</span>
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
  );
};

export default ReportBug;
