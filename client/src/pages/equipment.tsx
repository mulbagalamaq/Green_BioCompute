import { useState } from "react";
import { EquipmentCard } from "@/components/equipment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import type { Equipment as EquipmentType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import freezerImg from "@assets/generated_images/Ultra-low_temperature_lab_freezer_15b3eda4.png";
import incubatorImg from "@assets/generated_images/Laboratory_CO2_incubator_equipment_0bc4c59b.png";
import { EmptyState } from "@/components/empty-state";

function getEquipmentImage(type: string) {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("freezer") || lowerType.includes("ult")) {
    return freezerImg;
  }
  if (lowerType.includes("incubator")) {
    return incubatorImg;
  }
  return undefined;
}

function getEquipmentStatus(name: string): "active" | "idle" | "maintenance" | "offline" {
  return "active";
}

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);

  const { data: equipment, isLoading } = useQuery<EquipmentType[]>({
    queryKey: ["/api/equipment"],
  });

  const filteredEquipment = equipment?.filter((eq) =>
    eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Equipment Inventory</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Equipment Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your wet lab equipment
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search equipment by name, type, or category..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-equipment"
        />
      </div>

      {filteredEquipment.length === 0 && !isLoading ? (
        <EmptyState 
          title="No equipment found"
          description="Upload a CSV file from the Data Upload page to get started"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <EquipmentCard
              key={eq.id}
              id={eq.id}
              name={eq.name}
              type={eq.type}
              manufacturer={eq.manufacturer || "Unknown"}
              status={getEquipmentStatus(eq.name)}
              powerConsumption={parseFloat(eq.carbon_footprint_kg) / 365 / 24}
              dailyEmissions={parseFloat(eq.annual_carbon_impact_kg) / 365}
              imageUrl={getEquipmentImage(eq.type)}
              onViewDetails={() => setSelectedEquipment(eq)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">{selectedEquipment?.name}</DialogTitle>
            <DialogDescription>
              {selectedEquipment?.manufacturer || "Unknown"} • {selectedEquipment?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEquipment && getEquipmentImage(selectedEquipment.type) && (
              <img
                src={getEquipmentImage(selectedEquipment.type)}
                alt={selectedEquipment.name}
                className="w-full h-64 object-cover rounded-md"
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Carbon Footprint</p>
                <p className="text-lg font-semibold">{selectedEquipment?.carbon_footprint_kg} kgCO₂e</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Carbon Impact</p>
                <p className="text-lg font-semibold">{selectedEquipment?.annual_carbon_impact_kg} kgCO₂e/year</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Usage</p>
                <p className="text-lg font-semibold">{selectedEquipment?.annual_usage_hours} hours</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-lg font-semibold">{selectedEquipment?.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">API Available</p>
                <p className="text-lg font-semibold">
                  {selectedEquipment?.has_api ? `Yes (${selectedEquipment.api_vendor})` : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment ID</p>
                <p className="text-lg font-mono text-xs">{selectedEquipment?.id}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
