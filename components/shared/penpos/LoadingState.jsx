import { Loader2 } from "lucide-react";

export default function LoadingState() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950">
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
                <p className="mt-4 text-zinc-400">Memuat data tim...</p>
            </div>
        </div>
    );
}
