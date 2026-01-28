import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ERROR_TYPES } from "../constants/gameConfig";

export default function ErrorDialog({ isOpen, errorType, onClose }) {
  const getTitle = () => {
    return errorType === ERROR_TYPES.EQUIPMENT
      ? "Alat yang dipilih salah"
      : "Jawaban salah";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="border-white/10 bg-zinc-900/95 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-rose-400">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-300">
            Anda akan terhenti selama 7 detik
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end">
          <AlertDialogAction
            onClick={onClose}
            className="bg-rose-500 text-white hover:bg-rose-600"
          >
            OK
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
