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
  lastSubmissionAt: "2026-03-18T10:00:00.000Z",
  thisWeekSubmissions: 4,
  lastWeekSubmissions: 2,
  completionRate: 80,
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
      responseRate: 90,
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
      responseRate: 100,
    },
    {
      blockIndex: 2,
      type: "shortAnswerTool",
      title: "Any comments?",
      analytics: { responseCount: 7 },
      responseRate: 70,
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

  it("renders rating average summary in block row", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByText("4.2 / 5 avg")).toBeInTheDocument();
  });

  it("renders top choice label for multiple-choice block", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByText(/top: Red/)).toBeInTheDocument();
  });

  it("renders responseCount for text block", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByText("7 responses")).toBeInTheDocument();
  });

  it("renders empty state message when submissionsOverTime is empty", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData({ submissionsOverTime: [] }));
    renderTab();
    expect(await screen.findByTestId("no-timeseries")).toBeInTheDocument();
  });

  it("renders completion rate", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("completion-rate")).toHaveTextContent("80%");
  });

  it("renders this-week submissions", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("this-week-submissions")).toHaveTextContent("4");
  });

  it("shows trending-up weekly delta when this week > last week", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("weekly-delta")).toHaveTextContent("+2 vs last week");
  });

  it("shows last-submission date", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    expect(await screen.findByTestId("last-submission")).toBeInTheDocument();
  });

  it("shows response-rate bars for each block", async () => {
    vi.mocked(fetchFormAnalytics).mockResolvedValue(makeAnalyticsData());
    renderTab();
    const bars = await screen.findAllByTestId("response-rate-bar");
    expect(bars).toHaveLength(3);
  });
});
