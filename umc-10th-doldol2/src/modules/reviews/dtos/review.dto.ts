// 1. 리뷰 작성 요청 데이터
export interface ReviewCreateRequest {
  userId: number;     // 임시: 로그인 토큰 도입 전까진 body로 받음
  content: string;
  rating: number;     // 1 ~ 5
}

export const bodyToReview = (storeId: number, body: ReviewCreateRequest) => {
  return {
    storeId,
    userId: body.userId,
    content: body.content,
    rating: body.rating,
  };
};

export const responseFromReview = (review: any) => {
  return {
    id: review.id,
    storeId: review.store_id,
    userId: review.user_id,
    content: review.content,
    rating: review.rating,
    createdAt: review.created_at,
  };
};

export interface ReviewCreateData {
  storeId: number;
  userId: number;
  content: string;
  rating: number;
}
