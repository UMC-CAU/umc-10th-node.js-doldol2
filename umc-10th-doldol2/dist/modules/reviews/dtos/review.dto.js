export const bodyToReview = (storeId, body) => {
    return {
        storeId,
        userId: body.userId,
        content: body.content,
        rating: body.rating,
    };
};
export const responseFromReview = (review) => {
    return {
        id: review.id,
        storeId: review.store_id,
        userId: review.user_id,
        content: review.content,
        rating: review.rating,
        createdAt: review.created_at,
    };
};
//# sourceMappingURL=review.dto.js.map