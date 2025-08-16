import Express from "express"
import dotenv from 'dotenv'
import quizRouter from "./routes/quizz.routes";
import { initPG } from "./postgre.connect";
dotenv.config()
const PORT = process.env.PORT;

let app = Express()
initPG();

app.use("/quizzes", quizRouter)

app.listen(PORT, ()=>{
    console.log(`Server running in port: ${PORT}`)
}
)