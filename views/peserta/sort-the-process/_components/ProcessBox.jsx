import { memo } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProcessBox = memo(({ slotId, label, placedItem, items, onItemClick, isWide = false, disabled = false }) => {
  const baseClasses = `relative flex min-h-[100px] sm:min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 sm:p-4 ${
    isWide ? 'w-full max-w-[600px] sm:w-[600px] sm:min-w-[600px]' : 'w-full max-w-[300px] sm:w-[300px] sm:min-w-[300px]'
  }`;

  const labelBadge = (
    <div className="absolute -top-2 sm:-top-3 left-2 sm:left-3 rounded-full border border-white/10 bg-zinc-900 px-2 sm:px-3 py-0.5 sm:py-1">
      <span className="text-[10px] sm:text-xs font-medium text-cyan-400">
        {label}
      </span>
    </div>
  );

  const placedItemContent = (
    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
      <div className="rounded-full bg-cyan-500/20 p-2 sm:p-3">
        <span className="text-xl sm:text-2xl">🔧</span>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-white text-center px-2">
        {placedItem?.name}
      </span>
      <span className="text-[10px] sm:text-xs text-zinc-400">
        {disabled ? 'Tidak dapat diubah' : 'Klik untuk mengganti'}
      </span>
    </div>
  );

  const emptyContent = (
    <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-zinc-500">
      <div className="rounded-full border-2 border-dashed border-zinc-700 p-2 sm:p-3">
        <div className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
      <span className="text-[10px] sm:text-xs">
        {disabled ? 'Tidak dapat dipilih' : 'Klik untuk memilih'}
      </span>
    </div>
  );

  if (disabled) {
    return (
      <button
        disabled={true}
        className={`${baseClasses} border-white/10 bg-zinc-900/20 cursor-not-allowed opacity-60`}
      >
        {labelBadge}
        {placedItem ? placedItemContent : emptyContent}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`${baseClasses} border-white/20 bg-zinc-900/30 transition-all hover:border-cyan-500/50 hover:bg-zinc-900/50`}
        >
          {labelBadge}
          {placedItem ? placedItemContent : emptyContent}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 max-h-[300px] overflow-y-auto">
        {items?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onItemClick(item.id, slotId)}
          >
            {item?.name}
            {placedItem?.id === item.id && (
              <CheckCircle2 className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ProcessBox.displayName = "ProcessBox";

export default ProcessBox;
