import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageUrl?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  imageUrl,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4" data-testid="empty-state">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-64 h-48 object-contain mb-6 opacity-50" />
      ) : Icon ? (
        <div className="rounded-full bg-muted p-6 mb-6">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6" data-testid="text-empty-description">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} data-testid="button-empty-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
