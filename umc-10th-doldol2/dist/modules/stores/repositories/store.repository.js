import { pool } from "../../users/db.config.js";
// 1. 가게 등록
export const addStore = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await pool.query(`INSERT INTO store (region_id, name, address) VALUES (?, ?, ?);`, [data.regionId, data.name, data.address]);
        return result.insertId;
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 2. 가게 단건 조회
export const getStore = async (storeId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT * FROM store WHERE id = ?;`, [storeId]);
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
// 3. 지역 존재 여부 확인
export const existsRegion = async (regionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT EXISTS(SELECT 1 FROM region WHERE id = ?) AS isExist;`, [regionId]);
        return Boolean(rows[0]?.isExist);
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 4. 가게 존재 여부 확인 (다른 모듈에서 import해서 씀)
export const existsStore = async (storeId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) AS isExist;`, [storeId]);
        return Boolean(rows[0]?.isExist);
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
//# sourceMappingURL=store.repository.js.map