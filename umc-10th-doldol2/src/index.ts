import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import { RegisterRoutes } from "./generated/routes.js";
import { pool } from "./modules/users/db.config.js";
import { initDatabase } from "./modules/users/db.init.js";
import { AppError } from "./common/errors/app.error.js";

// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. CORS 설정
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
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

// 4. Swagger UI 연결
const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve("dist/swagger.json"), "utf8")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 5. TSOA 라우트 등록
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1", router);

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
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[cors]: Allowed origins → ${allowedOrigins.join(", ") || "none"}`);
  console.log(`[docs]: Swagger UI → http://localhost:${port}/docs`);

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
