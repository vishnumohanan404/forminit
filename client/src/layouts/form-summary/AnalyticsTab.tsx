import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid } from "recharts";
import {
  fetchFormAnalytics,
  BlockAnalyticsItem,
  FormAnalyticsData,
  SubmissionTimePoint,
} from "@/services/form";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalyticsTabProps {
  formId: string;
  enabled: boolean;
}

const chartConfig: ChartConfig = {
  count: { label: "Submissions" },
};

const formatLastSeen = (iso: string | null): string => {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const WeeklyDelta = ({ thisWeek, lastWeek }: { thisWeek: number; lastWeek: number }) => {
  const diff = thisWeek - lastWeek;
  if (diff > 0)
    return (
      <span
        className="flex items-center gap-0.5 text-xs text-emerald-500"
        data-testid="weekly-delta"
      >
        <TrendingUp className="h-3 w-3" />+{diff} vs last week
      </span>
    );
  if (diff < 0)
    return (
      <span
        className="flex items-center gap-0.5 text-xs text-destructive"
        data-testid="weekly-delta"
      >
        <TrendingDown className="h-3 w-3" />
        {diff} vs last week
      </span>
    );
  return (
    <span
      className="flex items-center gap-0.5 text-xs text-muted-foreground"
      data-testid="weekly-delta"
    >
      <Minus className="h-3 w-3" />
      Same as last week
    </span>
  );
};

const AnalyticsTab = ({ formId, enabled }: AnalyticsTabProps) => {
  const { data, isLoading, isError } = useQuery<FormAnalyticsData>({
    queryKey: ["analytics", formId],
    queryFn: () => fetchFormAnalytics(formId),
    enabled,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-center text-muted-foreground py-10">
        Failed to load analytics. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-border rounded-sm divide-x divide-border">
        <div className="p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Total submissions
          </span>
          <span
            className="text-2xl font-semibold tabular-nums"
            data-testid="total-submissions"
          >
            {data.totalSubmissions}
          </span>
          <WeeklyDelta
            thisWeek={data.thisWeekSubmissions}
            lastWeek={data.lastWeekSubmissions}
          />
        </div>

        <div className="p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">This week</span>
          <span
            className="text-2xl font-semibold tabular-nums"
            data-testid="this-week-submissions"
          >
            {data.thisWeekSubmissions}
          </span>
          <span className="text-xs text-muted-foreground">
            last week: {data.lastWeekSubmissions}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Completion rate
          </span>
          <span
            className="text-2xl font-semibold tabular-nums"
            data-testid="completion-rate"
          >
            {data.completionRate}%
          </span>
          <span className="text-xs text-muted-foreground">all fields answered</span>
        </div>

        <div className="p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Last submission
          </span>
          <span
            className="text-lg font-semibold"
            data-testid="last-submission"
          >
            {formatLastSeen(data.lastSubmissionAt)}
          </span>
          {data.lastSubmissionAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(data.lastSubmissionAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Submissions over time — half-width chart + half-width stats */}
      <div className="border border-border rounded-sm">
        {data.submissionsOverTime.length === 0 ? (
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Submissions — last 30 days
            </p>
            <p
              className="text-sm text-muted-foreground py-2"
              data-testid="no-timeseries"
            >
              No submissions in the last 30 days.
            </p>
          </div>
        ) : (
          <div className="flex divide-x divide-border">
            <div className="flex-1 px-4 pt-3 pb-2 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Submissions — last 30 days
              </p>
              <ChartContainer
                config={chartConfig}
                className="h-[180px] w-full"
              >
                <LineChart
                  data={data.submissionsOverTime}
                  margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    tick={{ fontSize: 10 }}
                    tickFormatter={v => v.slice(5)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey="count"
                    type="monotone"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
            <TimeseriesStats points={data.submissionsOverTime} />
          </div>
        )}
      </div>

      {/* Per-block analytics — compact table */}
      <div className="border border-border rounded-sm divide-y divide-border">
        <div className="px-4 py-2 grid grid-cols-[1fr_auto] items-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Block</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider text-right w-20">
            Response
          </p>
        </div>
        {data.blockAnalytics.map(block => (
          <BlockAnalyticsRow
            key={block.blockIndex}
            block={block}
          />
        ))}
      </div>
    </div>
  );
};

const TimeseriesStats = ({ points }: { points: SubmissionTimePoint[] }) => {
  const total = points.reduce((s, p) => s + p.count, 0);
  const peak = points.reduce((max, p) => (p.count > max.count ? p : max), points[0]);
  const avg = total / points.length;

  return (
    <div className="w-[180px] shrink-0 px-4 pt-3 pb-2 flex flex-col gap-4 justify-center">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Peak day</span>
        <span className="text-xl font-semibold tabular-nums">{peak.count}</span>
        <span className="text-xs text-muted-foreground">{peak.date.slice(5)}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Daily avg</span>
        <span className="text-xl font-semibold tabular-nums">{avg.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">over {points.length} active days</span>
      </div>
    </div>
  );
};

const ResponseRateBar = ({ rate }: { rate: number }) => {
  const color = rate >= 80 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-500" : "bg-destructive";
  return (
    <div
      className="flex items-center gap-1.5"
      data-testid="response-rate-bar"
    >
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{rate}%</span>
    </div>
  );
};

const BlockAnalyticsRow = ({ block }: { block: BlockAnalyticsItem }) => {
  const { type, title, analytics, responseRate } = block;

  const summary =
    type === "ratingTool" && analytics.average !== undefined ? (
      <span className="text-xs tabular-nums font-medium">{analytics.average} / 5 avg</span>
    ) : (type === "multipleChoiceTool" || type === "dropdownTool") && analytics.options?.length ? (
      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
        top: {analytics.options[0].label}
      </span>
    ) : analytics.responseCount !== undefined ? (
      <span className="text-xs tabular-nums font-medium">{analytics.responseCount} responses</span>
    ) : null;

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <p className="text-sm truncate flex-1 min-w-0">{title}</p>
      {summary && <div className="shrink-0">{summary}</div>}
      <ResponseRateBar rate={responseRate} />
    </div>
  );
};

export default AnalyticsTab;
