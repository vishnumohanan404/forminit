import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeProvider";

const AppearanceTab = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-2">
      <Label htmlFor="theme">Theme</Label>
      <Select
        value={theme}
        onValueChange={value => setTheme(value as "light" | "dark" | "system")}
      >
        <SelectTrigger id="theme">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppearanceTab;
