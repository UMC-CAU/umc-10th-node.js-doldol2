import { ReviewCreateData, responseFromReview } from "../dtos/review.dto.js";
import { addReview, getReview } from "../repositories/review.repository.js";
import { existsStore } from "../../stores/repositories/store.repository.js";

export const reviewCreate = async (data: ReviewCreateData) => {
  // 1. 가게 존재 여부 검증 (교재 1-2 요구사항)
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
