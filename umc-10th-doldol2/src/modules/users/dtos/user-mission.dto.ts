// 1. 미션 도전 요청 데이터
export interface MissionChallengeRequest {
  missionId: number;
}

export const bodyToMissionChallenge = (userId: number, body: MissionChallengeRequest) => {
  return {
    userId,
    missionId: body.missionId,
  };
};

export const responseFromUserMission = (userMission: any) => {
  return {
    id: userMission.id,
    userId: userMission.user_id,
    missionId: userMission.mission_id,
    status: userMission.status,
    startedAt: userMission.started_at,
    completedAt: userMission.completed_at,
  };
};

export interface MissionChallengeData {
  userId: number;
  missionId: number;
}
