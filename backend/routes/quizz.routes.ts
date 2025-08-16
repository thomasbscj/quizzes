import { Router, Request, Response } from "express"
import pool from "../postgre.connect"
import { QueryResult } from "pg"
import { getAllQuizzes, getQuizById } from "../services/get.quizzes"
import { createQuiz, QuizInput } from "../services/post.quizzes"
import { deleteQuizById } from "../services/delete.quizzes"

const quizRouter: Router = Router()

// CORRIGIDO: Adicionar req: Request
quizRouter.get("/", async (req: Request, res: Response) => {
    try {
        const quizzes: QueryResult = await getAllQuizzes()
        return res.status(200).json(quizzes.rows) // CORRIGIDO: retornar apenas .rows
    } catch (err) {
        console.error("Error in GET /:", err);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

// CORRIGIDO: Tornar async e await
quizRouter.post("/", async (req: Request, res: Response) => {
    try {
        const quiz: QuizInput = req.body
        
        // ADICIONADO: Validação básica
        if (!quiz.title || !quiz.questions || quiz.questions.length === 0) {
            return res.status(400).json({ error: "Missing title or questions" })
        }
        
        const result = await createQuiz(quiz) // CORRIGIDO: await
        return res.status(201).json({ message: "Created", quizId: result.quizId })
    } catch (err) {
        console.error("Error in POST /:", err);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

quizRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        
        // ADICIONADO: Validação de ID
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" })
        }
        
        const quiz: QueryResult = await getQuizById(id)
        if (quiz.rows.length === 0) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        return res.status(200).json(quiz.rows[0])
    } catch (err) {
        console.error("Error in GET /:id:", err);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

quizRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" }) // CORRIGIDO: mensagem consistente
    }

    try {
        const deleted = await deleteQuizById(id)
        if (!deleted) { // CORRIGIDO: checar boolean
            return res.status(404).json({ error: "Quiz not found" })
        }
        return res.status(200).json({ message: "Quiz deleted successfully" })
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

export default quizRouter
