import { MetricCard } from "../metric-card";
import { Activity } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="p-6">
      <MetricCard
        title="Total Emissions"
        value="43.2"
        unit="tCO₂e"
        trend={-12}
        trendLabel="vs last month"
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  );
}
