import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from "lucide-react";

export default function TeamResultCard({ teamData, onStatusChange }) {
    return (
        <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-xl text-white">
                    {teamData.teamName}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Tentukan status akhir tim ini
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={teamData.status}
                    onValueChange={onStatusChange}
                    className="grid gap-4 sm:grid-cols-2"
                >
                    {/* Opsi Menang */}
                    <div>
                        <RadioGroupItem
                            value="WIN"
                            id={`win-${teamData.teamId}`}
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor={`win-${teamData.teamId}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-white/10 bg-zinc-950/50 p-6 transition-all hover:border-emerald-500/50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/10"
                        >
                            <CheckCircle2 className="mb-2 h-8 w-8 text-zinc-500 peer-data-[state=checked]:text-emerald-400" />
                            <span className="text-lg font-semibold text-white">Menang</span>
                        </Label>
                    </div>

                    {/* Opsi Kalah */}
                    <div>
                        <RadioGroupItem
                            value="LOSE"
                            id={`lose-${teamData.teamId}`}
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor={`lose-${teamData.teamId}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-white/10 bg-zinc-950/50 p-6 transition-all hover:border-rose-500/50 peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-500/10"
                        >
                            <XCircle className="mb-2 h-8 w-8 text-zinc-500 peer-data-[state=checked]:text-rose-400" />
                            <span className="text-lg font-semibold text-white">Kalah</span>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}