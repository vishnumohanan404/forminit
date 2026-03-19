import { render, screen, fireEvent } from "@testing-library/react";
import RatingInput from "@/components/form/ui/RatingInput";

describe("RatingInput", () => {
  it("renders the correct number of stars", () => {
    render(
      <RatingInput
        value={0}
        maxRating={5}
        onChange={() => {}}
      />,
    );
    const stars = screen.getAllByRole("button");
    expect(stars).toHaveLength(5);
  });

  it("calls onChange with the clicked star value", () => {
    const onChange = vi.fn();
    render(
      <RatingInput
        value={0}
        maxRating={5}
        onChange={onChange}
      />,
    );
    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[2]); // 3rd star = rating 3
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("highlights stars up to the current value", () => {
    render(
      <RatingInput
        value={3}
        maxRating={5}
        onChange={() => {}}
      />,
    );
    const stars = screen.getAllByRole("button");
    // First 3 should be amber (#f59e0b), last 2 grey
    expect(stars[0]).toHaveStyle({ color: "#f59e0b" });
    expect(stars[2]).toHaveStyle({ color: "#f59e0b" });
    expect(stars[3]).toHaveStyle({ color: "#d1d5db" });
  });

  it("respects a custom maxRating", () => {
    render(
      <RatingInput
        value={0}
        maxRating={3}
        onChange={() => {}}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
