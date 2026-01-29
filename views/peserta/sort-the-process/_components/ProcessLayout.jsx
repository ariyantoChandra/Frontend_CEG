import { ArrowRight, ArrowDown } from "lucide-react";
import ProcessRow from "./ProcessRow";
import { getProcessLabels } from "../constants/processLabels";

export default function ProcessLayout({
  processesConfig,
  selectedQuestion,
  placements,
  items,
  onItemClick,
  getItemById,
  isSubmitted,
}) {
  if (!processesConfig || processesConfig.length === 0) return null;
  if (!selectedQuestion) return null;

  const renderProcessPair = (process1, process2, connectingLabel, connectingLabels) => {
    const labels1 = getProcessLabels(process1.id, selectedQuestion.id);
    const labels2 = process2 ? getProcessLabels(process2.id, selectedQuestion.id) : null;
    const placedItem1 = placements[process1.slotId] ? getItemById(placements[process1.slotId]) : null;
    const placedItem2 = process2 && placements[process2.slotId] ? getItemById(placements[process2.slotId]) : null;

    return (
      <div className="flex flex-col items-center gap-2 sm:gap-4 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full justify-center">
          <div className="w-full sm:flex-1 flex justify-center">
            <ProcessRow
              process={process1}
              labels={labels1}
              placedItem={placedItem1}
              items={items}
              onItemClick={onItemClick}
              hideRightOutput={true}
              hideLeftInput={false}
              isWide={false}
              disabled={isSubmitted}
            />
          </div>

          {connectingLabel && (
            <>
              <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
              <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
            </>
          )}

          {connectingLabel && (
            <div className="flex items-center">
              <span className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                {connectingLabel}
              </span>
            </div>
          )}

          {connectingLabels && connectingLabels.length > 0 && (
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              {connectingLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {connectingLabel && (
            <>
              <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
              <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
            </>
          )}

          {connectingLabels && connectingLabels.length > 0 && (
            <>
              <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
              <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
            </>
          )}

          {process2 && (
            <div className="w-full sm:flex-1 flex justify-center">
              <ProcessRow
                process={process2}
                labels={labels2}
                placedItem={placedItem2}
                items={items}
                onItemClick={onItemClick}
                hideRightOutput={false}
                hideLeftInput={true}
                isWide={false}
                disabled={isSubmitted}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {processesConfig.map((process, index) => {
        const labels = getProcessLabels(process.id, selectedQuestion.id);
        const placedItem = placements[process.slotId] ? getItemById(placements[process.slotId]) : null;
        const isLast = index === processesConfig.length - 1;
        const isProcess2 = process.id === 2;
        const isProcess3 = process.id === 3;
        const isProcess4 = process.id === 4;
        const isProcess5 = process.id === 5;
        const nextProcess = processesConfig[index + 1];
        const isNextProcess3 = nextProcess?.id === 3;
        const isNextProcess5 = nextProcess?.id === 5;

        if (isProcess2) {
          const process3 = processesConfig.find(p => p.id === 3);
          const connectingLabel = labels.outputs && labels.outputs.length > 0 ? labels.outputs[0] : null;

          return (
            <div key={`process-2-3`} className="flex flex-col items-center gap-2 sm:gap-4 w-full">
              {renderProcessPair(process, process3, connectingLabel, null)}
              {!isLast && !isNextProcess3 && (
                <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
              )}
            </div>
          );
        }

        if (isProcess3) {
          return null;
        }

        if (isProcess4) {
          const process5 = processesConfig.find(p => p.id === 5);
          const connectingLabels = labels.outputs && labels.outputs.length > 0 ? labels.outputs : null;

          return (
            <div key={`process-4-5`} className="flex flex-col items-center gap-2 sm:gap-4 w-full">
              {renderProcessPair(process, process5, null, connectingLabels)}
              {!isLast && !isNextProcess5 && (
                <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
              )}
            </div>
          );
        }

        if (isProcess5) {
          return null;
        }
        
        const isProcess1 = process.id === 1;
        const isProcess6 = process.id === 6;
        const isWideProcess = isProcess1 || isProcess6;

        return (
          <div key={process.id} className="flex flex-col items-center gap-2 sm:gap-4 w-full">
            <ProcessRow
              process={process}
              labels={labels}
              placedItem={placedItem}
              items={items}
              onItemClick={onItemClick}
              hideRightOutput={false}
              hideLeftInput={false}
              isWide={isWideProcess}
              disabled={isSubmitted}
            />
            {!isLast && (
              <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            )}
          </div>
        );
      })}
    </div>
  );
}
