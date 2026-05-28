import passport from "passport";
import { Request, Response, NextFunction } from "express";

/**
 * JWT 인증 미들웨어
 * Authorization: Bearer <token> 헤더를 검증합니다.
 * TSOA @Middlewares() 데코레이터와 함께 사용합니다.
 */
export function jwtAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          resultType: "FAIL",
          error: { errorCode: "AUTH001", message: "인증이 필요합니다. 유효한 Bearer 토큰을 포함해주세요.", data: null },
          success: null,
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}
