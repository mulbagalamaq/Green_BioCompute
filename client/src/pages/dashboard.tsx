import { MetricCard } from "@/components/metric-card";
import { AlertPanel } from "@/components/alert-panel";
import { EmissionsChart } from "@/components/emissions-chart";
import { EquipmentBreakdownChart } from "@/components/equipment-breakdown-chart";
import { Activity, Package, Zap, TrendingDown } from "lucide-react";

// TODO: Remove mock data
const mockEmissionsData = [
  { date: "Jan", emissions: 45 },
  { date: "Feb", emissions: 52 },
  { date: "Mar", emissions: 48 },
  { date: "Apr", emissions: 61 },
  { date: "May", emissions: 55 },
  { date: "Jun", emissions: 43 },
];

const mockEquipmentData = [
  { name: "ULT Freezer -80°C", emissions: 120 },
  { name: "CO2 Incubator", emissions: 58 },
  { name: "Biosafety Cabinet", emissions: 20 },
  { name: "Autoclave", emissions: 12 },
  { name: "PCR Machine", emissions: 8 },
];

const mockAlerts = [
  {
    id: "1",
    type: "maintenance" as const,
    title: "Freezer Efficiency Degradation Detected",
    description: "ULT-80-001 showing 15% increase in power consumption",
    equipmentName: "ULT Freezer -80°C #001",
    impact: "4,000 kgCO₂e/year",
  },
  {
    id: "2",
    type: "optimization" as const,
    title: "Consolidation Opportunity",
    description: "3 incubators running at <40% capacity",
    equipmentName: "CO2 Incubators Lab B",
    impact: "2,100 kgCO₂e/year",
  },
  {
    id: "3",
    type: "warning" as const,
    title: "BMS Connection Lost",
    description: "Building management system offline since 14:30",
    equipmentName: "Facility A - Floor 3",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time wet lab equipment emissions monitoring
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Emissions"
          value="43.2"
          unit="tCO₂e"
          trend={-12}
          trendLabel="vs last month"
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Equipment"
          value="127"
          trend={3}
          icon={<Package className="h-4 w-4" />}
        />
        <MetricCard
          title="Efficiency Score"
          value="84"
          unit="/100"
          trend={-5}
          trendLabel="improvement"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <MetricCard
          title="Monthly Consumption"
          value="168"
          unit="MWh"
          trend={8}
          icon={<Zap className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmissionsChart data={mockEmissionsData} title="Monthly Emissions Trend" />
        <EquipmentBreakdownChart data={mockEquipmentData} />
      </div>

      <AlertPanel alerts={mockAlerts} />
    </div>
  );
}
