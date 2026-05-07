import { prisma } from "../../users/db.config.js";

// 1. 가게 등록
export const addStore = async (data: {
  regionId: number;
  name: string;
  address: string;
}): Promise<number> => {
  const created = await prisma.store.create({
    data: {
      regionId: data.regionId,
      name: data.name,
      address: data.address,
    },
  });
  return created.id;
};

// 2. 가게 단건 조회
export const getStore = async (storeId: number) => {
  return await prisma.store.findUnique({ where: { id: storeId } });
};

// 3. 지역 존재 여부 확인
export const existsRegion = async (regionId: number): Promise<boolean> => {
  const count = await prisma.region.count({ where: { id: regionId } });
  return count > 0;
};

// 4. 가게 존재 여부 확인 (다른 모듈에서 import해서 씀)
export const existsStore = async (storeId: number): Promise<boolean> => {
  const count = await prisma.store.count({ where: { id: storeId } });
  return count > 0;
};
