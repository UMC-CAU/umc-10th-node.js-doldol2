import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { storeCreate } from "../services/store.service.js";

export const handleStoreCreate = async (req: Request, res: Response, next: NextFunction) => {
  console.log("가게 등록을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const store = await storeCreate(bodyToStore(req.body));
    res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
