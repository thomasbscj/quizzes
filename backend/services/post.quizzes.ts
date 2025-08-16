import { Pool } from "pg";
import pool from "../postgre.connect";

export interface QuestionInput {
    question: string
    type: string
    options?: string[] // CORRIGIDO: mais específico
}

export interface QuizInput {
    title: string
    questions: QuestionInput[]
}

export async function createQuiz(quiz: QuizInput): Promise<any> {
    try {
        await pool.query("BEGIN")
        
        const quizResult = await pool.query(
            "INSERT INTO quizzes (title) VALUES ($1) RETURNING id",
            [quiz.title]
        )
        const quizId = quizResult.rows[0].id;

        // CORRIGIDO: Usar for...of para melhor tratamento de async
        for (const [index, q] of quiz.questions.entries()) {
            await pool.query(
                "INSERT INTO questions (quiz_id, question, type, options, position) VALUES ($1, $2, $3, $4, $5)",
                [quizId, q.question, q.type, q.options ? JSON.stringify(q.options) : null, index]
            )
        }
        
        await pool.query("COMMIT")
        return { success: true, quizId }; // CORRIGIDO: retorno consistente
        
    } catch (err) {
        await pool.query("ROLLBACK") // CORRIGIDO: await no rollback
        console.error("Error creating quiz:", err);
        throw err; // CORRIGIDO: throw em vez de return
    }
}
