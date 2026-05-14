// 1. 미션 등록 요청 데이터
export interface MissionCreateRequest {
  title: string;
  content?: string;
  reward: number;
  deadline?: string; // YYYY-MM-DD
}

export const bodyToMission = (storeId: number, body: MissionCreateRequest) => {
  return {
    storeId,
    title: body.title,
    content: body.content || "",
    reward: body.reward,
    deadline: body.deadline ? new Date(body.deadline) : null,
  };
};

// Prisma는 camelCase로 반환
export const responseFromMission = (mission: any) => {
  return {
    id: mission.id,
    storeId: mission.storeId,
    title: mission.title,
    content: mission.content,
    reward: mission.reward,
    deadline: mission.deadline,
    createdAt: mission.createdAt,
  };
};

export interface MissionCreateData {
  storeId: number;
  title: string;
  content: string;
  reward: number;
  deadline: Date | null;
}

// ───────────────────────────────────────────────────────────
// 가게 미션 목록 응답 (커서 기반 페이지네이션)
// ───────────────────────────────────────────────────────────

export interface MissionItem {
  id: number;
  title: string;
  content: string;
  reward: number;
  deadline: Date | null;
  createdAt: Date;
  store: {
    id: number;
    name: string;
  };
}

export interface MissionListResponse {
  data: MissionItem[];
  pagination: {
    cursor: number | null;
  };
}

export const responseFromMissions = (missions: any[]): MissionListResponse => {
  const last = missions[missions.length - 1];
  const data: MissionItem[] = missions.map((m) => ({
    id: m.id,
    title: m.title,
    content: m.content,
    reward: m.reward,
    deadline: m.deadline,
    createdAt: m.createdAt,
    store: { id: m.store.id, name: m.store.name },
  }));
  return {
    data,
    pagination: { cursor: last ? last.id : null },
  };
};
