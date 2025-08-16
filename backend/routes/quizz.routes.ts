import {Router, Request, Response} from "express"
import pool from "../postgre.connect"

const quizRouter = Router()

quizRouter.get("/", (req : Request, res : Response) => {

})

quizRouter.post("/", (req : Request, res : Response) => {

})

quizRouter.get("/:id", (req : Request, res : Response) => {

})

quizRouter.delete("/:id", (req : Request, res : Response) => {

})
export default quizRouter