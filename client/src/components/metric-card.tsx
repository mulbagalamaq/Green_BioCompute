import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, unit, trend, trendLabel, icon }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return "";
    if (trend > 0) return "text-destructive";
    if (trend < 0) return "text-chart-5";
    return "text-muted-foreground";
  };

  return (
    <Card data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
          {unit && <span className="text-lg font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs mt-1", getTrendColor())}>
            {getTrendIcon()}
            <span data-testid={`text-trend-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {Math.abs(trend)}% {trendLabel || "from last month"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
