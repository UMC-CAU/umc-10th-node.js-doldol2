import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { missionCreate } from "../services/mission.service.js";

export const handleMissionCreate = async (req: Request, res: Response, next: NextFunction) => {
  console.log("미션 등록을 요청했습니다!");
  console.log("params:", req.params);
  console.log("body:", req.body);

  try {
    const rawStoreId = req.params.storeId;
    const storeId = typeof rawStoreId === "string" ? parseInt(rawStoreId) : NaN;
    if (isNaN(storeId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "storeId가 올바르지 않아요." });
      return;
    }
    const mission = await missionCreate(bodyToMission(storeId, req.body));
    res.status(StatusCodes.OK).json({ result: mission });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
