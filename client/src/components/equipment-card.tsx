import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  status: "active" | "idle" | "offline" | "maintenance";
  powerConsumption: number;
  dailyEmissions: number;
  imageUrl?: string;
  onViewDetails?: () => void;
}

const statusConfig = {
  active: { label: "Active", color: "bg-chart-5 text-white" },
  idle: { label: "Idle", color: "bg-chart-4 text-white" },
  offline: { label: "Offline", color: "bg-muted text-muted-foreground" },
  maintenance: { label: "Maintenance", color: "bg-destructive text-destructive-foreground" },
};

export function EquipmentCard({
  id,
  name,
  type,
  manufacturer,
  status,
  powerConsumption,
  dailyEmissions,
  imageUrl,
  onViewDetails,
}: EquipmentCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover-elevate" data-testid={`card-equipment-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate" data-testid={`text-equipment-name-${id}`}>
            {name}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{manufacturer}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" data-testid={`button-equipment-menu-${id}`}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {type}
          </Badge>
          <Badge className={cn("text-xs", statusInfo.color)} data-testid={`badge-status-${id}`}>
            {statusInfo.label}
          </Badge>
        </div>

        {imageUrl && (
          <div className="aspect-video rounded-md bg-muted overflow-hidden">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Power Draw</span>
            </div>
            <span className="font-mono font-medium" data-testid={`text-power-${id}`}>
              {powerConsumption} kW
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Daily Emissions</span>
            </div>
            <span className="font-mono font-medium" data-testid={`text-emissions-${id}`}>
              {dailyEmissions} kgCO₂e
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onViewDetails}
          data-testid={`button-view-details-${id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
