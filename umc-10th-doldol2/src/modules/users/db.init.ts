import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// DB가 없으면 만들고, 필요한 테이블들도 자동 생성합니다.
export const initDatabase = async (): Promise<void> => {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const port = parseInt(process.env.DB_PORT || "3306");
  const password = process.env.DB_PASSWORD || "password";
  const dbName = process.env.DB_NAME || "umc_10th";

  // 1. DB 지정 없이 서버에 먼저 접속
  const connection = await mysql.createConnection({
    host,
    user,
    port,
    password,
    multipleStatements: true,
  });

  try {
    // 2. 데이터베이스가 없으면 생성
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.query(`USE \`${dbName}\`;`);

    // 3. food_category 테이블
    await connection.query(`
      CREATE TABLE IF NOT EXISTS food_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. user 테이블
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        birth DATE NOT NULL,
        address VARCHAR(255) DEFAULT '',
        detail_address VARCHAR(255) DEFAULT '',
        phone_number VARCHAR(20) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. user_favor_category 매핑 테이블
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_favor_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        food_category_id INT NOT NULL,
        CONSTRAINT fk_ufc_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        CONSTRAINT fk_ufc_category FOREIGN KEY (food_category_id) REFERENCES food_category(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. region 테이블 (지역)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS region (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. store 테이블 (가게)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS store (
        id INT AUTO_INCREMENT PRIMARY KEY,
        region_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(255) DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_store_region FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. mission 테이블 (가게 미션)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mission (
        id INT AUTO_INCREMENT PRIMARY KEY,
        store_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        content VARCHAR(255) DEFAULT '',
        reward INT NOT NULL DEFAULT 0,
        deadline DATE NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_mission_store FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. review 테이블 (가게 리뷰)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS review (
        id INT AUTO_INCREMENT PRIMARY KEY,
        store_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        rating TINYINT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_review_store FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE,
        CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. user_mission 테이블 (사용자가 도전 중/완료한 미션)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_mission (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mission_id INT NOT NULL,
        status ENUM('IN_PROGRESS', 'COMPLETED', 'GIVE_UP') DEFAULT 'IN_PROGRESS',
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME NULL,
        UNIQUE KEY uniq_user_mission (user_id, mission_id),
        CONSTRAINT fk_um_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        CONSTRAINT fk_um_mission FOREIGN KEY (mission_id) REFERENCES mission(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. 기본 음식 카테고리 시드 데이터 (이미 있으면 무시)
    await connection.query(`
      INSERT IGNORE INTO food_category (id, name) VALUES
        (1, '한식'),
        (2, '중식'),
        (3, '일식'),
        (4, '양식'),
        (5, '분식'),
        (6, '카페/디저트');
    `);

    // 12. 기본 지역 시드 데이터
    await connection.query(`
      INSERT IGNORE INTO region (id, name) VALUES
        (1, '서울'),
        (2, '부산'),
        (3, '대구'),
        (4, '인천'),
        (5, '광주'),
        (6, '대전'),
        (7, '울산');
    `);

    console.log(`[db]: '${dbName}' 데이터베이스/테이블 초기화 완료`);
  } finally {
    await connection.end();
  }
};
