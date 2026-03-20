import { Input } from "@/components/ui/input";

export interface ShortAnswerData {
  placeholder?: string;
  required: boolean;
}

interface ShortAnswerBlockProps {
  data: ShortAnswerData;
}

const ShortAnswerBlock = ({ data }: ShortAnswerBlockProps) => {
  return (
    <Input
      type="text"
      placeholder={data.placeholder || "Short answer text"}
      className="focus-visible:ring-0 w-[60%] pointer-events-none select-none"
      readOnly
      tabIndex={-1}
    />
  );
};

export default ShortAnswerBlock;
