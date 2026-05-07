import {
  MissionChallengeData,
  responseFromUserMission,
  responseFromInProgressMissions,
  InProgressMissionListResponse,
} from "../dtos/user-mission.dto.js";
import {
  existsUser,
  getUserMission,
  isAlreadyChallenged,
  startUserMission,
  getInProgressMissions,
  findUserMissionByPair,
  completeUserMission,
} from "../repositories/user-mission.repository.js";
import { existsMission } from "../../missions/repositories/mission.repository.js";

export const challengeMission = async (data: MissionChallengeData) => {
  // 1. 사용자 존재 확인
  const userOk = await existsUser(data.userId);
  if (!userOk) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  // 2. 미션 존재 확인
  const missionOk = await existsMission(data.missionId);
  if (!missionOk) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  // 3. 중복 도전 검증
  const already = await isAlreadyChallenged(data.userId, data.missionId);
  if (already) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  // 4. 미션 도전 시작
  const userMissionId = await startUserMission(data.userId, data.missionId);

  // 5. 결과 반환
  const userMission = await getUserMission(userMissionId);
  return responseFromUserMission(userMission);
};

// 진행 중인 미션 목록 조회
export const listInProgressMissions = async (
  userId: number,
  cursor: number
): Promise<InProgressMissionListResponse> => {
  const userOk = await existsUser(userId);
  if (!userOk) {
    throw new Error("존재하지 않는 사용자입니다.");
  }
  const list = await getInProgressMissions(userId, cursor);
  return responseFromInProgressMissions(list);
};

// 진행 중인 미션을 완료로 변경
export const completeInProgressMission = async (
  userId: number,
  missionId: number
) => {
  const userOk = await existsUser(userId);
  if (!userOk) {
    throw new Error("존재하지 않는 사용자입니다.");
  }
  const missionOk = await existsMission(missionId);
  if (!missionOk) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  const userMission = await findUserMissionByPair(userId, missionId);
  if (!userMission) {
    throw new Error("도전 중인 미션이 아닙니다.");
  }
  if (userMission.status !== "IN_PROGRESS") {
    throw new Error(`이미 ${userMission.status} 상태인 미션입니다.`);
  }

  const updated = await completeUserMission(userMission.id);
  return responseFromUserMission(updated);
};
