import { Pool } from "pg";
import pool from "../postgre.connect";

export interface QuestionInput {
  question: string
  type: string
  options?: any[]
}

export interface QuizInput {
  title: string
  questions: QuestionInput[]
}

export async function createQuiz(quiz : QuizInput) : Promise<any>{
    try{
        await pool.query("BEGIN")
        let quizResult = await pool.query(
            "INSERT INTO quizzes (title) VALUES ($1) RETURNING id",
            [quiz.title]
        )
        let  quizId = quizResult.rows[0].id;
        for (let q of quiz.questions) {
            await pool.query(
            "INSERT INTO questions (quiz_id, question, type, options) VALUES ($1, $2, $3, $4)",
            [quizId, q.question, q.type, q.options ? JSON.stringify(q.options) : null]
        )
    }
        await pool.query("COMMIT")
    }catch(err){
        pool.query("ROLLBACK")
        return err
    }
}