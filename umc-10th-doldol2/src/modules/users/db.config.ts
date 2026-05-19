import "dotenv/config";
import mysql from "mysql2/promise";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 1. 기존 mysql2 Pool (다른 모듈들이 raw SQL 사용 시)
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "umc_10th",
  password: process.env.DB_PASSWORD || "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 2. Prisma Client (ORM)
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectionLimit: 10,
});

const basePrisma = new PrismaClient({
  adapter,
  log: ["info", "error", "warn"], // 쿼리 로그는 아래 $extends 에서 ms 단위로 직접 출력
});

/**
 * 전역 쿼리 시간 로깅 ($extends)
 *
 * 모든 Prisma 모델 호출(findMany, create, update, delete 등)을 가로채
 * 실행 전/후 시간을 비교해서 ms 로 출력합니다.
 *
 * 호출부마다 console.time 을 따로 박지 않아도, 이 한 곳에서 일괄 적용됩니다.
 */
export const prisma = basePrisma.$extends({
  name: "queryTimingLogger",
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const startedAt = performance.now();
        try {
          const result = await query(args);
          const elapsed = (performance.now() - startedAt).toFixed(2);
          console.log(`[Prisma] ${model}.${operation} - ${elapsed}ms`);
          return result;
        } catch (err) {
          const elapsed = (performance.now() - startedAt).toFixed(2);
          console.error(
            `[Prisma] ${model}.${operation} FAILED after ${elapsed}ms`,
            err
          );
          throw err;
        }
      },
    },
  },
});
