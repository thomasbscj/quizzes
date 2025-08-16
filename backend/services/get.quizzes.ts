import pool from "../postgre.connect";
import { QueryResult } from "pg"

export async function getAllQuizzes() : Promise<QueryResult> {
    let result = await pool.query(`SELECT id, title FROM quizzes`)
    return result 
}

export async function getQuizById( id : Number ) : Promise<QueryResult> {
    let quiz = await pool.query(`
    SELECT 
        q.id AS quiz_id,
        q.title AS quiz_title,
        json_agg(
            json_build_object(
                'id', ques.id,
                'question', ques.question,
                'type', ques.type,
                'options', ques.options
            )
        ) AS questions
    FROM quizzes q
    LEFT JOIN questions ques ON ques.quiz_id = q.id
    WHERE q.id = $1
    GROUP BY q.id, q.title;`, [id]
)
    return quiz
}