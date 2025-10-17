import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar } from "lucide-react";

// TODO: Remove mock data
const reportTemplates = [
  {
    id: "ghg",
    name: "GHG Protocol Compliance Report",
    description: "Greenhouse Gas Protocol compliant emissions reporting",
    scope: "Scope 1, 2, 3",
    frequency: "Monthly",
  },
  {
    id: "iso",
    name: "ISO 14064 Carbon Report",
    description: "International standard for GHG quantification and reporting",
    scope: "All Scopes",
    frequency: "Quarterly",
  },
  {
    id: "csrd",
    name: "CSRD Sustainability Report",
    description: "Corporate Sustainability Reporting Directive compliance",
    scope: "All Scopes",
    frequency: "Annual",
  },
  {
    id: "combined",
    name: "Combined Wet Lab + Dry Lab Report",
    description: "Unified facility emissions including computational workloads",
    scope: "All Sources",
    frequency: "Monthly",
  },
];

const recentReports = [
  {
    id: "1",
    name: "October 2025 - Wet Lab Emissions",
    date: "Nov 1, 2025",
    type: "GHG Protocol",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Q3 2025 - Combined Facility Report",
    date: "Oct 15, 2025",
    type: "Combined",
    size: "5.8 MB",
  },
  {
    id: "3",
    name: "September 2025 - Wet Lab Emissions",
    date: "Oct 1, 2025",
    type: "GHG Protocol",
    size: "2.3 MB",
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">ESG Reporting</h1>
        <p className="text-muted-foreground mt-1">
          Generate regulatory-compliant emissions reports
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Report Templates</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="hover-elevate" data-testid={`card-template-${template.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base" data-testid={`text-template-name-${template.id}`}>
                      {template.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{template.description}</CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{template.scope}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {template.frequency}
                  </Badge>
                </div>
                <Button variant="default" className="w-full" data-testid={`button-generate-${template.id}`}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 hover-elevate"
                  data-testid={`row-report-${report.id}`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" data-testid={`text-report-name-${report.id}`}>
                        {report.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{report.date}</p>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="secondary" className="text-xs">{report.type}</Badge>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{report.size}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" data-testid={`button-download-${report.id}`}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
