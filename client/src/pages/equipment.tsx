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
import freezerImg from "@assets/generated_images/Ultra-low_temperature_lab_freezer_15b3eda4.png";
import incubatorImg from "@assets/generated_images/Laboratory_CO2_incubator_equipment_0bc4c59b.png";

// TODO: Remove mock data
const mockEquipment = [
  {
    id: "ult-001",
    name: "ULT Freezer -80°C #001",
    type: "Ultra-Low Freezer",
    manufacturer: "Thermo Fisher Scientific",
    status: "active" as const,
    powerConsumption: 5.0,
    dailyEmissions: 120,
    imageUrl: freezerImg,
  },
  {
    id: "inc-001",
    name: "CO2 Incubator #001",
    type: "CO2 Incubator",
    manufacturer: "Eppendorf",
    status: "active" as const,
    powerConsumption: 0.8,
    dailyEmissions: 19.2,
    imageUrl: incubatorImg,
  },
  {
    id: "ult-002",
    name: "ULT Freezer -80°C #002",
    type: "Ultra-Low Freezer",
    manufacturer: "Thermo Fisher Scientific",
    status: "idle" as const,
    powerConsumption: 4.8,
    dailyEmissions: 115,
    imageUrl: freezerImg,
  },
  {
    id: "bsc-001",
    name: "Biosafety Cabinet Class II",
    type: "Biosafety Cabinet",
    manufacturer: "Baker Company",
    status: "active" as const,
    powerConsumption: 0.1,
    dailyEmissions: 6.6,
  },
  {
    id: "auto-001",
    name: "Autoclave Steam Sterilizer",
    type: "Autoclave",
    manufacturer: "STERIS",
    status: "maintenance" as const,
    powerConsumption: 1.5,
    dailyEmissions: 4.1,
  },
  {
    id: "pcr-001",
    name: "PCR Thermal Cycler",
    type: "PCR Machine",
    manufacturer: "Bio-Rad",
    status: "offline" as const,
    powerConsumption: 0.4,
    dailyEmissions: 2.7,
  },
];

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<typeof mockEquipment[0] | null>(null);

  const filteredEquipment = mockEquipment.filter((eq) =>
    eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Equipment Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your wet lab equipment
          </p>
        </div>
        <Button data-testid="button-add-equipment">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search equipment by name or type..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-equipment"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((equipment) => (
          <EquipmentCard
            key={equipment.id}
            {...equipment}
            onViewDetails={() => setSelectedEquipment(equipment)}
          />
        ))}
      </div>

      <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">{selectedEquipment?.name}</DialogTitle>
            <DialogDescription>
              {selectedEquipment?.manufacturer} • {selectedEquipment?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEquipment?.imageUrl && (
              <img
                src={selectedEquipment.imageUrl}
                alt={selectedEquipment.name}
                className="w-full h-64 object-cover rounded-md"
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Power Consumption</p>
                <p className="text-lg font-semibold">{selectedEquipment?.powerConsumption} kW</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Emissions</p>
                <p className="text-lg font-semibold">{selectedEquipment?.dailyEmissions} kgCO₂e</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold capitalize">{selectedEquipment?.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment ID</p>
                <p className="text-lg font-mono">{selectedEquipment?.id}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
