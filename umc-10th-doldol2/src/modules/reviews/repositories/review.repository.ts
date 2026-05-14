import { prisma } from "../../users/db.config.js";

// 1. 리뷰 등록
export const addReview = async (data: {
  storeId: number;
  userId: number;
  content: string;
  rating: number;
}): Promise<number> => {
  const created = await prisma.review.create({
    data: {
      storeId: data.storeId,
      userId: data.userId,
      content: data.content,
      rating: data.rating,
    },
  });
  return created.id;
};

// 2. 리뷰 단건 조회
export const getReview = async (reviewId: number) => {
  return await prisma.review.findUnique({ where: { id: reviewId } });
};

// 3. 가게의 리뷰 목록 조회 (커서 기반 페이지네이션, Prisma ORM)
export const getAllStoreReviews = async (storeId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      rating: true,
      createdAt: true,
      store: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};

// 4. 사용자가 작성한 리뷰 목록 (커서 기반 페이지네이션)
export const getMyReviews = async (userId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      rating: true,
      createdAt: true,
      store: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
    where: {
      userId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};
