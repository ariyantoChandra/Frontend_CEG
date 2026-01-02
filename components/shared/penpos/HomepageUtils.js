export const REDIRECT_DELAY = 1000;
export const SINGLE_MODE = "SINGLE";
export const BATTLE_MODE = "BATTLE";
export const MAX_TEAMS_BATTLE = 2;

export const extractPosData = (data) => {
    if (!data?.data?.data) return null;
    const { penpos_id, name_pos, tipe } = data.data.data;
    return { id: penpos_id, name: name_pos, type: tipe };
};

export const extractTeamsData = (data) => {
    if (!data?.data?.data) return [];
    return data.data.data.map((tim) => ({
        id: tim.id,
        name: tim.nama_tim,
        penpos_id: tim.penpos_id,
        name_pos: tim.name_pos,
    }));
};

export const buildGamePayload = (posType, selectedTeams) => {
    if (posType === SINGLE_MODE) {
        return { tim1: selectedTeams[0] };
    }
    return { tim1: selectedTeams[0], tim2: selectedTeams[1] };
};
