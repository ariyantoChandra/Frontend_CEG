import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AlertMessages({ error, submitSuccess }) {
    return (
        <>
            {error && (
                <Alert className="mb-6 border-red-500/50 bg-red-500/10 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {submitSuccess && (
                <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                        Data berhasil disimpan! Mengarahkan kembali...
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
}
