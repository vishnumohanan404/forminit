import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalyticsTab from "@/layouts/form-summary/AnalyticsTab";

vi.mock("@/services/form", () => ({
  fetchFormAnalytics: vi.fn(),
}));

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

import { fetchFormAnalytics } from "@/services/form";

const makeAnalyticsData = (overrides = {}) => ({
  totalSubmissions: 10,
  submissionsOverTime: [{ date: "2026-03-01", count: 5 }],
  blockAnalytics: [
    {
      blockIndex: 0,
      type: "ratingTool",
      title: "Rate your experience",
      analytics: {
        average: 4.2,
        distribution: { "1": 0, "2": 1, "3": 2, "4": 4, "5": 3 },
      },
    },
    {
      blockIndex: 1,
      type: "multipleChoiceTool",
      title: "Favourite colour",
      analytics: {
        options: [
          { label: "Red", count: 6 },
          { label: "Blue", count: 4 },
        ],
      },
    },
    {
      blockIndex: 2,
      type: "shortAnswerTool",
      title: "Any comments?",
      analytics: { responseCount: 7 },
    },
  ],
  ...overrides,
});

const renderTab = (enabled = true) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <AnalyticsTab
        formId="form1"
        enabled={enabled}
      />
    </QueryClientProvider>,
  );
};

describe("AnalyticsTab", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders totalSubmissions", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("total-submissions")).toHaveTextContent("10");
  });

  it("renders rating average", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("rating-average")).toHaveTextContent("4.2");
  });

  it("renders option labels for multiple-choice block", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("option-Red")).toBeInTheDocument();
    expect(await screen.findByTestId("option-Blue")).toBeInTheDocument();
  });

  it("renders responseCount for text block", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("response-count")).toHaveTextContent("7");
  });

  it("renders empty state message when submissionsOverTime is empty", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData({ submissionsOverTime: [] }));
    renderTab();
    expect(await screen.findByTestId("no-timeseries")).toBeInTheDocument();
  });
});
