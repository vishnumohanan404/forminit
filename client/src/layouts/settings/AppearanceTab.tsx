import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
const AppearanceTab = () => {
  const [language, setLanguage] = useState<string>("en");
  return (
    <div className="space-y-2">
      <Label htmlFor="language">Language</Label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger id="language">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppearanceTab;
