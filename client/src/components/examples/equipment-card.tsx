import { EquipmentCard } from "../equipment-card";
import freezerImg from "@assets/generated_images/Ultra-low_temperature_lab_freezer_15b3eda4.png";

export default function EquipmentCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <EquipmentCard
        id="ult-001"
        name="ULT Freezer -80°C #001"
        type="Ultra-Low Freezer"
        manufacturer="Thermo Fisher Scientific"
        status="active"
        powerConsumption={5.0}
        dailyEmissions={120}
        imageUrl={freezerImg}
        onViewDetails={() => console.log("View details clicked")}
      />
    </div>
  );
}
