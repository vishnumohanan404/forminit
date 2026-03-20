import { Input } from "@/components/ui/input";

export interface DateData {
  required: boolean;
}

const DateBlock = () => {
  return (
    <Input
      type="date"
      className="focus-visible:ring-0 w-[60%] pointer-events-none select-none"
      readOnly
      tabIndex={-1}
    />
  );
};

export default DateBlock;
