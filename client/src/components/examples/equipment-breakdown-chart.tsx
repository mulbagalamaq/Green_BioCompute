import { EquipmentBreakdownChart } from "../equipment-breakdown-chart";

const mockData = [
  { name: "ULT Freezer -80°C", emissions: 120 },
  { name: "CO2 Incubator", emissions: 58 },
  { name: "Biosafety Cabinet", emissions: 20 },
  { name: "Autoclave", emissions: 12 },
  { name: "PCR Machine", emissions: 8 },
];

export default function EquipmentBreakdownChartExample() {
  return (
    <div className="p-6">
      <EquipmentBreakdownChart data={mockData} />
    </div>
  );
}
