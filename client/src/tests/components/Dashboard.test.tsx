import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "@/pages/Dashboard";

vi.mock("@/services/dashboard", () => ({
  fetchDashboard: vi.fn(),
}));

vi.mock("@/components/dashboard/CreateWorkspaceDialog", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/common/PageTitle", () => ({
  default: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

import { fetchDashboard } from "@/services/dashboard";

const makeDashboard = (overrides?: object) => ({
  _id: "dash1",
  user_id: "user1",
  workspaces: [
    {
      _id: "ws1",
      name: "My Workspace",
      created: "2025-01-01T00:00:00.000Z",
      forms: [
        {
          _id: "f1",
          form_id: "form1",
          name: "Active Form",
          submissions: 5,
          created: "2025-01-01T00:00:00.000Z",
          modified: "2025-01-02T00:00:00.000Z",
          url: "/view-form/form1",
          disabled: false,
        },
        {
          _id: "f2",
          form_id: "form2",
          name: "Disabled Form",
          submissions: 2,
          created: "2025-01-01T00:00:00.000Z",
          modified: "2025-01-02T00:00:00.000Z",
          url: "/view-form/form2",
          disabled: true,
        },
      ],
    },
  ],
  ...overrides,
});

const renderDashboard = (dashboardData = makeDashboard()) => {
  vi.mocked(fetchDashboard).mockResolvedValue(dashboardData);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("DashboardPage", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders stat bar with correct counts", async () => {
    renderDashboard();
    // Total Forms = 2, Total Submissions = 7, Active Forms = 1
    expect(await screen.findByText("2")).toBeInTheDocument();
    expect(await screen.findByText("7")).toBeInTheDocument();
    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  it("renders Workspace column header in the forms table", async () => {
    renderDashboard();
    expect(await screen.findByText("Workspace")).toBeInTheDocument();
  });

  it("renders Disabled badge for disabled form", async () => {
    renderDashboard();
    expect(await screen.findByText("Disabled")).toBeInTheDocument();
  });

  it("renders Active badge for active form", async () => {
    renderDashboard();
    expect(await screen.findByText("Active")).toBeInTheDocument();
  });

  it("shows empty state when workspaces array is empty", async () => {
    renderDashboard(makeDashboard({ workspaces: [] }));
    expect(await screen.findByText(/no workspaces yet/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /create workspace/i })).toBeInTheDocument();
  });
});
