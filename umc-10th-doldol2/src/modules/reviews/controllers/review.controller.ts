import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import {
  reviewCreate,
  listStoreReviews,
  listMyReviews,
} from "../services/review.service.js";

export const handleReviewCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("리뷰 등록을 요청했습니다!");
  console.log("params:", req.params);
  console.log("body:", req.body);

  try {
    const rawStoreId = req.params.storeId;
    const storeId =
      typeof rawStoreId === "string" ? parseInt(rawStoreId) : NaN;
    if (isNaN(storeId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "storeId가 올바르지 않아요." });
      return;
    }
    const review = await reviewCreate(bodyToReview(storeId, req.body));
    res.status(StatusCodes.OK).json({ result: review });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};

// 가게의 리뷰 목록 조회 (커서 기반 페이지네이션)
export const handleListStoreReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("가게의 리뷰 목록 조회를 요청했습니다!");
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    if (isNaN(storeId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "storeId가 올바르지 않아요." });
      return;
    }
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor, 10)
        : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    next(err);
  }
};

// 내가 작성한 리뷰 목록 조회 (커서 기반 페이지네이션)
export const handleListMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("내가 작성한 리뷰 목록 조회를 요청했습니다!");
  try {
    const userId = parseInt(req.params.userId as string, 10);
    if (isNaN(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "userId가 올바르지 않아요." });
      return;
    }
    const cursor =
      typeof req.query.cursor === "string"
        ? parseInt(req.query.cursor, 10)
        : 0;

    const reviews = await listMyReviews(userId, cursor);
    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
