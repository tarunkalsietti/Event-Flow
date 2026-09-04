import { error } from "node:console";
import {db} from "../db/index"
import { hashpasswrod, comparepassword, signJwt } from "../utils/crypto"
import dotenv from "dotenv"


export interface login{
    email : string,
    password: string
}
export interface sign extends login{
name :string,
 password:string,

}

export interface signinresponse{
    user:sign,
    created_at:Date,
    token:string
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  token?: string;
}


export class Authenticationservice{

    async signin(data:sign):Promise<{user:User ; token :string}>{
      
        if(!data.email || !data.name || !data.password){
            throw new Error("")
        }
       const email=data?.email;
       const existing=await db.query("select id from users where email=$1",[email.toLowerCase()])
       if(( existing).rows.length>0) {
        throw new Error("EMAIL_EXISTS")
       }

       const password=data?.password
       if(!password){
        throw new Error("password required")
       }
       const hashing=await hashpasswrod(password)
        const result = await db.query(
      `INSERT INTO users (name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [data.name, email, hashing]
    );

       const user=result.rows[0] as User;
       const token =signJwt({userId:user.id});
       return {user,token};

  
    }

    async login(data: login): Promise<{ user: User; token: string }> {
        if (!data.email || !data.password) {
            throw new Error("CREDENTIALS_REQUIRED");
        }

        const email = data.email.toLowerCase().trim();
        const result = await db.query(
            "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const userRow = result.rows[0];
        const isPasswordValid = await comparepassword(data.password, userRow.password_hash);
        if (!isPasswordValid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const token = signJwt({ userId: userRow.id });
        const user: User = {
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            created_at: userRow.created_at,
            token
        };

        return { user, token };
    }
}