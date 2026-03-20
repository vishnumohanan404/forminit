import { Input } from "@/components/ui/input";

export interface EmailData {
  required: boolean;
}

const EmailBlock = () => {
  return (
    <Input
      type="email"
      placeholder="name@example.com"
      className="focus-visible:ring-0 w-[60%] pointer-events-none select-none"
      readOnly
      tabIndex={-1}
    />
  );
};

export default EmailBlock;
