import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ErrorState({ message = "Gagal memuat data. Silakan coba lagi." }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Alert className="border-red-500/50 bg-red-500/10 text-red-400">
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
