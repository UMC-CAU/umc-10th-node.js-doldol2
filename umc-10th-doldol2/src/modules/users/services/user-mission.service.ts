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
import {
  UserNotFoundError,
  MissionNotFoundError,
  AlreadyChallengedError,
  MissionNotInProgressError,
} from "../../../common/errors/error.js";

export const challengeMission = async (data: MissionChallengeData) => {
  const userOk = await existsUser(data.userId);
  if (!userOk) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", { userId: data.userId });
  }

  const missionOk = await existsMission(data.missionId);
  if (!missionOk) {
    throw new MissionNotFoundError("존재하지 않는 미션입니다.", { missionId: data.missionId });
  }

  const already = await isAlreadyChallenged(data.userId, data.missionId);
  if (already) {
    throw new AlreadyChallengedError("이미 도전 중인 미션입니다.", data);
  }

  const userMissionId = await startUserMission(data.userId, data.missionId);
  const userMission = await getUserMission(userMissionId);
  return responseFromUserMission(userMission);
};

export const listInProgressMissions = async (
  userId: number,
  cursor: number
): Promise<InProgressMissionListResponse> => {
  const userOk = await existsUser(userId);
  if (!userOk) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", { userId });
  }
  const list = await getInProgressMissions(userId, cursor);
  return responseFromInProgressMissions(list);
};

export const completeInProgressMission = async (userId: number, missionId: number) => {
  const userOk = await existsUser(userId);
  if (!userOk) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", { userId });
  }

  const missionOk = await existsMission(missionId);
  if (!missionOk) {
    throw new MissionNotFoundError("존재하지 않는 미션입니다.", { missionId });
  }

  const userMission = await findUserMissionByPair(userId, missionId);
  if (!userMission) {
    throw new MissionNotInProgressError("도전 중인 미션이 아닙니다.", { userId, missionId });
  }
  if (userMission.status !== "IN_PROGRESS") {
    throw new MissionNotInProgressError(`이미 ${userMission.status} 상태인 미션입니다.`, { userId, missionId });
  }

  const updated = await completeUserMission(userMission.id);
  return responseFromUserMission(updated);
};
