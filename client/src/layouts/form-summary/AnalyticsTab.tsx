import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid } from "recharts";
import { fetchFormAnalytics, BlockAnalyticsItem, FormAnalyticsData } from "@/services/form";
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

      {/* Submissions over time */}
      <div className="border border-border rounded-sm p-4">
        <p className="text-sm font-medium mb-3">Submissions over time (last 30 days)</p>
        {data.submissionsOverTime.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-testid="no-timeseries"
          >
            No submissions in the last 30 days.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[180px] w-full"
          >
            <LineChart
              data={data.submissionsOverTime}
              margin={{ left: 8, right: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
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
        )}
      </div>

      {/* Per-block analytics with drop-off */}
      {data.blockAnalytics.map(block => (
        <BlockAnalyticsCard
          key={block.blockIndex}
          block={block}
        />
      ))}
    </div>
  );
};

const ResponseRateBar = ({ rate }: { rate: number }) => {
  const color = rate >= 80 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-500" : "bg-destructive";
  return (
    <div
      className="flex items-center gap-2 mt-2"
      data-testid="response-rate-bar"
    >
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
        {rate}% answered
      </span>
    </div>
  );
};

const BlockAnalyticsCard = ({ block }: { block: BlockAnalyticsItem }) => {
  const { type, title, analytics, responseRate } = block;

  return (
    <div className="border border-border rounded-sm p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
      <ResponseRateBar rate={responseRate} />

      <div className="mt-4">
        {type === "ratingTool" && analytics.average !== undefined && analytics.distribution ? (
          <RatingBlockView
            average={analytics.average}
            distribution={analytics.distribution}
          />
        ) : type === "multipleChoiceTool" || type === "dropdownTool" ? (
          analytics.options ? (
            <ChoiceBlockView options={analytics.options} />
          ) : null
        ) : analytics.responseCount !== undefined ? (
          <TextBlockView responseCount={analytics.responseCount} />
        ) : null}
      </div>
    </div>
  );
};

const RatingBlockView = ({
  average,
  distribution,
}: {
  average: number;
  distribution: Record<string, number>;
}) => {
  const maxCount = Math.max(...Object.values(distribution), 1);
  const stars = ["1", "2", "3", "4", "5"];

  return (
    <div>
      <p
        className="text-3xl font-semibold tabular-nums mb-4"
        data-testid="rating-average"
      >
        {average}
        <span className="text-base text-muted-foreground font-normal"> / 5</span>
      </p>
      <div className="space-y-2">
        {stars.map(star => {
          const count = distribution[star] ?? 0;
          return (
            <div
              key={star}
              className="flex items-center gap-2"
            >
              <span className="text-xs w-3 text-muted-foreground">{star}</span>
              <div className="flex-1 h-2 bg-muted rounded-sm overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs w-6 text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChoiceBlockView = ({ options }: { options: Array<{ label: string; count: number }> }) => {
  const visible = options.slice(0, 8);
  const overflow = options.length - 8;
  const maxCount = Math.max(...options.map(o => o.count), 1);

  return (
    <div className="space-y-2">
      {visible.map(opt => (
        <div
          key={opt.label}
          className="flex items-center gap-2"
          data-testid={`option-${opt.label}`}
        >
          <span className="text-xs w-24 truncate text-muted-foreground">{opt.label}</span>
          <div className="flex-1 h-2 bg-muted rounded-sm overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(opt.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-xs w-6 text-right text-muted-foreground">{opt.count}</span>
        </div>
      ))}
      {overflow > 0 && (
        <p className="text-xs text-muted-foreground mt-1">+{overflow} more options</p>
      )}
    </div>
  );
};

const TextBlockView = ({ responseCount }: { responseCount: number }) => (
  <div>
    <p
      className="text-2xl font-semibold tabular-nums"
      data-testid="response-count"
    >
      {responseCount}
    </p>
    <p className="text-xs text-muted-foreground">responses</p>
  </div>
);

export default AnalyticsTab;
