import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { missionCreate, listStoreMissions } from "../services/mission.service.js";

export const handleMissionCreate = async (req: Request, res: Response, next: NextFunction) => {
  console.log("미션 등록을 요청했습니다!");
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    if (isNaN(storeId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ resultType: "FAIL", error: { errorCode: "V001", message: "storeId가 올바르지 않아요.", data: null }, data: null });
      return;
    }
    const mission = await missionCreate(bodyToMission(storeId, req.body));
    res.status(StatusCodes.OK).json({ resultType: "SUCCESS", error: null, data: mission });
  } catch (err) {
    next(err);
  }
};

export const handleListStoreMissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("가게의 미션 목록 조회를 요청했습니다!");
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    if (isNaN(storeId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ resultType: "FAIL", error: { errorCode: "V001", message: "storeId가 올바르지 않아요.", data: null }, data: null });
      return;
    }
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;
    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).json({ resultType: "SUCCESS", error: null, data: missions });
  } catch (err) {
    next(err);
  }
};
