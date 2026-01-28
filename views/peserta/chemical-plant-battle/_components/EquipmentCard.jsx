import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { colorClasses } from "../utils/colorClasses";

export default function EquipmentCard({
  equipment,
  isCompleted,
  isDisabled,
  onClick,
}) {
  const Icon = equipment.icon;
  const colorClass = colorClasses[equipment.color] || colorClasses.blue;

  return (
    <Card
      className={`group relative border-2 ${colorClass.border} ${colorClass.bg} backdrop-blur-xl transition-all ${
        isDisabled || isCompleted
          ? "cursor-not-allowed opacity-50"
          : `cursor-pointer ${colorClass.hover} hover:shadow-lg`
      }`}
      onClick={() => !isDisabled && !isCompleted && onClick(equipment)}
    >
      {isCompleted && (
        <div className="absolute right-2 top-2 z-10">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
        </div>
      )}

      <CardContent className="flex flex-col items-center justify-center p-8">
        <div
          className={`mb-4 rounded-full ${colorClass.bg} p-6 transition-transform ${
            !isDisabled && !isCompleted ? "group-hover:scale-110" : ""
          }`}
        >
          <Icon className={`h-12 w-12 ${colorClass.text}`} />
        </div>
        <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
      </CardContent>
    </Card>
  );
}
