import { pool } from "../db.config.js";
// 1. 사용자가 이미 도전 중(또는 완료/포기)한 미션인지 확인
export const isAlreadyChallenged = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT EXISTS(SELECT 1 FROM user_mission WHERE user_id = ? AND mission_id = ?) AS isExist;`, [userId, missionId]);
        return Boolean(rows[0]?.isExist);
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 2. 미션 도전 시작 (user_mission INSERT)
export const startUserMission = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await pool.query(`INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, 'IN_PROGRESS');`, [userId, missionId]);
        return result.insertId;
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 3. user_mission 단건 조회
export const getUserMission = async (userMissionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT * FROM user_mission WHERE id = ?;`, [userMissionId]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 4. 사용자 존재 여부
export const existsUser = async (userId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT EXISTS(SELECT 1 FROM user WHERE id = ?) AS isExist;`, [userId]);
        return Boolean(rows[0]?.isExist);
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
//# sourceMappingURL=user-mission.repository.js.map