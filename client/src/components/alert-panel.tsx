import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb, Wrench, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "maintenance" | "optimization" | "warning";
  title: string;
  description: string;
  equipmentName: string;
  impact?: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  maintenance: {
    icon: Wrench,
    color: "text-chart-4 bg-chart-4/10",
    badgeColor: "bg-chart-4 text-white",
  },
  optimization: {
    icon: Lightbulb,
    color: "text-chart-5 bg-chart-5/10",
    badgeColor: "bg-chart-5 text-white",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-destructive bg-destructive/10",
    badgeColor: "bg-destructive text-destructive-foreground",
  },
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Predictive Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No alerts at this time</p>
        ) : (
          alerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className="flex gap-3 p-3 rounded-md hover-elevate border"
                data-testid={`alert-${alert.id}`}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", config.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium leading-none" data-testid={`text-alert-title-${alert.id}`}>
                      {alert.title}
                    </h4>
                    <Badge className={cn("text-xs shrink-0", config.badgeColor)}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.equipmentName}</p>
                  <p className="text-sm">{alert.description}</p>
                  {alert.impact && (
                    <p className="text-xs font-medium text-chart-5">
                      Potential savings: {alert.impact}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" data-testid={`button-alert-action-${alert.id}`}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
