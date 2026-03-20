import { Textarea } from "@/components/ui/textarea";

export interface LongAnswerData {
  placeholder?: string;
  required: boolean;
}

interface LongAnswerBlockProps {
  data: LongAnswerData;
}

const LongAnswerBlock = ({ data }: LongAnswerBlockProps) => {
  return (
    <Textarea
      placeholder={data.placeholder || "Long answer text"}
      className="focus-visible:ring-0 resize-none pointer-events-none select-none"
      rows={4}
      readOnly
      tabIndex={-1}
    />
  );
};

export default LongAnswerBlock;
