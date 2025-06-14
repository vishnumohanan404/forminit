import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const FeatureRequest = () => {
  const [featureRequest, setFeatureRequest] = useState({
    title: "",
    description: "",
  });
  const handleFeatureRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the feature request to your backend
    console.log("Feature request submitted:", featureRequest);
    setFeatureRequest({ title: "", description: "" });
  };
  return (
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
        <Label htmlFor="feature-description">Feature Description</Label>
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
  );
};

export default FeatureRequest;
