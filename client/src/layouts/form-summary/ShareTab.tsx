import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const ShareTab = () => {
  const [searchParams] = useSearchParams();
  console.log('searchParams.get("url") :>> ', searchParams.get("url"));
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + searchParams.get("url") || ""
      );
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Share Link</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your form is now published and ready to be shared with the world!
            Copy this link to share your form on social media, messaging apps or
            via email.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={window.location.origin + searchParams.get("url") || ""}
            readOnly
            className="flex-1"
          />
          <Link
            to={window.location.origin + searchParams.get("url") || ""}
            target="_blank"
          >
            <Button variant="outline" className="shrink-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Button onClick={handleCopy} variant="default" className="shrink-0">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        {/* <Button variant="ghost" className="text-sm">
      <Globe className="h-4 w-4 mr-2" />
      Use custom domain
    </Button> */}
      </div>
      {/* Embed Form Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Embed Form</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Use these options to embed your form into your own website.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-4 space-y-4">
              <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-primary/10 rounded" />
              </div>
              <p className="text-sm font-medium text-center">Standard</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-4 space-y-4">
              <div className="w-full aspect-video bg-muted rounded-lg flex items-end justify-end p-4">
                <div className="w-1/3 h-1/3 bg-primary/10 rounded" />
              </div>
              <p className="text-sm font-medium text-center">Popup</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-4 space-y-4">
              <div className="w-full aspect-video bg-primary/10 rounded-lg" />
              <p className="text-sm font-medium text-center">Full page</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ShareTab;
