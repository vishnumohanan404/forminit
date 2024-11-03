import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";

interface ShortAnswerInputFieldProps {
  value: string;
  onInputChange: (value: string) => void;
  onKeyDown: () => void;
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

  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      const inputField = inputRef;
      if (inputField?.current?.value === "") {
        // Prevent default backspace behavior and remove the block
        event.preventDefault();
        onKeyDown();
      }
    }
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder ? "Type your placeholder" : ""}
      className="focus-visible:ring-0 my-2 w-[60%]"
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleBackspace}
    />
  );
};

export default ShortAnswerInput;
