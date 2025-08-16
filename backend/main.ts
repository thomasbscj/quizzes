import express = require("express")
import * as dotenv from "dotenv"
import quizRouter from "./routes/quizz.routes";
import { initPG } from "./postgre.connect";
dotenv.config()
const PORT = process.env.PORT;

const app = express()
try{
    initPG();
    console.log("Successfully connected to PostgreSQL")
}catch(err){
    console.log(`Could not initiate Postgre ${err}`)
}

app.use(express.json())
app.use("/quizzes", quizRouter)

app.listen(PORT, ()=>{
    console.log(`Server running in port: ${PORT}`)
}
)
