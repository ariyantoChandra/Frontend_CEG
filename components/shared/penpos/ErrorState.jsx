import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ErrorState({ fetchError, userPenpos, router }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
            <Card className="border-red-500/50 bg-red-500/10 p-6">
                <Alert className="border-0 bg-transparent text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {fetchError ? "Gagal memuat data tim" : "Data pos tidak ditemukan"}
                    </AlertDescription>
                </Alert>
                <Button
                    onClick={() => router.push("/pos")}
                    className="mt-4 w-full"
                    variant="outline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
            </Card>
        </div>
    );
}
