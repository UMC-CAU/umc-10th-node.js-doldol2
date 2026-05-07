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

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "error", "warn"], // 쿼리 로그, 에러 로그, 경고 로그를 모두 출력하도록 설정
});
