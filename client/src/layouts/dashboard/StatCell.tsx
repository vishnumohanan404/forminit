import { Skeleton } from "@/components/ui/skeleton";

interface StatCellProps {
  label: string;
  value: number;
  loading: boolean;
}

const StatCell = ({ label, value, loading }: StatCellProps) => {
  return (
    <div className="p-4 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
      )}
    </div>
  );
};

export default StatCell;
