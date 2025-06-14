import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface MultipleChoiceOptionProps {
  optionsProp: Array<{ optionValue: string; optionMarker: string }>;
  onLastOptionKeyDown: (
    event: KeyboardEvent<HTMLInputElement>,
    idx: number,
    options: Array<{ optionValue: string; optionMarker: string }>
  ) => void;
  onAddNewOption: (
    options: Array<{ optionValue: string; optionMarker: string }>
  ) => void;
  onInputChange: (
    options: Array<{ optionValue: string; optionMarker: string }>
  ) => void;
}

const MultipleChoiceOption = ({
  optionsProp,
  onLastOptionKeyDown,
  onAddNewOption,
  onInputChange,
}: MultipleChoiceOptionProps) => {
  // Use a local state to manage the input value
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const newOptions = options.map((option, index) =>
      idx === index ? { ...option, optionValue: event.target.value } : option
    );
    setOptions(newOptions);
    onInputChange(newOptions);
  };
  const [nextOption, setNextOption] = useState("");
  const [options, setOptions] = useState<
    Array<{ optionValue: string; optionMarker: string }>
  >([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    setOptions(optionsProp);
  }, [optionsProp]);

  useEffect(() => {
    if (options?.length) {
      const initialOptionMarker = options[options?.length - 1]?.optionMarker;
      const nextCharCode = initialOptionMarker.charCodeAt(0) + 1;
      const optionMarker = String.fromCharCode(nextCharCode);
      setNextOption(optionMarker);
    }
  }, [options]);

  const handleBackspace = (
    event: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    console.log("event.key :>> ", event.key);
    if (
      event.key === "Backspace" &&
      options[idx].optionValue === "" &&
      options.length > 1 
    ) {
      // Prevent default backspace behavior and remove the block
      event.preventDefault();
      const newOptions = options.filter((_, i) => i !== idx);
      setOptions(newOptions);
      if (idx > 0) {
        setTimeout(() => {
          inputRefs.current[idx - 1]?.focus();
        }, 0);
      }
    } else {
      onLastOptionKeyDown(event, idx, options);
    }
  };
  const handleAddNextOption = () => {
    const newOptions = [
      ...options,
      { optionValue: "", optionMarker: nextOption },
    ];
    setOptions(newOptions);
    onAddNewOption(newOptions);
  };

  return (
    <>
      {options?.map((option, idx) => (
        <div className="flex flex-col" key={option.optionMarker}>
          <div className="relative inline-flex w-full max-w-sm align-middle mb-2 items-center gap-2">
            <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
              <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
                {option.optionMarker.toUpperCase()}
              </span>
            </div>
            <input
              type="text"
              className={
                "focus-visible:ring-0  w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 pl-9"
              }
              placeholder={"OPTION " + option.optionMarker.toUpperCase()}
              value={option.optionValue}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleBackspace(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
            />
          </div>
        </div>
      ))}
      <div className="relative inline-flex w-full max-w-sm align-middle">
        <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
          <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
            {nextOption.toUpperCase()}
          </span>
        </div>
        <div
          className={
            "focus-visible:ring-0  w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring cursor-pointer opacity-50 pl-9"
          }
          onClick={handleAddNextOption}
        >
          ADD OPTION
        </div>
      </div>
    </>
  );
};

export default MultipleChoiceOption;
