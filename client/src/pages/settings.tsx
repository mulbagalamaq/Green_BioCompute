import { EmptyState } from "@/components/empty-state";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and platform preferences
        </p>
      </div>

      <EmptyState
        icon={SettingsIcon}
        title="Settings Coming Soon"
        description="Configure facility hierarchies, user permissions, alert thresholds, and API credentials. Customize your emissions tracking workflows."
        actionLabel="View Documentation"
        onAction={() => console.log("Documentation clicked")}
      />
    </div>
  );
}
