import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path"
import {fileURLToPath} from "url";


dotenv.config();

const {Pool} = pg;


// 3. GET CURRENT FOLDER PATH (ESM Mode)
// ==========================================
const __filename = fileURLToPath(import.meta.url); // Converts URL -> "C:\...\src\db\index.ts"
const __dirname = path.dirname(__filename);         // Strips filename -> "C:\...\src\db"


export const pool=new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false
    }
});

// create and export an query helper object

export const db={
    query:(text:string , params?:any[])=>{
        return pool.query(text,params);
    }
}



// ==========================================
// 5. DATABASE AUTO-INITIALIZER FUNCTION
// ==========================================
export async function initializeDatabase() {
  try {
    // Step A: Find the exact location of schema.sql on disk
    const schemaPath = path.join(__dirname, "schema.sql");
    
    // Step B: Read all the SQL text inside that file as a string
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    
    // Step C: Send that SQL text to Supabase to create the tables
    await db.query(schemaSql);
    console.log("✅ Database tables and indexes initialized successfully");
    
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error);
    throw error; // Stop the server if table creation fails
  }
}