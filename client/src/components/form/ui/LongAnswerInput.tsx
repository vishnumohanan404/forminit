import { Textarea } from "@/components/ui/textarea";
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

interface LongAnswerInputFieldProps {
  value: string;
  onInputChange: (value: string) => void;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
}

const LongAnswerInput: React.FC<LongAnswerInputFieldProps> = ({
  value,
  onInputChange,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [placeholder, setPlaceholder] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(event.target.value);
  };
  const handleFocus = () => {
    setPlaceholder(true);
  };

  const handleBlur = () => {
    setPlaceholder(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value; // Update the input field value when prop changes
    }
  }, [value]);

  return (
    <Textarea
      ref={inputRef}
      placeholder={placeholder ? "Type your placeholder" : ""}
      className="focus-visible:ring-0 my-2 resize-none"
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      rows={4}
    />
  );
};

export default LongAnswerInput;
