import FormError from "@/components/auth/FormError";
import { render, screen } from "@testing-library/react";

describe("FormError Component", () => {
  it("should render the children content correctly", () => {
    const errorMessage = "This is an error message";

    render(<FormError>{errorMessage}</FormError>);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("should have the correct class for styling", () => {
    const errorMessage = "This is an error message";

    render(<FormError>{errorMessage}</FormError>);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass("text-red-600");
    expect(errorElement).toHaveClass("text-xs");
  });
});
