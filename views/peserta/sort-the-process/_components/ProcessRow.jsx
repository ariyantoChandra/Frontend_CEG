import { ArrowRight, ArrowDown } from "lucide-react";
import ProcessBox from "./ProcessBox";

export default function ProcessRow({
  process,
  labels,
  placedItem,
  items,
  onItemClick,
  hideRightOutput = false,
  hideLeftInput = false,
  isWide = false,
  disabled = false,
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {labels.inputTop && (
        <div className="mb-2">
          <span className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
            {labels.inputTop}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-4 w-full justify-center flex-wrap">
        {!hideLeftInput && labels.inputs && labels.inputs.length > 0 && (
          <div className="flex flex-col gap-1 sm:gap-2">
            {labels.inputs.map((input, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-xs text-zinc-400 bg-zinc-800/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
              >
                {input}
              </span>
            ))}
          </div>
        )}

        {!hideLeftInput && labels.inputs && labels.inputs.length > 0 && (
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
        )}

        <ProcessBox
          slotId={process.slotId}
          label={process.label}
          placedItem={placedItem}
          items={items}
          onItemClick={onItemClick}
          isWide={isWide}
          disabled={disabled}
        />

        {!hideRightOutput && labels.outputs && labels.outputs.length > 0 && (
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
        )}

        {!hideRightOutput && labels.outputs && labels.outputs.length > 0 && (
          <div className="flex flex-col gap-1 sm:gap-2">
            {labels.outputs.map((output, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
              >
                {output}
              </span>
            ))}
          </div>
        )}
      </div>

      {labels.waste && labels.waste.length > 0 && (
        <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
          <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
          {labels.waste.map((waste, idx) => (
            <span
              key={idx}
              className="text-[10px] sm:text-xs text-red-400 bg-red-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
            >
              {waste}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
