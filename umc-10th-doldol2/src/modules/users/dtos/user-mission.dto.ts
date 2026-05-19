// 1. 미션 도전 요청 데이터
export interface MissionChallengeRequest {
  missionId: number;
}

export const bodyToMissionChallenge = (
  userId: number,
  body: MissionChallengeRequest
) => {
  return {
    userId,
    missionId: body.missionId,
  };
};

// Prisma 응답은 camelCase
export const responseFromUserMission = (userMission: any) => {
  return {
    id: userMission.id,
    userId: userMission.userId,
    missionId: userMission.missionId,
    status: userMission.status,
    startedAt: userMission.startedAt,
    completedAt: userMission.completedAt,
  };
};

export interface MissionChallengeData {
  userId: number;
  missionId: number;
}

// ───────────────────────────────────────────────────────────
// 진행 중인 미션 목록 응답 (커서 기반 페이지네이션)
// ───────────────────────────────────────────────────────────

export interface InProgressMissionItem {
  id: number;                 // user_mission.id
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  mission: {
    id: number;
    title: string;
    content: string;
    reward: number;
    deadline: Date | null;
    store: {
      id: number;
      name: string;
    };
  };
}

export interface InProgressMissionListResponse {
  data: InProgressMissionItem[];
  pagination: {
    cursor: number | null;
  };
}

export const responseFromInProgressMissions = (
  list: any[]
): InProgressMissionListResponse => {
  const last = list[list.length - 1];
  const data: InProgressMissionItem[] = list.map((um) => ({
    id: um.id,
    status: um.status,
    startedAt: um.startedAt,
    completedAt: um.completedAt,
    mission: {
      id: um.mission.id,
      title: um.mission.title,
      content: um.mission.content,
      reward: um.mission.reward,
      deadline: um.mission.deadline,
      store: {
        id: um.mission.store.id,
        name: um.mission.store.name,
      },
    },
  }));
  return {
    data,
    pagination: { cursor: last ? last.id : null },
  };
};

// 미션 도전/완료 응답 DTO
export interface UserMissionResponse {
  id: number;
  userId: number;
  missionId: number;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
}
