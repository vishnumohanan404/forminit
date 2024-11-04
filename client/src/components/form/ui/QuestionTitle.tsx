import React, { useState, useEffect, useRef } from "react";

interface EditableDivProps {
  question: string;
  placeholder: string;
  onInput: (value: string) => void;
  onKeyDown: () => void;
}

const QuestionTitle: React.FC<EditableDivProps> = ({
  question,
  placeholder,
  onInput,
  onKeyDown,
}) => {
  const [content, setContent] = useState(question);
  const divRef = useRef<HTMLDivElement>(null);

  // Update content when the question prop changes
  useEffect(() => {
    if (question && question !== content) {
      setContent(question);
    }
  }, [question, content]);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const text = event.currentTarget.innerText.trim();
    setContent(text); // Update the content
    onInput(text);
  };

  const handleBackspace = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const textContent = divRef.current?.innerText.trim();

    // Check if content is empty
    if (event.key === "Backspace" && textContent === "") {
      event.preventDefault(); // Prevent default backspace behavior
      onKeyDown(); // Trigger the action for removing the block
    }
  };

  useEffect(() => {
    if (divRef.current && question) {
      divRef.current.innerText = question; // Update the content when prop changes
    }
  }, [question]);

  return (
    <div className="relative">
      <div
        ref={divRef}
        contentEditable
        className={`cdx-input shadow-none editable-div border-none focus:outline-none font-semibold py-2 px-0 question-title-field`}
        onInput={handleInput}
        onKeyDown={handleBackspace}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default QuestionTitle;