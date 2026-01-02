import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function SubmitButton({ isSubmitting, isValid, onClick }) {
    return (
        <Button
            onClick={onClick}
            disabled={isSubmitting || !isValid}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-6 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50"
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                </>
            ) : (
                <>
                    Pilih Tim & Mulai
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </>
            )}
        </Button>
    );
}
