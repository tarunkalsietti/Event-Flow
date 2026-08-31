import express from "express";
import dotenv from "dotenv"
import app from "./app";
import {db, initializeDatabase} from "./db/index";
const PORT=process.env.PORT || 3000;
const server=async()=>{
    try{
       const result= await db.query('SELECT NOW()');
    console.log(`✅ Connected to Supabase PostgreSQL at: ${result.rows[0].now}`);
    await initializeDatabase();

    app.listen(PORT,()=>{
        console.log(`🚀 Server is running on port ${PORT}`);
    })
    }catch(error){
        console.error('❌ Failed to start server:', error);
    process.exit(1);
    }
}

server();
