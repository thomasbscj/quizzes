import { Pool } from "pg"
import * as dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPWD,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    database: process.env.DATABASE,
})

async function initPG() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quizzes (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
                question TEXT NOT NULL,  -- CORRIGIDO: era question_text
                type TEXT NOT NULL,      -- CORRIGIDO: era question_type  
                options JSONB,           -- CORRIGIDO: usar JSONB em vez de posição
                position INT DEFAULT 0
            );
        `);
        
        console.log("Database tables created/verified successfully");
    } catch (error) {
        console.error("Error creating database tables:", error);
        throw error;
    }
}

export { initPG }
export default pool
