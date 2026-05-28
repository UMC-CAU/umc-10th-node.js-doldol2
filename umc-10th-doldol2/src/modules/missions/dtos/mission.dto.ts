// 미션 등록 요청 DTO
export interface MissionCreateRequest {
  /** 미션 제목 */
  title: string;
  /** 미션 내용 (선택) */
  content?: string;
  /** 리워드 포인트 */
  reward: number;
  /** 마감 날짜 (예: "2025-12-31", 선택) */
  deadline?: string;
}

// 단일 미션 응답 DTO
export interface MissionResponse {
  /** 미션 ID */
  id: number;
  /** 가게 ID */
  storeId: number;
  /** 미션 제목 */
  title: string;
  /** 미션 내용 */
  content: string;
  /** 리워드 포인트 */
  reward: number;
  /** 마감일 */
  deadline: Date | null;
  /** 생성일시 */
  createdAt: Date;
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

export const responseFromMission = (mission: any): MissionResponse => {
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
  /** 미션 ID */
  id: number;
  /** 미션 제목 */
  title: string;
  /** 미션 내용 */
  content: string;
  /** 리워드 포인트 */
  reward: number;
  /** 마감일 */
  deadline: Date | null;
  /** 생성일시 */
  createdAt: Date;
  /** 소속 가게 정보 */
  store: {
    id: number;
    name: string;
  };
}

export interface MissionListResponse {
  /** 미션 목록 */
  data: MissionItem[];
  /** 페이지네이션 정보 */
  pagination: {
    /** 다음 페이지 커서 (없으면 null) */
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
