import crypto from "crypto"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { json } from "stream/consumers";
const SALT_ROUNDS =10;

const jwttoken=process.env.JWT_SECRET  || "fallback_super_secret_jwt_key";

// ============================================================
// 1. PASSWORD HASHING (Human Dashboard Signups & Logins)
// ============================================================

export  const hashpasswrod =async (password:string):Promise<string>=>{
    return bcrypt.hash(password,SALT_ROUNDS)
}

export async function comparepassword(password:string, hash:string)
:Promise<boolean>{
    return bcrypt.compare(password,hash)
}

// ============================================================
// 2. API KEY HELPERS (Server-to-Server Authentication)
// ============================================================



export function generateapikey():string{
    const randomhex=crypto.randomBytes(24).toString("hex");
    return `ef_live_${randomhex}`;
}

// Produces a fixed 64-character SHA-256 hex string for Postgres

export function hashapikey(apikey:string):string{
    return crypto.createHash("sha256").update(apikey).digest("hex");
}


// ============================================================
// 3. HMAC WEBHOOK HELPERS (Webhook Tamper-Proofing)
// ============================================================

export function generatehmacsecret():string{
    const randomhex=crypto.randomBytes(24).toString("hex");
    return `efhmac_${randomhex}`
}

export function generatehmacsignature(hmacsecret:string, payload:any):string{
    const body=typeof payload==="string" ? payload : JSON.stringify(payload)
const signature=crypto.createHmac("sha256",hmacsecret).update(body).digest("hex")
return signature
}
