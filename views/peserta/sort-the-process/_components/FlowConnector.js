import { ArrowRight } from "lucide-react";

export default function FlowConnector({ direction = "right" }) {
  if (direction === "right") {
    return (
      <div className="flex items-center justify-center">
        <ArrowRight className="h-6 w-6 text-cyan-400/50" />
      </div>
    );
  }
  if (direction === "down") {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-400/50 to-transparent"></div>
      </div>
    );
  }
  return null;
}
