import { Request, Response } from "express";
import { Authenticationservice, sign  , login } from "../services/authservice";

const auth= new Authenticationservice();

export class authcontroller{
    signin=async(req:Request,res:Response):Promise<void>=>{
        try{
       const {name , email , password} = req.body
       if(!name || !email || !password){
        res.status(401).json({
            message:"credential are missing",
            data:null
        })
       }
     const signin=await auth.signin(req.body)
     
        }catch(error:any){

        }
    }
}