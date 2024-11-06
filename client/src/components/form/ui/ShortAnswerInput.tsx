import { Input } from "@/components/ui/input";
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

interface ShortAnswerInputFieldProps {
  value: string;
  onInputChange: (value: string) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const ShortAnswerInput: React.FC<ShortAnswerInputFieldProps> = ({
  value,
  onInputChange,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder ? "Type your placeholder" : ""}
      className="focus-visible:ring-0 my-2 w-[60%] short-answer-input-field"
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
    />
  );
};

export default ShortAnswerInput;
