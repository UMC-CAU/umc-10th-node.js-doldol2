// 리뷰 작성 요청 DTO
export interface ReviewCreateRequest {
  /** 리뷰 내용 */
  content: string;
  /** 별점 (1~5) */
  rating: number;
}

// 단일 리뷰 응답 DTO
export interface ReviewResponse {
  /** 리뷰 ID */
  id: number;
  /** 가게 ID */
  storeId: number;
  /** 작성자 유저 ID */
  userId: number;
  /** 리뷰 내용 */
  content: string;
  /** 별점 (1~5) */
  rating: number;
  /** 생성일시 */
  createdAt: Date;
}

export const bodyToReview = (storeId: number, userId: number, body: ReviewCreateRequest) => {
  return {
    storeId,
    userId,
    content: body.content,
    rating: body.rating,
  };
};

export const responseFromReview = (review: any): ReviewResponse => {
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
// 리뷰 목록 응답 (가게별 / 사용자별 공통, 커서 기반 페이지네이션)
// ───────────────────────────────────────────────────────────

export interface ReviewItem {
  /** 리뷰 ID */
  id: number;
  /** 리뷰 내용 */
  content: string;
  /** 별점 (1~5) */
  rating: number;
  /** 생성일시 */
  createdAt: Date;
  /** 가게 정보 */
  store: { id: number; name: string };
  /** 작성자 정보 */
  user:  { id: number; name: string };
}

export interface ReviewListResponse {
  /** 리뷰 목록 */
  data: ReviewItem[];
  /** 페이지네이션 정보 */
  pagination: {
    /** 다음 페이지 커서 (없으면 null) */
    cursor: number | null;
  };
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
