import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WelcomeDialog({ isOpen, onClose, equipmentName }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="border-white/10 bg-zinc-900/95 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-white">
            {equipmentName || "Alat"} mengalami masalah !
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-300">
            Silakan pilih peralatan yang sesuai
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end">
          <AlertDialogAction
            onClick={onClose}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
          >
            Next
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
