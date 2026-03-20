import MultipleChoiceOption from "@/components/form/ui/MultipleChoiceOption";

export interface DropdownData {
  required: boolean;
  options: Array<{ optionValue: string; optionMarker: string }>;
}

interface DropdownBlockProps {
  data: DropdownData;
  onChange: (data: Partial<DropdownData>) => void;
}

const DropdownBlock = ({ data, onChange }: DropdownBlockProps) => {
  const options =
    data.options?.length > 0 ? data.options : [{ optionValue: "", optionMarker: "a" }];

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground mb-1">Dropdown options</div>
      <MultipleChoiceOption
        optionsProp={options}
        onLastOptionKeyDown={() => {}}
        onAddNewOption={newOptions => onChange({ options: newOptions })}
        onInputChange={newOptions => onChange({ options: newOptions })}
      />
    </div>
  );
};

export default DropdownBlock;
