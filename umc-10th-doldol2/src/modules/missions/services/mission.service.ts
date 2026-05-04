import { MissionCreateData, responseFromMission } from "../dtos/mission.dto.js";
import { addMission, getMission } from "../repositories/mission.repository.js";
import { existsStore } from "../../stores/repositories/store.repository.js";

export const missionCreate = async (data: MissionCreateData) => {
  // 1. 가게 존재 여부 검증
  const storeOk = await existsStore(data.storeId);
  if (!storeOk) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  // 2. 미션 INSERT
  const missionId = await addMission({
    storeId: data.storeId,
    title: data.title,
    content: data.content,
    reward: data.reward,
    deadline: data.deadline,
  });

  // 3. 방금 등록한 미션 반환
  const mission = await getMission(missionId);
  return responseFromMission(mission);
};
