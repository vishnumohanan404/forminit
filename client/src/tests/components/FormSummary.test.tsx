import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FormSummaryPage from "@/pages/FormSummary";

vi.mock("@/services/form", () => ({
  fetchSubmissions: vi.fn().mockResolvedValue({ submissions: [], total: 0 }),
  viewForm: vi.fn().mockResolvedValue({ blocks: [], disabled: false }),
  fetchFormAnalytics: vi.fn().mockResolvedValue({
    totalSubmissions: 0,
    submissionsOverTime: [],
    blockAnalytics: [],
  }),
}));

vi.mock("@/components/common/PageTitle", () => ({
  default: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

vi.mock("@/layouts/form-summary/SubmissionsTable", () => ({
  default: () => <div />,
}));

vi.mock("@/layouts/form-summary/ShareTab", () => ({
  default: () => <div data-testid="share-tab" />,
}));

vi.mock("@/layouts/form-summary/SettingsTab", () => ({
  default: () => <div data-testid="settings-tab" />,
}));

vi.mock("@/layouts/form-summary/AnalyticsTab", () => ({
  default: ({ enabled }: { enabled: boolean }) => (
    <div data-testid="analytics-tab">{enabled ? "analytics-loaded" : "analytics-idle"}</div>
  ),
}));

const renderFormSummary = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/form-summary/form1?name=Test+Form"]}>
        <Routes>
          <Route
            path="/form-summary/:formId"
            element={<FormSummaryPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("FormSummaryPage", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders the Analytics tab trigger", () => {
    renderFormSummary();
    expect(screen.getByRole("tab", { name: /analytics/i })).toBeInTheDocument();
  });

  it("AnalyticsTab mounts when Analytics tab is clicked", async () => {
    renderFormSummary();
    const analyticsTab = screen.getByRole("tab", { name: /analytics/i });
    fireEvent.click(analyticsTab);
    expect(await screen.findByTestId("analytics-tab")).toBeInTheDocument();
  });
});
