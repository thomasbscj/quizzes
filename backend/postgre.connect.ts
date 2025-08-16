import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPWD,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    database: process.env.DATABASE,
})

async function initPG(){
    await pool.query(`

        CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type TEXT NOT NULL, 
        position INT
        );

        CREATE TABLE IF NOT EXISTS choices (
        id SERIAL PRIMARY KEY,
        question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        choice_text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE
        );

    `)
}

export { initPG }
export default pool