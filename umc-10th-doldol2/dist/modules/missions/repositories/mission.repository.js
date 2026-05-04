import { pool } from "../../users/db.config.js";
// 1. 미션 등록
export const addMission = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await pool.query(`INSERT INTO mission (store_id, title, content, reward, deadline) VALUES (?, ?, ?, ?, ?);`, [data.storeId, data.title, data.content, data.reward, data.deadline]);
        return result.insertId;
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 2. 미션 단건 조회
export const getMission = async (missionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT * FROM mission WHERE id = ?;`, [missionId]);
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
// 3. 미션 존재 여부 확인 (다른 모듈에서 사용)
export const existsMission = async (missionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) AS isExist;`, [missionId]);
        return Boolean(rows[0]?.isExist);
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
//# sourceMappingURL=mission.repository.js.map