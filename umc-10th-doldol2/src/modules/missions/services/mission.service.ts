import {
  MissionCreateData,
  responseFromMission,
  responseFromMissions,
  MissionListResponse,
} from "../dtos/mission.dto.js";
import { addMission, getMission, getStoreMissions } from "../repositories/mission.repository.js";
import { existsStore } from "../../stores/repositories/store.repository.js";
import { StoreNotFoundError } from "../../../common/errors/error.js";

export const missionCreate = async (data: MissionCreateData) => {
  const storeOk = await existsStore(data.storeId);
  if (!storeOk) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId: data.storeId });
  }

  const missionId = await addMission({
    storeId: data.storeId,
    title: data.title,
    content: data.content,
    reward: data.reward,
    deadline: data.deadline,
  });

  const mission = await getMission(missionId);
  return responseFromMission(mission);
};

export const listStoreMissions = async (
  storeId: number,
  cursor: number
): Promise<MissionListResponse> => {
  const storeOk = await existsStore(storeId);
  if (!storeOk) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId });
  }
  const missions = await getStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};
