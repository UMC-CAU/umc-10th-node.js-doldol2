export const bodyToMission = (storeId, body) => {
    return {
        storeId,
        title: body.title,
        content: body.content || "",
        reward: body.reward,
        deadline: body.deadline ? new Date(body.deadline) : null,
    };
};
export const responseFromMission = (mission) => {
    return {
        id: mission.id,
        storeId: mission.store_id,
        title: mission.title,
        content: mission.content,
        reward: mission.reward,
        deadline: mission.deadline,
        createdAt: mission.created_at,
    };
};
//# sourceMappingURL=mission.dto.js.map