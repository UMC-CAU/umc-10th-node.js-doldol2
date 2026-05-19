import {
  ReviewCreateData,
  responseFromReview,
  responseFromReviews,
  ReviewListResponse,
} from "../dtos/review.dto.js";
import { addReview, getReview, getAllStoreReviews, getMyReviews } from "../repositories/review.repository.js";
import { existsStore } from "../../stores/repositories/store.repository.js";
import { existsUser } from "../../users/repositories/user-mission.repository.js";
import { StoreNotFoundError, InvalidRatingError, UserNotFoundError } from "../../../common/errors/error.js";

export const reviewCreate = async (data: ReviewCreateData) => {
  const storeOk = await existsStore(data.storeId);
  if (!storeOk) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId: data.storeId });
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new InvalidRatingError("별점은 1~5 사이여야 합니다.", { rating: data.rating });
  }

  const reviewId = await addReview({
    storeId: data.storeId,
    userId: data.userId,
    content: data.content,
    rating: data.rating,
  });

  const review = await getReview(reviewId);
  return responseFromReview(review);
};

export const listStoreReviews = async (
  storeId: number,
  cursor: number
): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listMyReviews = async (
  userId: number,
  cursor: number
): Promise<ReviewListResponse> => {
  const userOk = await existsUser(userId);
  if (!userOk) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", { userId });
  }
  const reviews = await getMyReviews(userId, cursor);
  return responseFromReviews(reviews);
};
