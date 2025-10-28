import { MetricCard } from "@/components/metric-card";
import { EmissionsChart } from "@/components/emissions-chart";
import { EquipmentBreakdownChart } from "@/components/equipment-breakdown-chart";
import { Activity, Package, Zap, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Equipment } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const totalEquipment = equipment?.length || 0;
  const totalEmissions = equipment?.reduce((sum, eq) => 
    sum + parseFloat(eq.annual_carbon_impact_kg || "0"), 0
  ) || 0;
  
  const topEmitters = equipment
    ?.sort((a, b) => parseFloat(b.annual_carbon_impact_kg) - parseFloat(a.annual_carbon_impact_kg))
    .slice(0, 5)
    .map(eq => ({
      name: eq.name,
      emissions: parseFloat(eq.annual_carbon_impact_kg),
    })) || [];

  const mockEmissionsData = [
    { date: "Jan", emissions: totalEmissions > 0 ? totalEmissions * 0.85 : 45 },
    { date: "Feb", emissions: totalEmissions > 0 ? totalEmissions * 0.92 : 52 },
    { date: "Mar", emissions: totalEmissions > 0 ? totalEmissions * 0.88 : 48 },
    { date: "Apr", emissions: totalEmissions > 0 ? totalEmissions * 1.08 : 61 },
    { date: "May", emissions: totalEmissions > 0 ? totalEmissions * 0.95 : 55 },
    { date: "Jun", emissions: totalEmissions > 0 ? totalEmissions : 43 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time wet lab equipment emissions monitoring
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

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
          value={(totalEmissions / 1000).toFixed(1)}
          unit="tCO₂e"
          trend={totalEquipment > 0 ? -12 : 0}
          trendLabel="estimated annual"
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Equipment"
          value={totalEquipment.toString()}
          trend={0}
          icon={<Package className="h-4 w-4" />}
        />
        <MetricCard
          title="Equipment Monitored"
          value={totalEquipment.toString()}
          unit="items"
          trend={0}
          trendLabel="in database"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <MetricCard
          title="Avg Carbon Impact"
          value={totalEquipment > 0 ? (totalEmissions / totalEquipment / 1000).toFixed(1) : "0"}
          unit="tCO₂e"
          trend={0}
          icon={<Zap className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmissionsChart data={mockEmissionsData} title="Estimated Monthly Emissions Trend" />
        <EquipmentBreakdownChart data={topEmitters.length > 0 ? topEmitters : [
          { name: "No data", emissions: 0 }
        ]} />
      </div>
    </div>
  );
}
