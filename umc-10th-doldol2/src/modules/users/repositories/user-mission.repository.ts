import { prisma } from "../db.config.js";

// 1. 사용자가 이미 도전 중(또는 완료/포기)한 미션인지 확인
export const isAlreadyChallenged = async (
  userId: number,
  missionId: number
): Promise<boolean> => {
  const count = await prisma.userMission.count({
    where: { userId, missionId },
  });
  return count > 0;
};

// 2. 미션 도전 시작 (user_mission INSERT)
export const startUserMission = async (
  userId: number,
  missionId: number
): Promise<number> => {
  const created = await prisma.userMission.create({
    data: {
      userId,
      missionId,
      status: "IN_PROGRESS",
    },
  });
  return created.id;
};

// 3. user_mission 단건 조회
export const getUserMission = async (userMissionId: number) => {
  return await prisma.userMission.findUnique({
    where: { id: userMissionId },
  });
};

// 4. 사용자 존재 여부
export const existsUser = async (userId: number): Promise<boolean> => {
  const count = await prisma.user.count({ where: { id: userId } });
  return count > 0;
};

// 5. 진행 중인 미션 목록 (커서 기반 페이지네이션)
export const getInProgressMissions = async (userId: number, cursor: number) => {
  return await prisma.userMission.findMany({
    select: {
      id: true,
      status: true,
      startedAt: true,
      completedAt: true,
      mission: {
        select: {
          id: true,
          title: true,
          content: true,
          reward: true,
          deadline: true,
          store: { select: { id: true, name: true } },
        },
      },
    },
    where: {
      userId,
      status: "IN_PROGRESS",
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};

// 6. 사용자의 특정 미션 도전 기록 찾기
export const findUserMissionByPair = async (
  userId: number,
  missionId: number
) => {
  return await prisma.userMission.findUnique({
    where: { userId_missionId: { userId, missionId } },
  });
};

// 7. 미션 진행 → 완료 처리
export const completeUserMission = async (userMissionId: number) => {
  return await prisma.userMission.update({
    where: { id: userMissionId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });
};
