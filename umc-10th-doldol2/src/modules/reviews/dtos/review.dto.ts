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

// Prisma는 camelCase로 반환
export const responseFromReview = (review: any) => {
  return {
    id: review.id,
    storeId: review.storeId,
    userId: review.userId,
    content: review.content,
    rating: review.rating,
    createdAt: review.createdAt,
  };
};

export interface ReviewCreateData {
  storeId: number;
  userId: number;
  content: string;
  rating: number;
}

// ───────────────────────────────────────────────────────────
// 2. 리뷰 목록 조회 응답 (가게별 / 사용자별 공통, 커서 기반 페이지네이션)
// ───────────────────────────────────────────────────────────

export interface ReviewItem {
  id: number;
  content: string;
  rating: number;
  createdAt: Date;
  store: { id: number; name: string };
  user:  { id: number; name: string };
}

export interface ReviewListResponse {
  data: ReviewItem[];
  pagination: { cursor: number | null };
}

export const responseFromReviews = (reviews: any[]): ReviewListResponse => {
  const last = reviews[reviews.length - 1];
  const data: ReviewItem[] = reviews.map((r) => ({
    id: r.id,
    content: r.content,
    rating: r.rating,
    createdAt: r.createdAt,
    store: { id: r.store.id, name: r.store.name },
    user:  { id: r.user.id,  name: r.user.name  },
  }));
  return {
    data,
    pagination: { cursor: last ? last.id : null },
  };
};
