import { EmptyState } from "@/components/empty-state";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Advanced emissions analytics and insights
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Analytics Dashboard Coming Soon"
        description="Advanced analytics features including predictive forecasting, peer benchmarking, and AI-powered optimization insights will be available here."
        actionLabel="Learn More"
        onAction={() => console.log("Learn more clicked")}
      />
    </div>
  );
}
