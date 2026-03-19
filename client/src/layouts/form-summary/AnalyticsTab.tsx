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

interface AnalyticsTabProps {
  formId: string;
  enabled: boolean;
}

const chartConfig: ChartConfig = {
  count: { label: "Submissions" },
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
    <div className="space-y-4 pb-8">
      {/* Stat row */}
      <div className="border border-border rounded-sm p-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Total Submissions
        </span>
        <span
          className="text-2xl font-semibold tabular-nums ml-4"
          data-testid="total-submissions"
        >
          {data.totalSubmissions}
        </span>
      </div>

      {/* Submissions over time */}
      <div className="border border-border rounded-sm p-4 mb-3">
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

      {/* Per-block analytics */}
      {data.blockAnalytics.map(block => (
        <BlockAnalyticsCard
          key={block.blockIndex}
          block={block}
        />
      ))}
    </div>
  );
};

const BlockAnalyticsCard = ({ block }: { block: BlockAnalyticsItem }) => {
  const { type, title, analytics } = block;

  return (
    <div className="border border-border rounded-sm p-4 mb-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{title}</p>

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
          const width = `${(count / maxCount) * 100}%`;
          return (
            <div
              key={star}
              className="flex items-center gap-2"
            >
              <span className="text-xs w-3 text-muted-foreground">{star}</span>
              <div className="flex-1 h-2 bg-muted rounded-sm overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width }}
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
