import { error } from "node:console";
import {db} from "../db/index"
import { hashpasswrod, comparepassword, signJwt } from "../utils/crypto"
import dotenv from "dotenv"

export interface sign{
 name : string,
 email:string,
 password:string,

}
export class Authentication{

    async signin(data:sign):Promise<any>{
      
        if(!data.email || !data.name || !data.password){
            throw new Error("")
        }
       const email=data?.email;
       const existing=db.query("select id from users where email=$1",[email.toLowerCase])
       if((await existing).rows.length>0) {
        throw new Error("EMAIL_EXISTS")
       }

       const password=data?.password
       if(!password){
        throw new Error("password required")
       }
       const hashing=hashpasswrod(password)
       const result=await db.query("insert into table users(name,email,password_hash, created_at",
        [data.name,email.toLowerCase,hashing]
       );
       const user=result.rows[0];
       const token =signJwt({userId:user.id});
       return {user,token};

  
    }
    
}