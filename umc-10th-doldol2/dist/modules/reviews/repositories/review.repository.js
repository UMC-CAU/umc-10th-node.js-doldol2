import { pool } from "../../users/db.config.js";
// 1. 리뷰 등록
export const addReview = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await pool.query(`INSERT INTO review (store_id, user_id, content, rating) VALUES (?, ?, ?, ?);`, [data.storeId, data.userId, data.content, data.rating]);
        return result.insertId;
    }
    catch (err) {
        throw new Error(`오류가 발생했어요: ${err}`);
    }
    finally {
        conn.release();
    }
};
// 2. 리뷰 단건 조회
export const getReview = async (reviewId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query(`SELECT * FROM review WHERE id = ?;`, [reviewId]);
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
//# sourceMappingURL=review.repository.js.map