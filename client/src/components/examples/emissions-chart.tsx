import { EmissionsChart } from "../emissions-chart";

const mockData = [
  { date: "Jan", emissions: 45 },
  { date: "Feb", emissions: 52 },
  { date: "Mar", emissions: 48 },
  { date: "Apr", emissions: 61 },
  { date: "May", emissions: 55 },
  { date: "Jun", emissions: 43 },
];

export default function EmissionsChartExample() {
  return (
    <div className="p-6">
      <EmissionsChart data={mockData} title="Monthly Emissions Trend" />
    </div>
  );
}
