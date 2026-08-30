import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {Pool} = pg;

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