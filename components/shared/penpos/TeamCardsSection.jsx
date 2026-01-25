import TeamResultCard from "@/views/Penpos/TeamResultCard";

export default function TeamCardsSection({
    posType,
    gameResults,
    submitting,
    onTeam1StatusChange,
    onTeam2StatusChange,
}) {
    return (
        <>
            <TeamResultCard
                teamData={gameResults.team1}
                onStatusChange={onTeam1StatusChange}
                teamNumber={1}
            />

            {posType === "BATTLE" && gameResults.team2 && (
                <TeamResultCard
                    teamData={gameResults.team2}
                    onStatusChange={onTeam2StatusChange}
                    teamNumber={2}
                />
            )}
        </>
    );
}
