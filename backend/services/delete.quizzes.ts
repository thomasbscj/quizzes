import pool from "../postgre.connect";
import { QueryResult } from "pg"

export async function deleteQuizById(id: number): Promise<boolean> { 
    try {
        await pool.query("BEGIN")
        
        const result: QueryResult = await pool.query(`
            DELETE FROM quizzes WHERE id = $1 RETURNING *`, [id]
        )
        
        await pool.query("COMMIT")
        
        return result.rowCount !== null && result.rowCount > 0; 
        
    } catch (err) {
        await pool.query("ROLLBACK")
        console.error("Error deleting quiz:", err);
        throw err; 
    }
}
