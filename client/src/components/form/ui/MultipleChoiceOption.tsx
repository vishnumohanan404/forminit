import { useEffect, useRef, useState } from "react";

interface MultipleChoiceOptionProps {
  data: { optionValue: string; optionMarker: string };
  onInputChange: (value: string) => void;
  onKeyDown: () => void;
  onHandleAddNextOption: (optionMarker: string) => void;
}
const MultipleChoiceOption = ({
  data,
  onInputChange,
  onKeyDown,
  onHandleAddNextOption,
}: MultipleChoiceOptionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };
  const [nextOption, setNextOption] = useState("");
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = data.optionValue; // Update the input field value when prop changes
      const initialOptionMarker = data.optionMarker;
      let nextCharCode = initialOptionMarker.charCodeAt(0) + 1;
      const optionMarker = String.fromCharCode(nextCharCode);
      setNextOption(optionMarker);
    }
  }, [data.optionValue, data.optionMarker]);
  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (inputRef?.current?.value === "") {
        // Prevent default backspace behavior and remove the block
        event.preventDefault();
        onKeyDown();
      }
    }
  };
  const [remove, setRemove] = useState(false);
  const handleAddNextOption = () => {
    onHandleAddNextOption(nextOption);
    setRemove(true);
  };
  return (
    <div className="flex flex-col">
      <div className="relative inline-flex w-full max-w-sm align-middle mb-2">
        <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
          <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
            {data.optionMarker}
          </span>
        </div>
        <input
          ref={inputRef}
          type="text"
          className={
            "focus-visible:ring-0  w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          }
          placeholder={"Option " + data.optionMarker}
          value={data.optionValue}
          onChange={handleChange}
          onKeyDown={handleBackspace}
        />
      </div>
      {!remove && (
        <div className="relative inline-flex w-full max-w-sm align-middle">
          <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
            <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
              {nextOption}
            </span>
          </div>
          <div
            ref={inputRef}
            className={
              " focus-visible:ring-0  w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring cursor-pointer opacity-50 pl-9"
            }
            onClick={handleAddNextOption}
          >
            Add Option
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceOption;
