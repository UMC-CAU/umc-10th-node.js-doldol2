import {
  ReviewCreateData,
  responseFromReview,
  responseFromReviews,
  ReviewListResponse,
} from "../dtos/review.dto.js";
import {
  addReview,
  getReview,
  getAllStoreReviews,
  getMyReviews,
} from "../repositories/review.repository.js";
import { existsStore } from "../../stores/repositories/store.repository.js";
import { existsUser } from "../../users/repositories/user-mission.repository.js";

export const reviewCreate = async (data: ReviewCreateData) => {
  // 1. 가게 존재 여부 검증
  const storeOk = await existsStore(data.storeId);
  if (!storeOk) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  // 2. 별점 범위 검증
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("별점은 1~5 사이여야 합니다.");
  }

  // 3. 리뷰 INSERT
  const reviewId = await addReview({
    storeId: data.storeId,
    userId: data.userId,
    content: data.content,
    rating: data.rating,
  });

  // 4. 방금 만든 리뷰 반환
  const review = await getReview(reviewId);
  return responseFromReview(review);
};

// 가게의 리뷰 목록 조회
export const listStoreReviews = async (
  storeId: number,
  cursor: number
): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

// 내가 작성한 리뷰 목록 조회
export const listMyReviews = async (
  userId: number,
  cursor: number
): Promise<ReviewListResponse> => {
  const userOk = await existsUser(userId);
  if (!userOk) {
    throw new Error("존재하지 않는 사용자입니다.");
  }
  const reviews = await getMyReviews(userId, cursor);
  return responseFromReviews(reviews);
};
