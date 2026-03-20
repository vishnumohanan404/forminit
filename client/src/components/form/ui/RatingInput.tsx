import React, { useState } from "react";

interface RatingInputProps {
  value: number;
  maxRating: number;
  onChange: (value: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ value, maxRating, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1 my-2">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          className="text-2xl focus:outline-none transition-colors"
          style={{ color: star <= (hovered || value) ? "#f59e0b" : "#d1d5db" }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingInput;
