import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { reviewCreate } from "../services/review.service.js";

export const handleReviewCreate = async (req: Request, res: Response, next: NextFunction) => {
  console.log("리뷰 등록을 요청했습니다!");
  console.log("params:", req.params);
  console.log("body:", req.body);

  try {
    const rawStoreId = req.params.storeId;
    const storeId = typeof rawStoreId === "string" ? parseInt(rawStoreId) : NaN;
    if (isNaN(storeId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "storeId가 올바르지 않아요." });
      return;
    }
    const review = await reviewCreate(bodyToReview(storeId, req.body));
    res.status(StatusCodes.OK).json({ result: review });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
