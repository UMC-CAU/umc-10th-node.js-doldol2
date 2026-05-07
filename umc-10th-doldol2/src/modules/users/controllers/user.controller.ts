import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { bodyToMissionChallenge } from "../dtos/user-mission.dto.js";
import {
  challengeMission,
  listInProgressMissions,
  completeInProgressMission,
} from "../services/user-mission.service.js";

export const handleUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

export const handleMissionChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("미션 도전을 요청했습니다!");
  console.log("params:", req.params);
  console.log("body:", req.body);

  try {
    const rawUserId = req.params.userId;
    const userId =
      typeof rawUserId === "string" ? parseInt(rawUserId) : NaN;
    if (isNaN(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "userId가 올바르지 않아요." });
      return;
    }
    const result = await challengeMission(
      bodyToMissionChallenge(userId, req.body)
    );
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};

// 내가 진행 중인 미션 목록 조회 (커서 기반 페이지네이션)
export const handleListInProgressMissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("내가 진행 중인 미션 목록 조회를 요청했습니다!");
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

    const result = await listInProgressMissions(userId, cursor);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};

// 내가 진행 중인 미션을 진행 완료로 변경
export const handleCompleteMission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("미션 완료 처리를 요청했습니다!");
  console.log("params:", req.params);

  try {
    const userId = parseInt(req.params.userId as string, 10);
    const missionId = parseInt(req.params.missionId as string, 10);
    if (isNaN(userId) || isNaN(missionId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "userId 또는 missionId가 올바르지 않아요." });
      return;
    }

    const result = await completeInProgressMission(userId, missionId);
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
