// Constants
export const DEFAULT_POS_TYPE = "BATTLE";
export const DEFAULT_POS_NAME = "Input Hasil Pertandingan";
export const SUBMIT_DELAY = 1500;
export const REDIRECT_DELAY = 2000;

// Helper: Extract teams data from API response
export const extractTeamsData = (teamsArray) => {
    if (!Array.isArray(teamsArray) || teamsArray.length === 0) {
        return { posType: DEFAULT_POS_TYPE, posName: DEFAULT_POS_NAME, teams: [] };
    }

    const posType = teamsArray[0]?.type || DEFAULT_POS_TYPE;
    const posName = teamsArray[0]?.name_pos || DEFAULT_POS_NAME;

    return {
        posType,
        posName,
        team1: {
            teamId: teamsArray[0]?.id || null,
            teamName: teamsArray[0]?.nama_tim || "",
            status: "",
        },
        team2: posType === "BATTLE" && teamsArray[1]
            ? {
                teamId: teamsArray[1]?.id || null,
                teamName: teamsArray[1]?.nama_tim || "",
                status: "",
            }
            : null,
    };
};

// Helper: Build submit payload
export const buildSubmitPayload = (userPenpos, posType, gameResults) => {
    const basePayload = { pos_id: userPenpos };

    if (posType === "SINGLE") {
        return {
            ...basePayload,
            matches: [
                {
                    teamId: gameResults.team1.teamId,
                    status: gameResults.team1.status,
                },
            ],
        };
    }

    return {
        ...basePayload,
        matches: [
            {
                teamId: gameResults.team1.teamId,
                status: gameResults.team1.status,
            },
            {
                teamId: gameResults.team2.teamId,
                status: gameResults.team2.status,
            },
        ],
    };
};
