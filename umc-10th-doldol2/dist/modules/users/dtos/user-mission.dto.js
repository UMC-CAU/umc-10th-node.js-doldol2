export const bodyToMissionChallenge = (userId, body) => {
    return {
        userId,
        missionId: body.missionId,
    };
};
export const responseFromUserMission = (userMission) => {
    return {
        id: userMission.id,
        userId: userMission.user_id,
        missionId: userMission.mission_id,
        status: userMission.status,
        startedAt: userMission.started_at,
        completedAt: userMission.completed_at,
    };
};
//# sourceMappingURL=user-mission.dto.js.map