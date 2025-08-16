import pool from "../postgre.connect";
import { QueryResult } from "pg"

export async function deleteQuizById(id : number) : Promise<any> {
    const quizId : number = id
    try{
        pool.query("BEGIN")
        const result : QueryResult = await pool.query(`
            DELETE FROM quizzes WHERE id = $1 RETURNING *`,[quizId]
        )
        await pool.query("COMMIT")
        if(result.rowCount === 0){
            return 404
        }        
    }catch(err){
        await pool.query("ROLLBACK")
        return err
    }
}