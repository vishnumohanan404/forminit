import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessFormSubmitPage() {
  const navigate = useNavigate();

  const handleNewForm = () => {
    // Navigate to the forms list or dashboard
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Form Submitted Successfully!</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Thank you for your submission.
      </p>
      <Button onClick={handleNewForm}>
        <ArrowRight /> Go Home
      </Button>
    </div>
  );
}
