import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const HomeStatsCard = ({ isLoading }: { isLoading: boolean }) => {
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      // color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      {isLoading ? (
        <>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Skeleton className="h-8 w-[250px] rounded-xl" />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="pb-7">
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <ChartContainer
              config={chartConfig}
              className="h-[110px] w-[256px]"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={value => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="desktop"
                  type="natural"
                  // stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default HomeStatsCard;
