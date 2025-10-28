import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface UploadStatus {
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
  equipmentCount?: number;
}

export default function DataUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: "idle" });
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/equipment/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return await res.json();
    },
    onSuccess: (data: any) => {
      setUploadStatus({
        status: "success",
        message: `Successfully uploaded ${data.count} equipment items`,
        equipmentCount: data.count,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Upload successful",
        description: `${data.count} equipment items have been imported`,
      });
      setFile(null);
    },
    onError: (error: Error) => {
      setUploadStatus({
        status: "error",
        message: error.message || "Failed to upload file",
      });
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setUploadStatus({ status: "idle" });
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus({ status: "uploading" });
    uploadMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Data Upload</h1>
        <p className="text-muted-foreground mt-1">
          Import equipment data from CSV files
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Equipment Data</CardTitle>
            <CardDescription>
              Upload a CSV file containing equipment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover-elevate"
                data-testid="label-file-upload"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV files only</p>
                  {file && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  data-testid="input-file-upload"
                />
              </label>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || uploadStatus.status === "uploading"}
              className="w-full"
              data-testid="button-upload"
            >
              {uploadStatus.status === "uploading" ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </>
              )}
            </Button>

            {uploadStatus.status === "success" && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-chart-5/10 border border-chart-5/20">
                <CheckCircle2 className="h-5 w-5 text-chart-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-chart-5">Upload Successful</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {uploadStatus.message}
                  </p>
                </div>
              </div>
            )}

            {uploadStatus.status === "error" && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Upload Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {uploadStatus.message}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Format Requirements</CardTitle>
            <CardDescription>
              Your CSV file should include these columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Required Columns:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Category (e.g., "Laboratory Equipment")</li>
                  <li>Equipment/Process (equipment name)</li>
                  <li>Carbon Footprint (kgCO2e)</li>
                  <li>Annual Usage (hours/runs)</li>
                  <li>Annual Carbon Impact (kgCO2e)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Optional Columns:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Equipment Type</li>
                  <li>Manufacturer</li>
                  <li>Has API (Yes/No)</li>
                  <li>API Vendor</li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded-md mt-4">
                <p className="font-medium mb-2">Example:</p>
                <code className="text-xs">
                  Category,Equipment/Process,Carbon Footprint (kgCO2e),...
                  <br />
                  Laboratory Equipment,ULT Freezer -80°C,5000,8760,43800
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
