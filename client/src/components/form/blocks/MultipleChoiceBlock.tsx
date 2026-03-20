import MultipleChoiceOption from "@/components/form/ui/MultipleChoiceOption";

export interface MultipleChoiceData {
  required: boolean;
  options: Array<{ optionValue: string; optionMarker: string }>;
}

interface MultipleChoiceBlockProps {
  data: MultipleChoiceData;
  onChange: (data: Partial<MultipleChoiceData>) => void;
}

const MultipleChoiceBlock = ({ data, onChange }: MultipleChoiceBlockProps) => {
  const options =
    data.options?.length > 0 ? data.options : [{ optionValue: "", optionMarker: "a" }];

  return (
    <MultipleChoiceOption
      optionsProp={options}
      onLastOptionKeyDown={() => {}}
      onAddNewOption={newOptions => onChange({ options: newOptions })}
      onInputChange={newOptions => onChange({ options: newOptions })}
    />
  );
};

export default MultipleChoiceBlock;
