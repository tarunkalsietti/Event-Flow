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
  token :string
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
    
}