import { Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";

export default function SubmitButtonSection({
    isValid,
    submitting,
    onSubmit,
}) {
    return (
        <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardFooter className="pt-6">
                <Button
                    onClick={onSubmit}
                    disabled={!isValid || submitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        <>
                            Selesai & Simpan
                            <Trophy className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
