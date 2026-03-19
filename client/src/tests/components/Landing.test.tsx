import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "@/pages/Landing";

vi.mock("@/components/svg/Logo", () => ({
  default: () => <svg data-testid="logo" />,
}));

vi.mock("@/contexts/AuthProvider", () => ({
  useAuth: vi.fn(() => ({ user: null, setUser: vi.fn() })),
}));

import { useAuth } from "@/contexts/AuthProvider";

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>,
  );

describe("Landing page", () => {
  afterEach(() => vi.clearAllMocks());

  it("shows 'Start free' in navbar when logged out", () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, setUser: vi.fn() });
    renderLanding();
    expect(screen.getByRole("button", { name: /start free/i })).toBeInTheDocument();
  });

  it("shows 'Dashboard' in navbar when logged in", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: "u1", fullName: "Alice", email: "a@b.com", avatar: "" },
      setUser: vi.fn(),
    });
    renderLanding();
    expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    renderLanding();
    expect(screen.getAllByText(/forminit/i).length).toBeGreaterThan(0);
  });

  it("CTA 'Get started' links to /dashboard", () => {
    renderLanding();
    const links = screen.getAllByRole("link", { name: /get started/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/dashboard");
  });

  it("renders 6 feature items", () => {
    renderLanding();
    const featureTitles = [
      "Visual block editor",
      "Rich input types",
      "Publish & share",
      "Response analytics",
      "Workspaces",
      "Fast by design",
    ];
    featureTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("contains no motion.div elements", () => {
    const { container } = renderLanding();
    // framer-motion renders motion.div as regular div — verify framer-motion
    // is not imported by checking that no elements have the data-projection-id
    // attribute that framer-motion adds at runtime
    const motionEls = container.querySelectorAll("[data-projection-id]");
    expect(motionEls.length).toBe(0);
  });
});
