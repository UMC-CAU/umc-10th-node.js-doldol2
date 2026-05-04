import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import {
  handleUserSignUp,
  handleMissionChallenge,
} from "./modules/users/controllers/user.controller.js";
import { handleStoreCreate } from "./modules/stores/controllers/store.controller.js";
import { handleMissionCreate } from "./modules/missions/controllers/mission.controller.js";
import { handleReviewCreate } from "./modules/reviews/controllers/review.controller.js";
import { pool } from "./modules/users/db.config.js";
import { initDatabase } from "./modules/users/db.init.js";
// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());            // cors 방식 허용
app.use(express.static('public'));    // 정적 파일 접근
app.use(express.json());              // JSON 본문 파싱
app.use(express.urlencoded({ extended: false })); // urlencoded 본문 파싱

// 3. 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

// 회원가입
app.post("/api/v1/users/signup", handleUserSignUp);

// 가게 등록
app.post("/api/v1/stores", handleStoreCreate);

// 가게에 미션 추가
app.post("/api/v1/stores/:storeId/missions", handleMissionCreate);

// 가게에 리뷰 추가
app.post("/api/v1/stores/:storeId/reviews", handleReviewCreate);

// 미션 도전하기
app.post("/api/v1/users/:userId/missions", handleMissionChallenge);

// 4. 서버 시작
app.listen(port, async () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);

  // DB 초기화 (없으면 데이터베이스/테이블 생성)
  try {
    await initDatabase();
  } catch (err) {
    console.error("[db]: 데이터베이스 초기화 실패", err);
    return;
  }

  // DB 연결 헬스체크
  try {
    const conn = await pool.getConnection();
    console.log("[db]: MySQL 연결 성공");
    conn.release();
  } catch (err) {
    console.error("[db]: MySQL 연결 실패", err);
  }
});
