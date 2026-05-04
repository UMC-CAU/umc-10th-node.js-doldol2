import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { bodyToMissionChallenge } from "../dtos/user-mission.dto.js";
import { challengeMission } from "../services/user-mission.service.js";

export const handleUserSignUp = async (req: Request, res: Response, next: NextFunction) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

export const handleMissionChallenge = async (req: Request, res: Response, next: NextFunction) => {
  console.log("미션 도전을 요청했습니다!");
  console.log("params:", req.params);
  console.log("body:", req.body);

  try {
    const rawUserId = req.params.userId;
    const userId = typeof rawUserId === "string" ? parseInt(rawUserId) : NaN;
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "userId가 올바르지 않아요." });
      return;
    }
    const result = await challengeMission(bodyToMissionChallenge(userId, req.body));
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    const message = (err as Error).message;
    res.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
