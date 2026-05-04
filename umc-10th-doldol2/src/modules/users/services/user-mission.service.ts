import { MissionChallengeData, responseFromUserMission } from "../dtos/user-mission.dto.js";
import {
  existsUser,
  getUserMission,
  isAlreadyChallenged,
  startUserMission,
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

  // 3. 중복 도전 검증 (교재 1-4 요구사항)
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
