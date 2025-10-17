import { EmptyState } from "../empty-state";
import { Package } from "lucide-react";

export default function EmptyStateExample() {
  return (
    <div className="p-6">
      <EmptyState
        icon={Package}
        title="No Equipment Found"
        description="Get started by adding your first piece of lab equipment to track emissions and optimize energy consumption."
        actionLabel="Add Equipment"
        onAction={() => console.log("Add equipment clicked")}
      />
    </div>
  );
}
