import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

interface EditableDivProps {
  question: string;
  placeholder: string;
  onInput: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, id?: number) => void;
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
        onKeyDown={onKeyDown}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default QuestionTitle;
