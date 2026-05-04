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

export const responseFromMission = (mission: any) => {
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

export interface MissionCreateData {
  storeId: number;
  title: string;
  content: string;
  reward: number;
  deadline: Date | null;
}
