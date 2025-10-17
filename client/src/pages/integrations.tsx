import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Settings2 } from "lucide-react";
import apiSuccessImg from "@assets/generated_images/API_integration_illustration_success_51e694b4.png";

// TODO: Remove mock data
const integrations = [
  {
    id: "bms",
    name: "Building Management System",
    provider: "Johnson Controls",
    status: "connected",
    description: "Real-time facility-level power consumption data",
    lastSync: "2 minutes ago",
    equipmentCount: 45,
  },
  {
    id: "lims",
    name: "Laboratory Information Management",
    provider: "Benchling",
    status: "connected",
    description: "Equipment usage tracking and experiment correlation",
    lastSync: "5 minutes ago",
    equipmentCount: 38,
  },
  {
    id: "thermo",
    name: "Equipment Manufacturer API",
    provider: "Thermo Fisher Scientific",
    status: "disconnected",
    description: "Direct equipment telemetry and diagnostics",
    lastSync: "Never",
    equipmentCount: 0,
  },
  {
    id: "eppendorf",
    name: "Equipment Manufacturer API",
    provider: "Eppendorf",
    status: "connected",
    description: "Real-time equipment performance metrics",
    lastSync: "1 minute ago",
    equipmentCount: 12,
  },
];

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">API Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Manage connections to BMS, LIMS, and equipment manufacturer APIs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Health</CardTitle>
            <CardDescription>Overall system connectivity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <img src={apiSuccessImg} alt="API Integration" className="w-48 h-48 object-contain" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Connections</span>
                <span className="font-semibold">3 / 4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Equipment Monitored</span>
                <span className="font-semibold">95 devices</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Points/Hour</span>
                <span className="font-semibold">~12,400</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id} data-testid={`card-integration-${integration.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base" data-testid={`text-integration-name-${integration.id}`}>
                      {integration.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{integration.provider}</CardDescription>
                  </div>
                  {integration.status === "connected" ? (
                    <CheckCircle2 className="h-5 w-5 text-chart-5 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Sync</p>
                    <p className="text-sm font-medium" data-testid={`text-last-sync-${integration.id}`}>
                      {integration.lastSync}
                    </p>
                  </div>
                  <Badge
                    variant={integration.status === "connected" ? "default" : "secondary"}
                    className={integration.status === "connected" ? "bg-chart-5" : ""}
                    data-testid={`badge-status-${integration.id}`}
                  >
                    {integration.equipmentCount} devices
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-testid={`button-configure-${integration.id}`}
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
