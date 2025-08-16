import pool from "../postgre.connect";
import { QueryResult } from "pg"

export async function getAllQuizzes(): Promise<QueryResult> {
    try {
        const result = await pool.query(`
            SELECT 
                q.id, 
                q.title,
                COUNT(ques.id) as question_count
            FROM quizzes q
            LEFT JOIN questions ques ON ques.quiz_id = q.id
            GROUP BY q.id, q.title
            ORDER BY q.created_at DESC
        `);
        return result;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw error;
    }
}

export async function getQuizById(id: number): Promise<QueryResult> {
    try {
        const quiz = await pool.query(`
            SELECT 
                q.id AS quiz_id,
                q.title AS quiz_title,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ques.id,
                            'question', ques.question,
                            'type', ques.type,
                            'options', ques.options
                        ) ORDER BY ques.position
                    ) FILTER (WHERE ques.id IS NOT NULL),
                    '[]'::json
                ) AS questions
            FROM quizzes q
            LEFT JOIN questions ques ON ques.quiz_id = q.id
            WHERE q.id = $1
            GROUP BY q.id, q.title
        `, [id]);
        
        return quiz;
    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        throw error;
    }
}
