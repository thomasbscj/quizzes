import express = require("express")
import cors from "cors"
import * as dotenv from "dotenv"
import quizRouter from "./routes/quizz.routes";
import { initPG } from "./postgre.connect";

dotenv.config()
const PORT = process.env.PORT || 8080; 

const app = express()


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));


async function startServer() {
    try {
        await initPG();
        console.log("Successfully connected to PostgreSQL")
    } catch (err) {
        console.log(`Could not initiate Postgre ${err}`)
        process.exit(1);
    }

    app.use(express.json())
    app.use("/quizzes", quizRouter)

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`)
    })
}

startServer();