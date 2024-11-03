import React, { useState, useEffect, useRef } from "react";

interface EditableDivProps {
  placeholder: string;
  onInput: (value: string) => void;
  onKeyDown: () => void;
}

const QuestionTitle: React.FC<EditableDivProps> = ({
  placeholder,
  onInput,
  onKeyDown,
}) => {
  const [content, setContent] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const text = event.currentTarget.innerText.trim();
    setContent(text); // Update the content
    onInput(text);
  };

  const handleFocus = () => {
    if (divRef.current && content === "") {
      divRef.current.innerText = ""; // Clear the placeholder on focus
    }
  };

  const handleBlur = () => {
    if (divRef.current && content === "") {
      divRef.current.innerText = placeholder; // Show placeholder again if no content on blur
    }
  };

  const handleBackspace = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Backspace") {
      const inputField = divRef;
      if (
        inputField?.current?.innerText === "" ||
        inputField.current?.classList.contains("placeholder")
      ) {
        // Prevent default backspace behavior and remove the block
        event.preventDefault();
        onKeyDown();
      }
    }
  };

  useEffect(() => {
    if (divRef.current && content === "") {
      divRef.current.innerText = placeholder; // Show placeholder initially if no content
    }
  }, [content, placeholder]);

  return (
    <div
      ref={divRef}
      contentEditable
      className={`editable-div ${
        content === "" ? "placeholder text-slate-500" : ""
      } border-none focus:outline-none font-semibold py-2`}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleBackspace}
      suppressContentEditableWarning
    />
  );
};
export default QuestionTitle;
