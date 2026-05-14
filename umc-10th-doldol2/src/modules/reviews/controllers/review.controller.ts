import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { reviewCreate, listStoreReviews, listMyReviews } from "../services/review.service.js";

export const handleReviewCreate = async (req: Request, res: Response, next: NextFunction) => {
  console.log("리뷰 등록을 요청했습니다!");
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    if (isNaN(storeId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ resultType: "FAIL", error: { errorCode: "V001", message: "storeId가 올바르지 않아요.", data: null }, data: null });
      return;
    }
    const review = await reviewCreate(bodyToReview(storeId, req.body));
    res.status(StatusCodes.OK).json({ resultType: "SUCCESS", error: null, data: review });
  } catch (err) {
    next(err);
  }
};

export const handleListStoreReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("가게의 리뷰 목록 조회를 요청했습니다!");
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    if (isNaN(storeId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ resultType: "FAIL", error: { errorCode: "V001", message: "storeId가 올바르지 않아요.", data: null }, data: null });
      return;
    }
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;
    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).json({ resultType: "SUCCESS", error: null, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const handleListMyReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("내가 작성한 리뷰 목록 조회를 요청했습니다!");
  try {
    const userId = parseInt(req.params.userId as string, 10);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ resultType: "FAIL", error: { errorCode: "V001", message: "userId가 올바르지 않아요.", data: null }, data: null });
      return;
    }
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;
    const reviews = await listMyReviews(userId, cursor);
    res.status(StatusCodes.OK).json({ resultType: "SUCCESS", error: null, data: reviews });
  } catch (err) {
    next(err);
  }
};
