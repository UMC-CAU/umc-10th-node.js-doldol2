import { prisma } from "../../users/db.config.js";

// 1. 미션 등록
export const addMission = async (data: {
  storeId: number;
  title: string;
  content: string;
  reward: number;
  deadline: Date | null;
}): Promise<number> => {
  const created = await prisma.mission.create({
    data: {
      storeId: data.storeId,
      title: data.title,
      content: data.content,
      reward: data.reward,
      deadline: data.deadline,
    },
  });
  return created.id;
};

// 2. 미션 단건 조회
export const getMission = async (missionId: number) => {
  return await prisma.mission.findUnique({ where: { id: missionId } });
};

// 3. 미션 존재 여부 확인
export const existsMission = async (missionId: number): Promise<boolean> => {
  const count = await prisma.mission.count({ where: { id: missionId } });
  return count > 0;
};

// 4. 가게의 미션 목록 (커서 기반 페이지네이션)
export const getStoreMissions = async (storeId: number, cursor: number) => {
  return await prisma.mission.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      reward: true,
      deadline: true,
      createdAt: true,
      store: {
        select: { id: true, name: true },
      },
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};
