import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AlertMessages({ error, submitSuccess, validationWarning }) {
    return (
        <>
            {error && (
                <Alert className="mb-6 border-red-500/50 bg-red-500/10 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {validationWarning && (
                <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10 text-yellow-400">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationWarning}</AlertDescription>
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
