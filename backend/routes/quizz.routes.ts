import {Router, Request, Response} from "express"
import pool from "../postgre.connect"
import { QueryResult } from "pg"
import { getAllQuizzes, getQuizById } from "../services/get.quizzes"
import { createQuiz, QuizInput } from "../services/post.quizzes"
import { PxfObject } from "tls"
import { deleteQuizById } from "../services/delete.quizzes"

const quizRouter : Router = Router()

quizRouter.get("/", async (res : Response) => {
    try{
        let quizzes : QueryResult = await getAllQuizzes()
        return res.status(200).json(quizzes)
    }catch(err){
        return res.status(500).json( { error : "Internal Server Error"} )
    }
})

quizRouter.post("/", (req : Request, res : Response) => {
    try{
        let quiz : QuizInput = req.body
        createQuiz(quiz)
        return res.status(201).json( { message : "Created" } )
    }catch(err){
        return res.status(500).json( { error : "Internal Server Error" } )
    }
})

quizRouter.get("/:id", async (req : Request, res : Response) => {
    try{
        let quiz : QueryResult = await getQuizById(Number(req.params.id))
        if (quiz.rows.length === 0){
            return res.status(404).json({ error: "Quiz not found" } );
        }
        return res.status(200).json(quiz.rows[0])
    }catch(err){
        return res.status(500).json( { error : "Internal Server Error" } )
    }
})

quizRouter.delete("/:id", async (req : Request, res : Response) => {
    const id = Number(req.params.id)
    if(isNaN(id)){
        return res.status(400).json( { message : "Bad Request" } )
    }

    try{
        const exists = await deleteQuizById(id)
        if(exists === 404){ return res.status(404).json( { message : "Not Found"})}
        return res.status(200).json( { message : "Deleted"})
    }catch(err){
        return res.status(500).json( { error : "Internal Server Error" } )
    }
}) 
export default quizRouter