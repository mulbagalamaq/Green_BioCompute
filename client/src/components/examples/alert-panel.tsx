import { AlertPanel } from "../alert-panel";

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
];

export default function AlertPanelExample() {
  return (
    <div className="p-6 max-w-2xl">
      <AlertPanel alerts={mockAlerts} />
    </div>
  );
}
