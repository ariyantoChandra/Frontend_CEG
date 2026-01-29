import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { colorClasses } from "../utils/colorClasses";

export default function EquipmentCard({
  equipment,
  isDisabled,
  onClick,
}) {
  const colorClass = colorClasses[equipment.color] || colorClasses.blue;

  return (
    <Card
      className={`group relative border-2 ${colorClass.border} ${colorClass.bg} backdrop-blur-xl transition-all ${isDisabled
        ? "cursor-not-allowed opacity-50"
        : `cursor-pointer ${colorClass.hover} hover:shadow-lg`
        }`}
      onClick={() => !isDisabled && onClick(equipment)}
    >

      <CardContent className="flex flex-col items-center justify-center p-8">
        {equipment.image && (
          <div className="relative mb-4 h-32 w-32 shrink-0 overflow-hidden">
            <Image
              src={equipment.image}
              alt={equipment.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
