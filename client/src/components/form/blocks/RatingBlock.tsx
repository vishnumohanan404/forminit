import RatingInput from "@/components/form/ui/RatingInput";

export interface RatingData {
  required: boolean;
  maxRating: number;
}

interface RatingBlockProps {
  data: RatingData;
}

const RatingBlock = ({ data }: RatingBlockProps) => {
  return (
    <div className="pointer-events-none select-none">
      <RatingInput
        value={0}
        maxRating={data.maxRating || 5}
        onChange={() => {}}
      />
    </div>
  );
};

export default RatingBlock;
