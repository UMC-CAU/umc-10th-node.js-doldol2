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

// 2. 미들웨어 설정
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. TSOA로 생성된 라우트 등록 (users 관련 엔드포인트)
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1", router);

// 4. 기존 Express 방식 라우트 (아직 TSOA 전환 전)
app.post("/api/v1/stores", handleStoreCreate);
app.post("/api/v1/stores/:storeId/missions", handleMissionCreate);
app.post("/api/v1/stores/:storeId/reviews", handleReviewCreate);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/users/:userId/reviews", handleListMyReviews);

// 5. 전역 오류 처리 미들웨어
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

// 6. 서버 시작
app.listen(port, async () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);

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
