import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "./generated/routes.js";
import { handleStoreCreate } from "./modules/stores/controllers/store.controller.js";
import { handleMissionCreate } from "./modules/missions/controllers/mission.controller.js";
import {
  handleReviewCreate,
  handleListStoreReviews,
  handleListMyReviews,
} from "./modules/reviews/controllers/review.controller.js";
import { pool } from "./modules/users/db.config.js";
import { initDatabase } from "./modules/users/db.init.js";
import { AppError } from "./common/errors/app.error.js";

// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. CORS 설정
// CORS_ORIGIN 환경변수에서 허용할 출처 목록을 읽어옴 (쉼표로 구분)
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    // 허용할 출처 목록. 목록에 없는 출처에서 오는 요청은 브라우저가 차단함
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    // 쿠키/인증 헤더 포함 요청 허용 (origin이 *이면 사용 불가)
    credentials: true,
    // Preflight 캐시 시간 (1시간) — OPTIONS 요청 반복 횟수 감소
    maxAge: 3600,
  })
);

// res.error 커스텀 메서드 등록
app.use((req: Request, res: Response, next: NextFunction) => {
  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAIL",
      error: { errorCode, message, data },
      success: null,
    });
  };
  next();
});

// 3. 공통 미들웨어
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 4. TSOA 라우트 등록
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1", router);

// 5. 기존 Express 방식 라우트 (아직 TSOA 전환 전)
app.post("/api/v1/stores", handleStoreCreate);
app.post("/api/v1/stores/:storeId/missions", handleMissionCreate);
app.post("/api/v1/stores/:storeId/reviews", handleReviewCreate);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/users/:userId/reviews", handleListMyReviews);

// 6. 전역 오류 처리 미들웨어
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    message: err.message || null,
    data: err.data || null,
  });
});

// 7. 서버 시작
app.listen(port, async () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
  console.log(`[cors]: Allowed origins → ${allowedOrigins.join(", ") || "none"}`);

  try {
    await initDatabase();
  } catch (err) {
    console.error("[db]: 데이터베이스 초기화 실패", err);
    return;
  }

  try {
    const conn = await pool.getConnection();
    console.log("[db]: MySQL 연결 성공");
    conn.release();
  } catch (err) {
    console.error("[db]: MySQL 연결 실패", err);
  }
});
